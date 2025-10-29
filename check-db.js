// Check current database state
require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkDatabase() {
  try {
    console.log('Checking current database state...');
    
    // Check events table
    const events = await pool.query('SELECT * FROM events');
    console.log('\n=== EVENTS TABLE ===');
    console.table(events.rows);
    
    // Check registrations table
    const registrations = await pool.query('SELECT * FROM registrations ORDER BY created_at DESC');
    console.log('\n=== REGISTRATIONS TABLE ===');
    console.table(registrations.rows);
    
  } catch (error) {
    console.error('Error checking database:', error);
  } finally {
    await pool.end();
  }
}

checkDatabase();