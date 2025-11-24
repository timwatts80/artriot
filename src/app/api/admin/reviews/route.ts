import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export async function GET() {
  try {
    // Fetch all reviews from database, ordered by most recent first
    const query = `
      SELECT 
        id,
        rating,
        review_text,
        reviewer_name,
        reviewer_email,
        event_type,
        discount_code,
        created_at,
        updated_at
      FROM reviews 
      ORDER BY created_at DESC
    `;
    
    const result = await pool.query(query);

    console.log(`Fetched ${result.rows.length} reviews for admin dashboard`);

    return NextResponse.json({
      success: true,
      reviews: result.rows,
      count: result.rows.length
    });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}