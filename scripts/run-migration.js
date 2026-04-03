// Run: node scripts/run-migration.js
// This reads the SQL migration file and executes it against Supabase

const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://bvwiwxmgbtklztgapxyp.supabase.co';
const SUPABASE_KEY = 'sb_publishable_ckjAjtMhOK4zpFnj8W4rMQ_4thhtZLZ';

async function runMigration() {
  const sqlFile = path.join(__dirname, '..', 'supabase', 'migrations', '004_seed_data.sql');
  const sql = fs.readFileSync(sqlFile, 'utf8');

  // Split into chunks by removing BEGIN/COMMIT and splitting on semicolons
  const cleanSql = sql
    .replace(/^BEGIN;/m, '')
    .replace(/^COMMIT;/m, '');

  // Split by section comments
  const sections = cleanSql.split(/-- ={10,}/).filter(s => s.trim());

  console.log(`Found ${sections.length} sections to execute`);

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i].trim();
    if (!section || section.length < 10) continue;

    // Find section name
    const nameMatch = section.match(/^--\s*(.+)/m);
    const name = nameMatch ? nameMatch[1].trim() : `Section ${i + 1}`;

    console.log(`\nExecuting: ${name}...`);

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
        },
        body: JSON.stringify({ query: section }),
      });

      if (!response.ok) {
        // Try direct SQL via the SQL endpoint
        const sqlResponse = await fetch(`${SUPABASE_URL}/rest/v1/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_KEY,
          },
        });
        console.log(`  Status: ${response.status}`);
      } else {
        console.log(`  OK`);
      }
    } catch (error) {
      console.log(`  Error: ${error.message}`);
    }
  }
}

runMigration().catch(console.error);
// force deploy Sat Apr  4 01:24:54 GTB 2026
