'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [error] = useState('');

  useEffect(() => {
    if (sessionId) {
      // In a real app, you'd verify the session with your backend
      // For now, we'll just show a success message
      setLoading(false);
    }
  }, [sessionId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black pt-36 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-white">Confirming your registration...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-black pt-36">
        <div className="max-w-2xl mx-auto px-6 py-12 text-center">
          <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-8">
            <h1 className="text-2xl font-bold text-red-400 mb-4">Payment Verification Failed</h1>
            <p className="text-red-300 mb-6">{error}</p>
            <Link 
              href="/contact"
              className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300"
              style={{ backgroundColor: '#f11568' }}
            >
              Contact Support
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black pt-36">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Registration Successful! 🎉</h1>
          <p className="text-xl text-gray-300 mb-8">
            Welcome to Art Riot Live! Your payment has been processed and your spot is secured.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <h2 className="text-2xl font-bold text-white mb-4">What Happens Next?</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ backgroundColor: '#f11568' }}>
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Confirmation Email</h3>
                  <p className="text-gray-300 text-sm">You&apos;ll receive a detailed confirmation email within the next few minutes with all event details.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ backgroundColor: '#f11568' }}>
                  <span className="text-white text-sm font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Event Reminders</h3>
                  <p className="text-gray-300 text-sm">We&apos;ll send you reminders as the event approaches with location details and what to bring.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ backgroundColor: '#f11568' }}>
                  <span className="text-white text-sm font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Join the Experience</h3>
                  <p className="text-gray-300 text-sm">Arrive ready to explore, create, and connect in a safe, supportive environment.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <h2 className="text-2xl font-bold text-white mb-4">Prepare for Your Session</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-white font-semibold mb-2">What to Bring:</h3>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Comfortable clothing you can move in</li>
                  <li>• Water bottle</li>
                  <li>• Open mind and playful spirit</li>
                  <li>• Journal (optional)</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-white font-semibold mb-2">We&apos;ll Provide:</h3>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• All art supplies</li>
                  <li>• Yoga mats</li>
                  <li>• Professional guidance</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <p className="text-gray-400 leading-relaxed">
            <span className="font-medium text-gray-300">Important Reminder:</span> This experience is not therapy or medical treatment. Our sessions are designed for educational, creative, and wellness purposes only. Please consult with healthcare professionals for any medical or mental health concerns.
          </p>
        </div>

        <div className="mt-12 text-center">
          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 mb-8">
            <h3 className="text-xl font-bold text-white mb-3">Join Our Community</h3>
            <p className="text-gray-300 mb-4">
              Connect with other Art Riot participants and stay updated on future events.
            </p>
            <a
              href="https://www.facebook.com/groups/artriot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
              style={{ backgroundColor: '#f11568' }}
            >
              Join Facebook Community
            </a>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/in-person-events"
              className="bg-transparent border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white font-medium py-3 px-6 rounded-lg transition-all duration-300"
              style={{ borderColor: '#f11568', color: '#f11568' }}
            >
              View All Events
            </Link>
            <Link 
              href="/"
              className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300"
              style={{ backgroundColor: '#f11568' }}
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense 
      fallback={
        <main className="min-h-screen bg-black pt-36 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-white">Loading...</p>
          </div>
        </main>
      }
    >
      <SuccessPageContent />
    </Suspense>
  );
}