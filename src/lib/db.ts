import { Pool } from 'pg';

// Create a connection pool for PostgreSQL
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Test the connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('PostgreSQL pool error:', err);
});

export { pool };

// Helper function to execute queries
export async function query(text: string, params?: unknown[]) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Event management functions
export async function getEvent(eventType: string) {
  const result = await query(
    'SELECT * FROM events WHERE event_type = $1',
    [eventType]
  );
  return result.rows[0];
}

export async function checkTicketAvailability(eventType: string): Promise<{ available: number; total: number }> {
  const result = await query(
    'SELECT total_tickets, sold_tickets FROM events WHERE event_type = $1',
    [eventType]
  );
  
  if (result.rows.length === 0) {
    throw new Error(`Event ${eventType} not found`);
  }
  
  const { total_tickets, sold_tickets } = result.rows[0];
  return {
    available: total_tickets - sold_tickets,
    total: total_tickets
  };
}

export async function reserveTicket(eventType: string): Promise<boolean> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Check availability with row lock
    const result = await client.query(
      'SELECT total_tickets, sold_tickets FROM events WHERE event_type = $1 FOR UPDATE',
      [eventType]
    );
    
    if (result.rows.length === 0) {
      throw new Error(`Event ${eventType} not found`);
    }
    
    const { total_tickets, sold_tickets } = result.rows[0];
    
    if (sold_tickets >= total_tickets) {
      await client.query('ROLLBACK');
      return false; // No tickets available
    }
    
    // Increment sold tickets
    await client.query(
      'UPDATE events SET sold_tickets = sold_tickets + 1 WHERE event_type = $1',
      [eventType]
    );
    
    await client.query('COMMIT');
    return true;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function recordRegistration(data: {
  eventType: string;
  confirmationNumber: string;
  sessionId: string;
  participantEmail: string;
  participantName: string;
  participantPhone: string;
  amount: number;
}) {
  await query(
    `INSERT INTO registrations 
     (event_type, confirmation_number, session_id, participant_email, participant_name, participant_phone, amount, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
    [
      data.eventType,
      data.confirmationNumber,
      data.sessionId,
      data.participantEmail,
      data.participantName,
      data.participantPhone,
      data.amount
    ]
  );
}