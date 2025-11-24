'use client';

import { useState, useEffect } from 'react';

interface Review {
  id: number;
  rating: number;
  review_text: string;
  reviewer_name: string;
  reviewer_email: string;
  event_type: string;
  discount_code: string;
  created_at: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/admin/reviews');
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      const data = await response.json();
      setReviews(data.reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const getEventName = (eventType: string) => {
    const eventNames: { [key: string]: string } = {
      'frequencies-flow': 'Frequencies + Flow',
      'meditation': 'Breathe & Create: Deep Meditation Studio',
      'somatic-movement': 'Body Wisdom: Somatic Art Journey',
      'art-meditation': 'Art & Meditation (Virtual)'
    };
    return eventNames[eventType] || eventType;
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-600'}`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        ))}
        <span className="ml-2 text-sm text-gray-400">({rating}/5)</span>
      </div>
    );
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white">
        <div className="max-w-6xl mx-auto px-6 pt-36 pb-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading reviews...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-black text-white">
        <div className="max-w-6xl mx-auto px-6 pt-36 pb-20">
          <div className="text-center">
            <p className="text-red-400 text-lg">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg"
              style={{ backgroundColor: '#f11568' }}
            >
              Retry
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-6 pt-36 pb-20">
        <div className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            Customer Reviews Dashboard
          </h1>
          <div className="flex items-center justify-between">
            <p className="text-xl text-gray-300">
              Total Reviews: {reviews.length}
            </p>
            {reviews.length > 0 && (
              <div className="text-right">
                <p className="text-lg font-medium">
                  Average Rating: {' '}
                  <span className="text-yellow-400">
                    {(reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)}/5
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-400">No reviews submitted yet.</p>
            <p className="text-gray-500 mt-2">Reviews will appear here once customers start submitting them.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">{review.reviewer_name}</h3>
                    <p className="text-gray-400 text-sm mb-2">{review.reviewer_email}</p>
                    {renderStars(review.rating)}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">
                      {new Date(review.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    <p className="text-sm text-primary-500 mt-1" style={{ color: '#f11568' }}>
                      {getEventName(review.event_type)}
                    </p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-gray-200 leading-relaxed">{review.review_text}</p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  <div className="text-sm text-gray-400">
                    Review ID: #{review.id}
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-400">Discount Code: </span>
                    <span className="font-mono bg-gray-800 px-2 py-1 rounded text-primary-400" style={{ color: '#f11568' }}>
                      {review.discount_code}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}