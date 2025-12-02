import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export async function GET() {
  try {
    // Fetch public review data, ordered by most recent first
    // Only fetching 4-5 star reviews for testimonials
    const query = `
      SELECT 
        id,
        rating,
        review_text,
        reviewer_name,
        event_type,
        created_at
      FROM reviews 
      WHERE rating >= 4
      ORDER BY created_at DESC
      LIMIT 6
    `;
    
    const result = await pool.query(query);

    // Process names to only show First Name + Last Initial if needed, 
    // but for now let's just use what's in the DB or split it on the client.
    // Actually, let's split it here to be safe.
    const reviews = result.rows.map(review => ({
      ...review,
      reviewer_name: review.reviewer_name.split(' ')[0] // Just first name
    }));

    return NextResponse.json({
      success: true,
      reviews: reviews
    });

  } catch (error) {
    console.error('Error fetching public reviews:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}
