#!/usr/bin/env tsx

/**
 * Execute RLS Fix Script
 * 
 * This script executes the SQL to fix RLS policies directly
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function executeRLSFix() {
  console.log('🔧 Executing RLS Policy Fix');
  console.log('============================');
  console.log('');

  try {
    // Read the SQL file
    const sqlPath = join(process.cwd(), 'scripts', 'fix-rls-direct.sql');
    const sql = readFileSync(sqlPath, 'utf8');
    
    // Split into individual statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`📝 Executing ${statements.length} SQL statements...`);
    console.log('');

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim() === '') continue;

      try {
        console.log(`   ${i + 1}. Executing statement...`);
        const { error } = await supabaseAdmin.rpc('exec_sql', { sql: statement });
        
        if (error) {
          console.log(`   ⚠️  Statement ${i + 1} warning: ${error.message}`);
          // Don't count as error if it's just a "already exists" warning
          if (!error.message.includes('already exists') && !error.message.includes('does not exist')) {
            errorCount++;
          } else {
            successCount++;
          }
        } else {
          console.log(`   ✅ Statement ${i + 1} executed successfully`);
          successCount++;
        }
      } catch (err) {
        console.log(`   ❌ Statement ${i + 1} failed: ${err}`);
        errorCount++;
      }
    }

    console.log('');
    console.log(`📊 Results: ${successCount} successful, ${errorCount} errors`);
    console.log('');

    if (errorCount === 0) {
      console.log('🎉 RLS policies fixed successfully!');
      console.log('');
      console.log('🧪 Test the fix:');
      console.log('================');
      console.log('Run: bun run debug-buckets');
      console.log('You should now see ✅ for all upload tests!');
    } else {
      console.log('⚠️  Some errors occurred, but policies might still be created');
      console.log('Try running: bun run debug-buckets');
    }

  } catch (err) {
    console.error('❌ Failed to execute RLS fix:', err);
    console.log('');
    console.log('📋 Manual Fix Required:');
    console.log('=======================');
    console.log('1. Go to your Supabase Dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy and paste the contents of scripts/fix-rls-direct.sql');
    console.log('4. Click "Run" to execute the SQL');
    console.log('5. Test with: bun run debug-buckets');
  }
}

executeRLSFix().catch(console.error);
