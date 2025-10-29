'use client';

import RegistrationForm from '@/components/RegistrationForm';
import Link from 'next/link';

export default function MeditationRegistration() {
  const eventData = {
    id: 'meditation',
    name: 'Breathe & Create: Deep Meditation Studio',
    date: 'TBD',
    time: 'TBD',
    location: 'Workshop SLC, Salt Lake City, UT',
    price: '$55',
    maxCapacity: 15,
    currentRegistrations: 0, // This would be fetched from database in production
    description: 'Dive deep into stillness and emerge with vibrant creativity! This immersive experience centers around extended meditation and breathwork practices.',
    highlights: [
      'Extended meditation sessions',
      'Deep breathwork practices',
      'Prompted art creation with supplies included',
      'Mindfulness and awareness techniques',
      'Creative expression from stillness'
    ]
  };

  return (
    <main className="min-h-screen bg-black pt-20">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link
            href="/in-person-events"
            className="flex items-center text-primary-500 hover:text-primary-400 mb-4 transition-colors"
            style={{ color: '#f11568' }}
          >
            ← Back to In-Person Events
          </Link>
          <h1 className="text-4xl font-bold text-white mb-4">Register for Art Riot Live</h1>
          <p className="text-gray-300 text-lg">
            Complete your registration for {eventData.name}
          </p>
        </div>

        {/* Event Details Section */}
        <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">{eventData.name}</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-white font-semibold mb-3">Event Details:</h3>
              <div className="space-y-2 text-gray-300">
                <div className="flex items-center">
                  <span className="w-6">📅</span>
                  <span className="ml-2">{eventData.date}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-6">🕐</span>
                  <span className="ml-2">{eventData.time}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-6">📍</span>
                  <span className="ml-2">{eventData.location}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-6">💰</span>
                  <span className="ml-2">{eventData.price}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-3">What&apos;s Included:</h3>
              <ul className="space-y-1">
                {eventData.highlights.map((highlight, index) => (
                  <li key={index} className="text-gray-300 text-sm flex items-start">
                    <span className="text-primary-500 mr-2" style={{ color: '#f11568' }}>•</span>
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4">
            <p className="text-gray-300 leading-relaxed">
              {eventData.description} Creating space for profound art creation from a place of inner 
              calm and clarity. This deep-dive experience combines traditional meditation practices 
              with creative expression, allowing participants to access and express their innermost 
              creative insights through the power of stillness and breath.
            </p>
          </div>
        </div>

        <RegistrationForm
          eventType={eventData.id}
          eventName={eventData.name}
          eventDate={eventData.date}
          price={eventData.price}
          maxCapacity={eventData.maxCapacity}
          currentRegistrations={eventData.currentRegistrations}
        />
      </div>
    </main>
  );
}