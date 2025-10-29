'use client';

import Link from 'next/link';

export default function PaymentCancelPage() {
  return (
    <main className="min-h-screen bg-black pt-20">
      <div className="max-w-2xl mx-auto px-6 py-12 text-center">
        <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>

        <h1 className="text-4xl font-bold text-white mb-4">Registration Cancelled</h1>
        <p className="text-xl text-gray-300 mb-8">
          Your registration was not completed. Don&apos;t worry - your spot is still available!
        </p>

        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">What happened?</h2>
          <p className="text-gray-300 mb-4">
            You cancelled the payment process before it was completed. No charges were made to your card.
          </p>
          <p className="text-gray-300">
            If you experienced any issues during checkout, please don&apos;t hesitate to contact us for assistance.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/register/in-person"
              className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
              style={{ backgroundColor: '#f11568' }}
            >
              Try Registration Again
            </Link>
            <Link 
              href="/contact"
              className="bg-transparent border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white font-medium py-3 px-6 rounded-lg transition-all duration-300"
              style={{ borderColor: '#f11568', color: '#f11568' }}
            >
              Get Help
            </Link>
          </div>

          <div className="mt-8">
            <Link 
              href="/in-person-events"
              className="text-gray-400 hover:text-white transition-colors duration-300"
            >
              ← Back to Events
            </Link>
          </div>
        </div>

        <div className="mt-12 bg-gray-900/50 rounded-xl p-6 border border-gray-800">
          <h3 className="text-lg font-bold text-white mb-3">Questions About Registration?</h3>
          <p className="text-gray-300 mb-4">
            We&apos;re here to help! Reach out if you have questions about events, payment options, or need assistance with registration.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
            <a 
              href="mailto:info@artriot.live"
              className="text-primary-500 hover:text-primary-400"
              style={{ color: '#f11568' }}
            >
              📧 info@artriot.live
            </a>
            <a 
              href="https://www.facebook.com/groups/artriot"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-500 hover:text-primary-400"
              style={{ color: '#f11568' }}
            >
              💬 Facebook Community
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}