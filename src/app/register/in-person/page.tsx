'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterInPersonPage() {
  const router = useRouter();

  // Redirect to in-person events page since we now use direct links
  useEffect(() => {
    router.replace('/in-person-events');
  }, [router]);

  return (
    <main className="min-h-screen bg-black pt-20">
      <div className="max-w-4xl mx-auto px-6 py-12 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Redirecting...</h1>
        <p className="text-gray-300 mb-8">
          Taking you back to our in-person events page.
        </p>
        
        <Link 
          href="/in-person-events"
          className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300"
          style={{ backgroundColor: '#f11568' }}
        >
          View In-Person Events
        </Link>
      </div>
    </main>
  );
}