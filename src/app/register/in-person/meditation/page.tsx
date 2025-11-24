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

export default function MeditationRegistration() {
  const [availability, setAvailability] = useState<EventAvailability | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAvailability() {
      try {
        const response = await fetch('/api/events/availability?eventType=meditation');
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
    id: 'meditation',
    name: 'Breathe & Create: Deep Meditation Studio',
    date: 'November 23, 2025',
    time: '10:00 AM - 11:30 AM',
    location: 'Workshop SLC, Salt Lake City, UT',
    price: '$35',
    maxCapacity: availability?.availability.total || 15,
    currentRegistrations: availability?.event.soldTickets || 0,
    availableSpots: availability?.availability.available || 0,
    soldOut: availability?.availability.soldOut || false,
    description: 'Dive deep into stillness and emerge with vibrant creativity! This immersive experience centers around extended meditation and breathwork practices, creating space for profound art creation from a place of inner calm and clarity.',
    highlights: [
      'Extended meditation and breathwork',
      'Deep contemplative practices',
      'Prompted art creation with supplies included',
      'Mindful creative expression',
      'Integration and reflection time'
    ]
  };

  return (
    <main className="min-h-screen bg-black pt-36">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link
            href="/in-person-events#upcoming-sessions"
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
                  <span className="ml-2">{eventData.price}</span>
                </div>
              </div>

              {/* Venue Logo */}
              <div className="mt-4 pt-4 border-t border-gray-700">
                <p className="text-gray-400 text-xs mb-3">Hosted at:</p>
                <a 
                  href="https://www.workshopslc.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white rounded-lg p-4 inline-block hover:shadow-lg transition-shadow duration-300"
                >
                  <img 
                    src="/WorkshopSLCLogo.webp" 
                    alt="Workshop SLC" 
                    className="h-28 object-contain hover:scale-105 transition-transform duration-300"
                  />
                </a>
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
              {eventData.description} This deep-dive experience combines traditional meditation practices 
              with creative expression, allowing participants to access and express their innermost 
              creative insights through the power of stillness and breath. Discover how profound 
              stillness can give birth to vibrant artistic expression.
            </p>
          </div>
        </div>

        {/* Co-Facilitators Section */}
        <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Co-Facilitators</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Tim Watts */}
            <div className="text-center">
              <div className="relative mb-4">
                <a 
                  href="https://www.facebook.com/TimWattsArt" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block hover:scale-105 transition-transform duration-300"
                >
                  <img 
                    src="/SLC_Trish_Headshot_250919 1.jpg" 
                    alt="Tim Watts - Co-Facilitator" 
                    className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-primary-500/50 hover:border-primary-400"
                    style={{ borderColor: '#f11568' }}
                  />
                </a>
                <div 
                  className="absolute inset-0 rounded-full bg-primary-500/20 blur-xl pointer-events-none"
                  style={{ backgroundColor: 'rgba(241, 21, 104, 0.2)' }}
                ></div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                <a 
                  href="https://www.facebook.com/TimWattsArt" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary-400 transition-colors duration-200"
                  style={{ color: 'inherit' }}
                >
                  Tim Watts
                </a>
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Tim&apos;s approach is rooted in the understanding that creativity is medicine. A pathway to processing emotions, building community, and discovering new aspects of ourselves through contemplative practices and artistic exploration.
              </p>
            </div>

            {/* Sarah McClellan */}
            <div className="text-center">
              <div className="relative mb-4">
                <a 
                  href="https://www.instagram.com/sarahgirlstrong/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block hover:scale-105 transition-transform duration-300"
                >
                  <img 
                    src="/Sarah-Headshot.jpg" 
                    alt="Sarah McClellan - Co-Facilitator" 
                    className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-primary-500/50 hover:border-primary-400"
                    style={{ borderColor: '#f11568' }}
                  />
                </a>
                <div 
                  className="absolute inset-0 rounded-full bg-primary-500/20 blur-xl pointer-events-none"
                  style={{ backgroundColor: 'rgba(241, 21, 104, 0.2)' }}
                ></div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                <a 
                  href="https://www.instagram.com/sarahgirlstrong/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary-400 transition-colors duration-200"
                  style={{ color: 'inherit' }}
                >
                  Sarah McClellan
                </a>
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Self Mastery Coach B.S. Exercise Science Building strength: 💪🏼physically 🧠mentally ☺️emotionally ❤️relationally FLOW, FITNESS, FASHION, FUN, FAMILY
              </p>
            </div>
          </div>
        </div>

        <RegistrationForm
          eventType={eventData.id}
          eventName={eventData.name}
          eventDate={eventData.date}
          eventTime={eventData.time}
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