// Database initialization script
require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

console.log('Environment check:');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Missing');
console.log('POSTGRES_URL:', process.env.POSTGRES_URL ? 'Set' : 'Missing');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function initializeDatabase() {
  try {
    console.log('Initializing database...');

    // Create events table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        event_type VARCHAR(100) UNIQUE NOT NULL,
        event_name VARCHAR(200) NOT NULL,
        event_date VARCHAR(100) NOT NULL,
        total_tickets INTEGER NOT NULL DEFAULT 20,
        sold_tickets INTEGER NOT NULL DEFAULT 0,
        price_cents INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create registrations table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS registrations (
        id SERIAL PRIMARY KEY,
        event_type VARCHAR(100) NOT NULL,
        confirmation_number VARCHAR(20) NOT NULL,
        session_id VARCHAR(200) NOT NULL,
        participant_email VARCHAR(200) NOT NULL,
        participant_name VARCHAR(200) NOT NULL,
        participant_phone VARCHAR(50),
        amount DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (event_type) REFERENCES events(event_type)
      )
    `);

    // Insert initial event data
    await pool.query(`
      INSERT INTO events (event_type, event_name, event_date, total_tickets, price_cents)
      VALUES 
        ('frequencies-flow', 'Frequencies Flow: Sound Healing Experience', 'December 7, 2024 at 7:00 PM', 20, 5500),
        ('somatic-movement', 'Body Wisdom: Somatic Art Journey', 'TBD', 20, 5500),
        ('meditation', 'Breathe & Create: Deep Meditation Studio', 'TBD', 15, 5500),
        ('art-riot-live', 'Art Riot Live Experience', 'Coming Soon', 20, 5500)
      ON CONFLICT (event_type) DO UPDATE SET 
        price_cents = EXCLUDED.price_cents,
        total_tickets = EXCLUDED.total_tickets
    `);

    console.log('Database initialized successfully!');
    
    // Show current events
    const result = await pool.query('SELECT * FROM events');
    console.log('\nCurrent events:');
    console.table(result.rows);

  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await pool.end();
  }
}

initializeDatabase();