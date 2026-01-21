require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

console.log('Initializing Vouchers Table...');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function createVouchersTable() {
  try {
    // Create vouchers table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS vouchers (
        id SERIAL PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'active', -- active, redeemed, cancelled
        purchaser_email VARCHAR(200) NOT NULL,
        recipient_email VARCHAR(200),
        message TEXT,
        value_type VARCHAR(50) DEFAULT 'single_ticket',
        order_id VARCHAR(200), -- Stripe Session ID
        redeemed_at TIMESTAMP WITH TIME ZONE,
        redeemed_for_event_id VARCHAR(100),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    console.log('✅ Vouchers table created successfully');
    
    // Verify table exists
    const result = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'vouchers'
    `);
    
    console.log('Table Schema:', result.rows.map(r => `${r.column_name} (${r.data_type})`).join(', '));

  } catch (error) {
    console.error('Error creating vouchers table:', error);
  } finally {
    await pool.end();
  }
}

createVouchersTable();
