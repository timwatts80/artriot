'use client';

import RegistrationForm from '@/components/RegistrationForm';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface EventAvailability {
  event: {
    eventType: string;
    eventName: string;
    eventDate: string;
    priceInCents: number;
    totalTickets: number;
    soldTickets: number;
  };
  availability: {
    available: number;
    total: number;
    soldOut: boolean;
  };
}

export default function FrequenciesFlowRegistration() {
  const [availability, setAvailability] = useState<EventAvailability | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAvailability() {
      try {
        const response = await fetch('/api/events/availability?eventType=frequencies-flow');
        if (response.ok) {
          const data = await response.json();
          setAvailability(data);
        } else {
          console.error('Failed to load event availability');
        }
      } catch (err) {
        console.error('Error fetching availability:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchAvailability();
  }, []);

  const eventData = {
    id: 'frequencies-flow',
    name: 'Frequencies + Flow: Creative Expression',
    date: 'December 7, 2024',
    time: '7:00 PM - 8:30 PM',
    location: 'Jade Bloom, Draper, UT',
    price: '$55',
    maxCapacity: availability?.availability.total || 20,
    currentRegistrations: availability?.event.soldTickets || 0,
    availableSpots: availability?.availability.available || 0,
    soldOut: availability?.availability.soldOut || false,
    description: 'Let live music guide your creative spirit! Experience the magic of creating art while immersed in live musical performance.',
    highlights: [
      'Live musical performance throughout',
      'Guided meditation and breathwork',
      'Prompted art creation with supplies included',
      'Music-guided creative expression',
      'Community sharing and connection'
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
              {eventData.description} Each brushstroke flows with the rhythm as music, meditation, 
              and art creation unite in perfect harmony. This unique experience combines live musical 
              performance with guided creative expression, creating a transformative journey for both 
              mind and spirit.
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
          availableSpots={eventData.availableSpots}
          soldOut={eventData.soldOut}
          loading={loading}
        />
      </div>
    </main>
  );
}