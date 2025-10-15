import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function importJson(filePath: string): Promise<any | null> {
  try {
    if (!existsSync(filePath)) return null;
    const raw = await readFile(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Failed reading ${filePath}:`, err);
    return null;
  }
}

async function main() {
  const dataDir = join(process.cwd(), 'data');

  // Import about.json → AboutPage
  const aboutPath = join(dataDir, 'about.json');
  const aboutJson = await importJson(aboutPath);
  if (aboutJson) {
    await prisma.aboutPage.upsert({
      where: { id: 'default' },
      create: { id: 'default', data: aboutJson },
      update: { data: aboutJson },
    });
    console.log('Imported about.json → about_page (id="default")');
  } else {
    console.log('No about.json found or invalid JSON. Skipping.');
  }

  // Import global-settings.json → SiteSettings
  const settingsPath = join(dataDir, 'global-settings.json');
  const settingsJson = await importJson(settingsPath);
  if (settingsJson) {
    await prisma.siteSettings.upsert({
      where: { id: 'default' },
      create: { id: 'default', data: settingsJson },
      update: { data: settingsJson },
    });
    console.log('Imported global-settings.json → site_settings (id="default")');
  } else {
    console.log('No global-settings.json found or invalid JSON. Skipping.');
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


