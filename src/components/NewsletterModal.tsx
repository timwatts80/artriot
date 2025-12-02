'use client';

import { useState, useEffect } from 'react';

export default function NewsletterModal() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if modal has already been shown in this session
    const hasSeenModal = sessionStorage.getItem('artriot_newsletter_modal_seen');
    
    if (!hasSeenModal) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        // Mark as seen immediately when it opens so it doesn't pop up again on refresh
        sessionStorage.setItem('artriot_newsletter_modal_seen', 'true');
      }, 7000); // 7 seconds delay

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await fetch('/api/waitlist-brevo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email,
          eventType: 'art_riot_interest',
          name: email.split('@')[0] // Use email prefix as default name
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        setEmail('');
      } else {
        const errorData = await response.text();
        setError('Something went wrong. Please try again.');
        console.error('Email signup error:', errorData);
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
      console.error('Email signup error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted || !isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 cursor-pointer"
        onClick={handleClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-gray-900 border border-gray-700 rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all duration-300 scale-100">
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Join the <span style={{ color: '#f11568' }}>Riot</span>
          </h2>
          
          {!isSuccess ? (
            <>
              <p className="text-gray-300 mb-8 leading-relaxed">
                Get exclusive updates on upcoming events, workshops, and creative inspiration delivered straight to your inbox.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                    disabled={isSubmitting}
                  />
                </div>
                
                {error && (
                  <p className="text-red-400 text-sm">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed cursor-pointer"
                  style={{ backgroundColor: isSubmitting ? undefined : '#f11568' }}
                >
                  {isSubmitting ? 'Joining...' : 'Get Notified'}
                </button>
                
                <p className="text-gray-500 text-xs mt-4">
                  No spam, just art. Unsubscribe anytime.
                </p>
              </form>
            </>
          ) : (
            <div className="py-8">
              <div className="w-16 h-16 bg-green-900/30 border border-green-500/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">You&apos;re In!</h3>
              <p className="text-gray-300">
                Thanks for joining. Keep an eye on your inbox for updates!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
