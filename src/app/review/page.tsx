'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ReviewPage() {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [eventType, setEventType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDiscountCode, setShowDiscountCode] = useState(false);
  const [error, setError] = useState('');

  const eventOptions = [
    { value: 'frequencies-flow', label: 'Jade Bloom Wellness' },
    { value: 'meditation', label: 'Workshop SLC' },
    { value: 'somatic-movement', label: 'Sage Canvas Studio' },
    { value: 'art-meditation', label: 'Art & Meditation (Virtual)' },
    { value: 'breath-work-pleasant-grove', label: 'Breath Work in Pleasant Grove' },
    { value: 'other', label: 'Other' }
  ];

  const handleStarClick = (starRating: number) => {
    setRating(starRating);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (!rating || !review.trim() || !name.trim() || !email.trim() || !eventType) {
      setError('Please fill in all fields and provide a rating.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/submit-review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating,
          review: review.trim(),
          name: name.trim(),
          email: email.trim(),
          eventType,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      setShowDiscountCode(true);
    } catch (error) {
      console.error('Error submitting review:', error);
      setError('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showDiscountCode) {
    return (
      <main className="min-h-screen bg-black text-white">
        <div className="max-w-2xl mx-auto px-6 pt-36 pb-20">
          <div className="text-center">
            <div className="mb-8">
              <div className="w-20 h-20 mx-auto mb-6 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              </div>
              <h1 className="text-4xl font-bold mb-4">Thank You!</h1>
              <p className="text-xl text-gray-300 mb-8">
                We appreciate you taking the time to share your experience with us.
              </p>
            </div>

            <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#f11568' }}>
                Your Exclusive Discount
              </h2>
              <div className="bg-black rounded-lg p-6 border border-gray-700">
                <div className="text-3xl font-bold mb-2" style={{ color: '#f11568' }}>
                  THANKYOU20
                </div>
                <p className="text-gray-300 text-lg mb-4">
                  20% off your next session
                </p>
                <p className="text-sm text-gray-400">
                  Use this code when booking your next ArtRiot experience. 
                  Valid for 90 days from today.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <Link 
                href="/in-person-events"
                className="inline-block bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
                style={{ backgroundColor: '#f11568' }}
              >
                Book Your Next Session
              </Link>
              
              <div className="text-center">
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Return to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto px-6 pt-36 pb-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            Share Your Experience
          </h1>
          <p className="text-xl text-gray-300 max-w-lg mx-auto">
            We&apos;d love to hear about your ArtRiot session! Your feedback helps us create better experiences for our community.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Event Selection */}
          <div>
            <label htmlFor="eventType" className="block text-lg font-medium mb-3">
              Which session did you attend?
            </label>
            <select
              id="eventType"
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              required
              className="w-full p-4 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            >
              <option value="">Select an event</option>
              {eventOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-lg font-medium mb-3">
              How would you rate your overall experience?
            </label>
            <div className="flex items-center space-x-2 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStarClick(star)}
                  className="focus:outline-none transition-colors duration-200"
                >
                  <svg
                    className={`w-10 h-10 ${
                      star <= rating 
                        ? 'text-yellow-400' 
                        : 'text-gray-600 hover:text-yellow-200'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-400">Click the stars to rate your experience</p>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-lg font-medium mb-3">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-4 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              placeholder="Enter your full name"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-lg font-medium mb-3">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-4 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              placeholder="Enter your email address"
            />
          </div>

          {/* Review */}
          <div>
            <label htmlFor="review" className="block text-lg font-medium mb-3">
              Tell us about your experience
            </label>
            <textarea
              id="review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              required
              rows={5}
              className="w-full p-4 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 resize-vertical"
              placeholder="What did you enjoy most? How did the session impact you? Any suggestions for improvement?"
            />
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:transform-none"
            style={{ backgroundColor: isSubmitting ? undefined : '#f11568' }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review & Get 20% Off'}
          </button>

          <p className="text-sm text-gray-400 text-center">
            By submitting this review, you&apos;ll receive a 20% discount code for your next ArtRiot session.
          </p>
        </form>
      </div>
    </main>
  );
}