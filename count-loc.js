#!/usr/bin/env node
// count-loc.js
// Usage: node count-loc.js [path]
// Counts lines for common UI file types and prints breakdown + total.

const fs = require('fs').promises;
const path = require('path');

const root = process.argv[2] || '.';

// File extensions considered "UI" (customize as needed)
const exts = new Set(['.js', '.jsx', '.ts', '.tsx', '.css', '.scss', '.sass', '.less', '.html', '.mdx', '.md']);

// Directories to skip
const skipDirs = new Set(['node_modules', '.next', 'dist', 'out', '.git', 'public', 'build']);

async function isDir(p) {
  try {
    const st = await fs.stat(p);
    return st.isDirectory();
  } catch {
    return false;
  }
}

async function countLinesInFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    if (content.length === 0) return 0;
    // count '\n' and add 1 (handles files without trailing newline)
    return content.split('\n').length;
  } catch {
    return 0;
  }
}

async function walk(dir, results) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const ent of entries) {
    const name = ent.name;
    if (ent.isDirectory()) {
      if (skipDirs.has(name)) continue;
      await walk(path.join(dir, name), results);
    } else if (ent.isFile()) {
      const ext = path.extname(name).toLowerCase();
      if (exts.has(ext)) {
        results.files.push(path.join(dir, name));
      }
    }
  }
}

(async () => {
  const results = { files: [] };
  const base = path.resolve(root);
  if (!(await isDir(base))) {
    console.error('Path is not a directory:', base);
    process.exit(1);
  }
  await walk(base, results);

  const stats = {};
  let total = 0;
  for (const f of results.files) {
    const ext = path.extname(f).toLowerCase() || '(noext)';
    const lines = await countLinesInFile(f);
    stats[ext] = (stats[ext] || 0) + lines;
    total += lines;
  }

  console.log(`Scanned ${results.files.length} files under ${base}`);
  console.log('Lines by extension:');
  const sorted = Object.keys(stats).sort((a,b)=>stats[b]-stats[a]);
  for (const ext of sorted) {
    console.log(`  ${ext.padEnd(5)} : ${stats[ext].toLocaleString()}`);
  }
  console.log('---------------------------');
  console.log('TOTAL lines (UI extensions):', total.toLocaleString());
})();
