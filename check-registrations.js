require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

async function checkRegistrations() {
  console.log('🔍 Checking recent registrations...\n');
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const result = await pool.query('SELECT * FROM registrations ORDER BY created_at DESC LIMIT 10');
    
    if (result.rows.length === 0) {
      console.log('📋 No registrations found in database');
    } else {
      console.log('📋 Recent registrations:');
      result.rows.forEach((row, index) => {
        console.log(`${index + 1}. Confirmation: ${row.confirmation_number}`);
        console.log(`   Email: ${row.participant_email}`);
        console.log(`   Event: ${row.event_name}`);
        console.log(`   Date: ${row.created_at}`);
        console.log(`   Session: ${row.stripe_session_id}`);
        console.log('');
      });
    }
  } catch (error) {
    console.log('❌ Database error:', error.message);
  } finally {
    await pool.end();
  }
}

checkRegistrations();