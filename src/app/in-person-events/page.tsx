'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import PageMeta from '@/components/PageMeta';
import StructuredData from '@/components/StructuredData';

interface EventAvailability {
  event: {
    eventType: string;
    totalTickets: number;
    soldTickets: number;
  };
  availability: {
    total: number;
    available: number;
    soldOut: boolean;
  };
}

// Updated copy with new branding
const TEMP_COPY = {
  hero: {
    title: "Art Riot Live",
    subtitle: "Where art becomes medicine for the soul.",
    tagline: "Reclaim your creative freedom. Reconnect with your body. Remember who you are.",
    description: "Art Riot Live is a transformative art-making experience where your soul speaks through color, texture, and form. Enhanced by movement, meditation, and music, each session creates sacred space for authentic creative expression and healing.",
    philosophy: "It's not a class. It's not performance.\nIt's a space to release, create, and reconnect—with yourself and others."
  },
  about: {
    title: "What is Intermodal Expressive Art Healing?",
    description: "Art becomes the primary language of healing in our sessions. Through painting, drawing, and mixed media creation, your soul expresses what words cannot. Movement, meditation, and music support this creative process, helping you access deeper layers of authentic self-expression and emotional release.",
    benefits: [
      "Art creation as a pathway to inner wisdom",
      "Soul-centered creative expression without judgment", 
      "Community connection through shared artistic exploration",
      "Increased self-awareness through visual storytelling",
      "Emotional processing through color, texture, and form",
      "Safe space for authentic artistic voice to emerge"
    ]
  }
};

// Placeholder upcoming sessions - replace with your actual events
const UPCOMING_SESSIONS = [
  {
    id: 1,
    eventType: "frequencies-flow",
    title: "Frequencies + Flow: Creative Expression",
    date: "November 21, 2025",
    time: "7:00 PM - 8:30 PM",
    location: "Jade Bloom, Draper, UT",
    description: "Experience the magic of creating art that speaks from your soul. Each brushstroke flows with the rhythm as music, meditation, and art creation unite in perfect harmony.",
    facilitator: "Co-facilitated by Tim Watts and Sarah McClellan",
    highlights: [
      "Musical performance throughout",
      "Guided meditation and breathwork",
      "Prompted art creation with supplies included",
      "Music-guided creative expression",
      "Community sharing and connection"
    ]
  },
  {
    id: 2,
    eventType: "meditation",
    title: "Breathe & Create: Deep Meditation Studio",
    date: "November 23, 2025",
    time: "10:00 AM - 11:30 AM", 
    location: "Workshop SLC, Salt Lake City, UT",
    description: "Dive deep into stillness and emerge with vibrant creativity! This immersive experience centers around extended meditation and breathwork practices, creating space for profound art creation from a place of inner calm and clarity.",
    facilitator: "Tim Watts",
    highlights: [
      "Extended meditation and breathwork",
      "Deep contemplative practices",
      "Prompted art creation with supplies included",
      "Mindful creative expression",
      "Integration and reflection time"
    ]
  },
  {
    id: 3,
    eventType: "somatic-movement",
    title: "Body Wisdom: Somatic Art Journey",
    date: "December 6, 2025", 
    time: "7:00 - 8:30 PM",
    location: "Sage Canvas, Lehi, UT",
    description: "Move, feel, create! This gentle somatic experience invites you to listen to your body's wisdom through mindful movement, meditation, and intuitive art creation. Let your body lead the way to creative discovery.",
    facilitator: "Tim Watts",
    highlights: [
      "Gentle somatic body movement",
      "Guided meditation and breathwork", 
      "Prompted art creation with supplies included",
      "Body-centered creative exploration",
      "Safe space for authentic expression"
    ]
  }
];

export default function InPersonEventsPage() {
  const [availabilities, setAvailabilities] = useState<{[key: string]: EventAvailability}>({});
  const [loading, setLoading] = useState(true);

  // Function to get venue logo based on event type
  const getVenueLogo = (eventType: string) => {
    switch (eventType) {
      case 'frequencies-flow':
        return '/JadeBloomLogo.jpeg';
      case 'somatic-movement':
        return '/SageCanvasLogo.webp';
      case 'meditation':
        return '/WorkshopSLCLogo.webp';
      default:
        return null;
    }
  };

  useEffect(() => {
    async function fetchAllAvailabilities() {
      try {
        const eventTypes = ['frequencies-flow', 'somatic-movement', 'meditation'];
        const promises = eventTypes.map(async (eventType) => {
          const response = await fetch(`/api/events/availability?eventType=${eventType}`);
          if (response.ok) {
            const data = await response.json();
            return { eventType, data };
          }
          return null;
        });

        const results = await Promise.all(promises);
        const availabilityMap: {[key: string]: EventAvailability} = {};
        
        results.forEach((result) => {
          if (result) {
            availabilityMap[result.eventType] = result.data;
          }
        });

        setAvailabilities(availabilityMap);
      } catch (err) {
        console.error('Error fetching availabilities:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchAllAvailabilities();
  }, []);

  return (
    <main className="min-h-screen bg-black">
      <PageMeta
        title="Art Riot Live - In-Person Art Meditation Events"
        description="Experience transformative in-person art healing events in Utah. Where art becomes medicine for the soul through creative expression, music, and mindful movement. Join frequencies & flow, somatic movement, and meditation sessions."
        image="/social-share.png"
        url="https://artriot.com/in-person-events"
        type="website"
      />
      
      <StructuredData
        type="Event"
        data={{
          name: "Art Riot Live - In-Person Art Meditation Events",
          description: "Experience transformative in-person art healing events where art becomes medicine for the soul through creative expression, music, and mindful movement.",
          startDate: "2025-11-21T19:00:00-07:00",
          endDate: "2025-12-14T12:00:00-07:00",
          location: {
            "@type": "Place",
            name: "Various Venues",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Salt Lake City",
              addressRegion: "UT",
              addressCountry: "US"
            }
          },
          organizer: {
            "@type": "Organization",
            name: "ArtRiot",
            url: "https://artriot.com"
          },
          offers: {
            "@type": "Offer",
            price: "55",
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
            url: "https://artriot.com/in-person-events"
          },
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          eventStatus: "https://schema.org/EventScheduled",
          image: "https://artriot.com/ArtRiot-ArtSession-Image.png"
        }}
      />
      
      {/* Hero Section */}
      <section className="pt-48 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 to-black"></div>
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div>
              <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 flex items-center gap-4">
                <img 
                  src="/Art_Riot_Logo_No_Splatter.svg" 
                  alt="ArtRiot" 
                  className="h-24 lg:h-32 w-auto"
                />
                <span>Live</span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-300 mb-8 font-light leading-relaxed">
                {TEMP_COPY.hero.subtitle}
              </p>
              <p className="text-lg text-primary-400 mb-8 font-medium" style={{ color: '#f11568' }}>
                {TEMP_COPY.hero.tagline}
              </p>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                {TEMP_COPY.hero.description}
              </p>
              <div className="border-l-4 border-primary-500 pl-6 mb-8" style={{ borderColor: '#f11568' }}>
                <p className="text-gray-300 italic leading-relaxed whitespace-pre-line">
                  {TEMP_COPY.hero.philosophy}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 cursor-pointer"
                  style={{ backgroundColor: '#f11568' }}
                >
                  View Upcoming Sessions
                </button>
                <button 
                  onClick={() => document.getElementById('about-expressive-healing')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-transparent border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white font-medium py-4 px-8 rounded-lg transition-all duration-300 text-center"
                  style={{ borderColor: '#f11568', color: '#f11568' }}
                >
                  Learn More
                </button>
              </div>
            </div>

            {/* Right Column - Visual Content */}
            <div className="relative">
              <div className="aspect-square rounded-2xl relative">
                <img 
                  src="/ArtRiot-ArtSession-Image.png" 
                  alt="Art Riot Live - Art-making session with creative expression"
                  className="w-full h-full object-cover rounded-2xl"
                />
                <div className="absolute top-4 right-4 bg-black/80 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                  Art Riot Live
                </div>
                {/* Decorative overlay elements */}
                <div 
                  className="absolute top-4 left-4 w-16 h-16 md:w-32 md:h-32 bg-primary-500/20 rounded-full backdrop-blur-sm"
                  style={{ 
                    backgroundColor: 'rgba(241, 21, 104, 0.2)',
                    animation: 'float1 12s ease-in-out infinite'
                  }}
                ></div>
                <div 
                  className="absolute bottom-8 right-6 w-20 h-20 md:w-40 md:h-40 bg-purple-500/10 rounded-full backdrop-blur-sm"
                  style={{ 
                    animation: 'float2 16s ease-in-out infinite'
                  }}
                ></div>
                <div 
                  className="absolute top-1/2 right-4 w-12 h-12 md:w-24 md:h-24 bg-primary-500/30 rounded-full backdrop-blur-sm"
                  style={{ 
                    backgroundColor: 'rgba(241, 21, 104, 0.3)',
                    animation: 'float3 14s ease-in-out infinite'
                  }}
                ></div>
                <div 
                  className="absolute top-16 right-1/3 w-14 h-14 md:w-28 md:h-28 bg-blue-500/15 rounded-full backdrop-blur-sm"
                  style={{ 
                    animation: 'float4 18s ease-in-out infinite'
                  }}
                ></div>
                <div 
                  className="absolute bottom-1/4 left-8 w-10 h-10 md:w-20 md:h-20 bg-yellow-500/20 rounded-full backdrop-blur-sm"
                  style={{ 
                    animation: 'float5 10s ease-in-out infinite'
                  }}
                ></div>

                {/* CSS animations */}
                <style jsx>{`
                  @keyframes float1 {
                    0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
                    33% { transform: translate(45px, -50px) rotate(120deg); }
                    66% { transform: translate(-35px, 40px) rotate(240deg); }
                  }
                  
                  @keyframes float2 {
                    0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
                    25% { transform: translate(-50px, -35px) rotate(90deg); }
                    50% { transform: translate(40px, -45px) rotate(180deg); }
                    75% { transform: translate(60px, 25px) rotate(270deg); }
                  }
                  
                  @keyframes float3 {
                    0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
                    50% { transform: translate(-30px, 55px) rotate(180deg); }
                  }
                  
                  @keyframes float4 {
                    0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
                    40% { transform: translate(50px, 45px) rotate(144deg); }
                    80% { transform: translate(-40px, -30px) rotate(288deg); }
                  }
                  
                  @keyframes float5 {
                    0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
                    25% { transform: translate(35px, -50px) rotate(90deg); }
                    75% { transform: translate(-25px, 40px) rotate(270deg); }
                  }
                `}</style>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What to Expect Section */}
      <section className="py-20 bg-gray-900/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8">
              What to Expect
            </h2>
            <p className="text-xl text-gray-300 mb-12 leading-relaxed">
              Each session is a carefully guided journey through the senses:
            </p>
          </div>

                    {/* Art-making - Prominent focal point */}
          <div className="flex justify-center mb-16">
            <div className="text-center group max-w-md">
              <div className="w-32 h-32 mx-auto mb-8 bg-primary-500/20 rounded-full flex items-center justify-center group-hover:bg-primary-500/30 transition-colors duration-300" style={{ backgroundColor: 'rgba(241, 21, 104, 0.2)' }}>
                <svg className="w-16 h-16 text-primary-400" style={{ color: '#f11568' }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  <path d="M9 11H7l5 5 5-5h-2l-3 3-3-3z" fill="none"/>
                  <circle cx="18" cy="6" r="2" fill="currentColor"/>
                  <path d="M5 20h14v1H5z"/>
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">Art-making</h3>
              <p className="text-lg text-gray-300 leading-relaxed">
                The heart of our practice - grounding what you feel into color, texture, and form. Where your soul speaks through creative expression. <span className="text-primary-400 font-medium" style={{ color: '#f11568' }}>Take home your unique creation as a tangible reminder of your healing journey.</span>
              </p>
            </div>
          </div>

          {/* Supporting modalities */}
          <div className="grid md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
            {/* Movement */}
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 bg-purple-500/20 rounded-full flex items-center justify-center group-hover:bg-purple-500/30 transition-colors duration-300">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <path d="M8 12l4-4 4 4" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M8 12l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Movement</h3>
              <p className="text-gray-400 leading-relaxed">
                to awaken the body and energy
              </p>
            </div>

            {/* Meditation */}
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 bg-blue-500/20 rounded-full flex items-center justify-center group-hover:bg-blue-500/30 transition-colors duration-300">
                <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C10.9 2 10 2.9 10 4s.9 2 2 2 2-.9 2-2-.9-2-2-2zm8 8c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2zM6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c-3.31 0-6 2.69-6 6v2h12v-2c0-3.31-2.69-6-6z"/>
                  <circle cx="12" cy="8" r="3" fill="none" stroke="currentColor" strokeWidth="1"/>
                  <path d="M8 16c0-2.21 1.79-4 4-4s4 1.79 4 4" fill="none" stroke="currentColor" strokeWidth="1"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Meditation</h3>
              <p className="text-gray-400 leading-relaxed">
                to calm the mind and open the heart
              </p>
            </div>

            {/* Music */}
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center group-hover:bg-green-500/30 transition-colors duration-300">
                <svg className="w-8 h-8 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                  <circle cx="10" cy="17" r="2"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Music</h3>
              <p className="text-gray-400 leading-relaxed">
                that carries you into flow and expression
              </p>
            </div>
          </div>

          <div className="text-center max-w-3xl mx-auto">
            <div className="bg-gray-800/50 rounded-2xl p-8 mb-8">
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                Every event is unique, hosted in community spaces, studios, and creative venues—each one designed to invite connection, healing, and self-expression.
              </p>
              <div className="border-l-4 border-primary-500 pl-6" style={{ borderColor: '#f11568' }}>
                <p className="text-lg text-primary-300 font-medium italic" style={{ color: '#f11568' }}>
                  You don&apos;t need to be an artist, dancer, or meditator. You just need curiosity and a willingness to feel.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why It Matters Section */}
      <section className="py-20 bg-gradient-to-r from-primary-900/10 to-purple-900/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8">
              Why It Matters
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              In a world that tells us to perform, perfect, and produce,<br />
              <span className="text-primary-400 font-medium" style={{ color: '#f11568' }}>
                Art Riot Live creates a sacred space where your soul can speak through color, texture, and form—no artistic experience required. Whether you&apos;ve never held a paintbrush or consider yourself an artist, this is about authentic expression, not technical skill.
              </span>
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Left Column - Benefits */}
            <div>
              <h3 className="text-2xl font-semibold text-white mb-8">
                When you create art from your soul in this safe container, participants often describe feeling:
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4 group">
                  <div className="w-3 h-3 rounded-full bg-primary-500 mt-2 flex-shrink-0 group-hover:scale-125 transition-transform duration-300" style={{ backgroundColor: '#f11568' }}></div>
                  <p className="text-lg text-gray-300 leading-relaxed">
                    <span className="text-white font-medium">Safe to be vulnerable</span> and express their authentic truth
                  </p>
                </div>
                
                <div className="flex items-start space-x-4 group">
                  <div className="w-3 h-3 rounded-full bg-primary-500 mt-2 flex-shrink-0 group-hover:scale-125 transition-transform duration-300" style={{ backgroundColor: '#f11568' }}></div>
                  <p className="text-lg text-gray-300 leading-relaxed">
                    <span className="text-white font-medium">Free from creative perfectionism</span> and self-criticism
                  </p>
                </div>
                
                <div className="flex items-start space-x-4 group">
                  <div className="w-3 h-3 rounded-full bg-primary-500 mt-2 flex-shrink-0 group-hover:scale-125 transition-transform duration-300" style={{ backgroundColor: '#f11568' }}></div>
                  <p className="text-lg text-gray-300 leading-relaxed">
                    <span className="text-white font-medium">Deeply connected</span> to their inner wisdom and creativity
                  </p>
                </div>
                
                <div className="flex items-start space-x-4 group">
                  <div className="w-3 h-3 rounded-full bg-primary-500 mt-2 flex-shrink-0 group-hover:scale-125 transition-transformation duration-300" style={{ backgroundColor: '#f11568' }}></div>
                  <p className="text-lg text-gray-300 leading-relaxed">
                    <span className="text-white font-medium">Inspired to honor</span> their creative voice in daily life
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Visual/Quote */}
            <div className="relative">
              <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/10 rounded-full -translate-y-8 translate-x-8"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full translate-y-12 -translate-x-12"></div>
                
                <div className="relative z-10">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 mx-auto mb-4 bg-primary-500/20 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(241, 21, 104, 0.2)' }}>
                      <span className="text-3xl">✨</span>
                    </div>
                  </div>
                  
                  <blockquote className="text-center">
                    <p className="text-lg text-gray-300 leading-relaxed mb-4 italic">
                      &quot;I had never considered myself artistic, but this experience showed me that my soul has its own creative language. It&apos;s not about making &apos;good&apos; art—it&apos;s about letting your truth flow onto the canvas.&quot;
                    </p>
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="text-center mt-16">
            <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-4">Ready to Experience Art Riot Live?</h3>
              <p className="text-gray-300 mb-6">Explore our three unique sessions, each with its own healing modality and creative focus.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 cursor-pointer"
                  style={{ backgroundColor: '#f11568' }}
                >
                  View All Sessions
                </button>
                <button 
                  onClick={() => document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-transparent border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 cursor-pointer"
                  style={{ borderColor: '#f11568', color: '#f11568' }}
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Facilitator Section */}
      <section className="py-20 bg-gray-900/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Facilitator Image */}
            <div className="flex justify-center lg:justify-start">
              <div className="relative">
                {/* Pink oblong glow shape - offset behind image */}
                <div 
                  className="absolute top-4 -left-8 w-96 h-80 lg:w-[28rem] lg:h-96 blur-3xl opacity-90 rotate-12"
                  style={{ 
                    background: 'linear-gradient(135deg, rgba(241, 21, 104, 0.6) 0%, rgba(241, 21, 104, 0.4) 30%, rgba(241, 21, 104, 0.2) 60%, transparent 100%)',
                    borderRadius: '50% 40% 60% 30%',
                    transform: 'rotate(-15deg) translateX(-20px) translateY(10px)'
                  }}
                ></div>
                <a 
                  href="https://www.facebook.com/TimWattsArt" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block hover:scale-105 transition-transform duration-300"
                >
                  <img 
                    src="/SLC_Trish_Headshot_250919 1.jpg"
                    alt="Tim Watts - Art Riot Live Facilitator"
                    className="relative w-80 h-80 lg:w-96 lg:h-96 object-cover rounded-2xl shadow-2xl z-10"
                  />
                </a>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent z-20 pointer-events-none"></div>
              </div>
            </div>
            
            {/* Facilitator Content */}
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                About the Facilitator
              </h2>
              <h3 className="text-2xl font-semibold text-primary-400 mb-4" style={{ color: '#f11568' }}>
                Tim Watts
              </h3>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  Tim is dedicated to creating transformative spaces where creativity, movement, and healing intersect. With a deep belief in the power of expressive arts to unlock authentic self-expression and community connection, Tim guides participants through immersive experiences that honor both individual and collective healing.
                </p>
                <p>
                  Through Art Riot Live, Tim combines elements of meditation, somatic movement, music, and visual art creation to offer a unique intermodal approach to wellness and creative expression. Each session is designed to be a safe, non-judgmental space where participants can explore, release, and reconnect with their authentic selves.
                </p>
                <p>
                  Tim&apos;s approach is rooted in the understanding that creativity is medicine. A pathway to processing emotions, building community, and discovering new aspects of ourselves through artistic exploration.
                </p>
              </div>
              
              <div className="mt-8 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <p className="text-sm text-gray-400 italic">
                  &ldquo;Art Riot Live isn&rsquo;t about creating perfect art. It&rsquo;s about creating space for perfect authenticity. Every mark, every movement, every breath is an invitation to remember who you really are.&rdquo;
                </p>
                <p className="text-sm text-gray-500 mt-2">— Tim Watts</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about-expressive-healing" className="py-20 bg-gray-900/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                {TEMP_COPY.about.title}
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                {TEMP_COPY.about.description}
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {TEMP_COPY.about.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 rounded-full bg-primary-500 mt-2 flex-shrink-0" style={{ backgroundColor: '#f11568' }}></div>
                    <p className="text-gray-300">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden">
                <img 
                  src="/Art-Riot-Live-Hero3.png" 
                  alt="Art Riot Live - Intermodal expressive arts healing session"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          
          {/* Simple CTA */}
          <div className="mt-12 text-center">
            <button 
              onClick={() => document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 cursor-pointer"
              style={{ backgroundColor: '#f11568' }}
            >
              View Our Sessions
            </button>
          </div>
        </div>
      </section>

      {/* Upcoming Sessions */}
      <section id="events" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Upcoming Sessions
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Join us for transformative in-person experiences that nurture your creative spirit and promote deep healing.
            </p>
          </div>

          <div className="space-y-6">
            {UPCOMING_SESSIONS.map((session) => (
              <div 
                key={session.id}
                className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-primary-500/50 transition-all duration-300"
              >
                <div className="grid lg:grid-cols-3 gap-0">
                  {/* Venue Logo & Calendar Icon */}
                  <div className="min-h-[200px] lg:min-h-full bg-gray-800 relative overflow-hidden">
                    {getVenueLogo(session.eventType) ? (
                      <div className="relative w-full h-full">
                        {/* Full background logo */}
                        <div className={`absolute inset-0 ${session.eventType === 'meditation' ? 'bg-white' : ''}`}>
                          <img 
                            src={getVenueLogo(session.eventType)!}
                            alt={`${session.location} logo`}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        </div>
                        {/* Dark overlay for text readability */}
                        <div className="absolute inset-0 bg-black/60"></div>
                        {/* Overlay content */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10">
                          <svg className="w-8 h-8 mb-2 text-primary-500" style={{ color: '#f11568' }} fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                          </svg>
                          <p className="text-white text-xs font-medium drop-shadow-lg">Upcoming Session</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <svg className="w-12 h-12 mx-auto mb-1 text-primary-500" style={{ color: '#f11568' }} fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                          </svg>
                          <p className="text-gray-400 text-xs font-medium">Upcoming Session</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Session Details */}
                  <div className="lg:col-span-2 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">{session.title}</h3>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-3">
                          <span>📅 {session.date}</span>
                          <span>🕐 {session.time}</span>
                          <span>📍 {session.location}</span>
                        </div>
                      </div>
                      <Link 
                        href={`/register/in-person/${session.eventType}`}
                        className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 whitespace-nowrap"
                        style={{ backgroundColor: '#f11568' }}
                      >
                        Register Now
                      </Link>
                    </div>
                    
                    <p className="text-gray-300 text-sm leading-relaxed mb-4">
                      {session.description}
                    </p>

                    {/* Co-Facilitators for Frequencies & Flow */}
                    {session.eventType === 'frequencies-flow' && (
                      <div className="flex items-center gap-3 mb-4 p-3 bg-gray-800/30 rounded-lg">
                        <span className="text-gray-400 text-xs font-medium">Co-facilitated by:</span>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <a 
                              href="https://www.facebook.com/TimWattsArt" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="hover:scale-105 transition-transform duration-200"
                            >
                              <img 
                                src="/SLC_Trish_Headshot_250919 1.jpg" 
                                alt="Tim Watts" 
                                className="w-8 h-8 rounded-full object-cover border-2 border-primary-500/50 hover:border-primary-400"
                                style={{ borderColor: '#f11568' }}
                              />
                            </a>
                            <span className="text-gray-300 text-xs font-medium">Tim Watts</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <a 
                              href="https://www.instagram.com/sarahgirlstrong/" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="hover:scale-105 transition-transform duration-200"
                            >
                              <img 
                                src="/Sarah-Headshot.jpg" 
                                alt="Sarah McClellan" 
                                className="w-8 h-8 rounded-full object-cover border-2 border-primary-500/50 hover:border-primary-400"
                                style={{ borderColor: '#f11568' }}
                              />
                            </a>
                            <span className="text-gray-300 text-xs font-medium">Sarah McClellan</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Co-Facilitators for Body Wisdom */}
                    {session.eventType === 'somatic-movement' && (
                      <div className="flex items-center gap-3 mb-4 p-3 bg-gray-800/30 rounded-lg">
                        <span className="text-gray-400 text-xs font-medium">Co-facilitated by:</span>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <a 
                              href="https://www.facebook.com/TimWattsArt" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="hover:scale-105 transition-transform duration-200"
                            >
                              <img 
                                src="/SLC_Trish_Headshot_250919 1.jpg" 
                                alt="Tim Watts" 
                                className="w-8 h-8 rounded-full object-cover border-2 border-primary-500/50 hover:border-primary-400"
                                style={{ borderColor: '#f11568' }}
                              />
                            </a>
                            <span className="text-gray-300 text-xs font-medium">Tim Watts</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <a 
                              href="https://www.instagram.com/crystallineinitiations/" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="hover:scale-105 transition-transform duration-200"
                            >
                              <img 
                                src="/Kangie-Headshot.png" 
                                alt="Kangie" 
                                className="w-8 h-8 rounded-full object-cover border-2 border-primary-500/50 hover:border-primary-400"
                                style={{ borderColor: '#f11568' }}
                              />
                            </a>
                            <span className="text-gray-300 text-xs font-medium">Kangie</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Facilitator for Breathe & Create */}
                    {session.eventType === 'meditation' && (
                      <div className="flex items-center gap-3 mb-4 p-3 bg-gray-800/30 rounded-lg">
                        <span className="text-gray-400 text-xs font-medium">Facilitated by:</span>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <a 
                              href="https://www.facebook.com/TimWattsArt" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="hover:scale-105 transition-transform duration-200"
                            >
                              <img 
                                src="/SLC_Trish_Headshot_250919 1.jpg" 
                                alt="Tim Watts" 
                                className="w-8 h-8 rounded-full object-cover border-2 border-primary-500/50 hover:border-primary-400"
                                style={{ borderColor: '#f11568' }}
                              />
                            </a>
                            <span className="text-gray-300 text-xs font-medium">Tim Watts</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <p className="text-gray-400 text-xs leading-relaxed mb-4">
                      <span className="font-medium">Notice:</span> This is not therapy or medical treatment. This experience is for educational, creative, and wellness purposes only.
                    </p>

                    <div className="flex justify-end items-center text-sm">
                      <div className="text-gray-400">
                        {availabilities[session.eventType] && !loading ? (
                          availabilities[session.eventType].availability.soldOut ? (
                            <span className="text-red-400 font-medium">Sold Out</span>
                          ) : (
                            <span className="text-sm">
                              <span className="text-gray-400">{availabilities[session.eventType].availability.total} spots</span>
                              <span className="text-gray-400"> / </span>
                              <span className="text-green-400">{availabilities[session.eventType].availability.available} remaining</span>
                            </span>
                          )
                        ) : loading ? (
                          <span className="text-gray-500">Loading availability...</span>
                        ) : (
                          `Includes: ${session.highlights.slice(0, 2).join(", ")} + more`
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-primary-900/20 to-purple-900/20">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Begin Your Healing Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join our community of creative healers and experience the transformative power of intermodal expressive arts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/register/in-person"
              className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
              style={{ backgroundColor: '#f11568' }}
            >
              Register for Events
            </Link>
            <Link 
              href="/contact"
              className="bg-transparent border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white font-medium py-3 px-8 rounded-lg transition-all duration-300"
              style={{ borderColor: '#f11568', color: '#f11568' }}
            >
              Contact for More Info
            </Link>
          </div>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="py-12 bg-gray-800/30">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <span className="mr-2">ℹ️</span>
              Important Note
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Art Riot Live sessions are designed for creative expression, community connection, and personal wellness. 
              These experiences are <strong>not a substitute for professional therapy, medical treatment, or mental health services</strong>. 
              If you are experiencing mental health concerns, please consult with a qualified healthcare professional. 
              Our facilitators are not licensed healthcare providers, and these sessions are not intended to diagnose, treat, or cure any medical or psychological condition.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="mb-8">
            <Link href="/" className="text-3xl font-bold text-white">
              Art<span style={{ color: '#f11568' }}>Riot</span>
            </Link>
          </div>
          <div className="flex flex-wrap justify-center space-x-6 mb-8 text-gray-400">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/register/art-meditation" className="hover:text-white transition-colors">Virtual Events</Link>
            <Link href="/in-person-events" className="hover:text-white transition-colors">In-Person Events</Link>
            <Link href="mailto:hello@artriot.com" className="hover:text-white transition-colors">Contact</Link>
          </div>
          <p className="text-gray-500 text-sm">
            © 2025 ArtRiot. All rights reserved. | A Tim Watts Art Initiative
          </p>
        </div>
      </footer>
    </main>
  );
}