'use client';

import { useState, useEffect } from 'react';

interface Review {
  id: number;
  rating: number;
  review_text: string;
  reviewer_name: string;
  event_type: string;
  created_at: string;
}

export default function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await fetch('/api/reviews');
        if (response.ok) {
          const data = await response.json();
          setReviews(data.reviews);
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, []);

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
      </div>
    );
  };

  if (loading || reviews.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Community Stories
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Hear from participants about their Art Riot experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div 
              key={review.id} 
              className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-primary-500/50 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="font-semibold text-white">
                  {review.reviewer_name}
                </div>
                {renderStars(review.rating)}
              </div>
              
              <p className="text-gray-300 text-sm leading-relaxed mb-4 italic">
                &ldquo;{review.review_text}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
