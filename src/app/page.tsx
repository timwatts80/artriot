'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ART_MEDITATION_EVENT } from '../config/events';
import { getPagePadding, SHOW_BANNER } from '@/utils/banner';
import PageMeta from '@/components/PageMeta';
import StructuredData from '@/components/StructuredData';
import Testimonials from '@/components/Testimonials';

// Types for components
interface Event {
  id: string;
  name: string;
  start_time: string;
  description?: string;
  place?: {
    name: string;
    location: {
      street: string;
      city: string;
    };
  };
  cover?: {
    source: string;
  };
}

export default function ArtRiotHomePage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false)
  const [emailSubmitted, setEmailSubmitted] = useState(false)
  const [emailError, setEmailError] = useState('')

  // Newsletter highlights data (currently hidden)
  /*
  const newsletterHighlights: NewsletterHighlight[] = [
    {
      id: 1,
      title: "October's Featured Artist Spotlight",
      excerpt: "Discover the inspiring journey of local artist Sarah Chen and her bold abstract works that challenge conventional perspectives...",
      date: "Oct 1, 2025",
      image: "/highlights/artist-spotlight.jpg"
    },
    {
      id: 2,
      title: "New Techniques Workshop Series",
      excerpt: "Join us for our monthly workshop series featuring experimental techniques in watercolor, digital art, and mixed media...",
      date: "Sep 28, 2025",
      image: "/highlights/workshop-series.jpg"
    },
    {
      id: 3,
      title: "Community Art Gallery Opening",
      excerpt: "Mark your calendars! Our community gallery will showcase member artwork throughout November...",
      date: "Sep 25, 2025",
      image: "/highlights/gallery-opening.jpg"
    }
  ];
  */

  useEffect(() => {
    // Mock data for development - replace with actual API calls
    const mockEvents: Event[] = [
      {
        id: '1',
        name: 'Body Wisdom: Somatic Art Journey',
        start_time: '2025-12-05T19:00:00',
        description: 'Move, feel, create! This gentle somatic experience invites you to listen to your body\'s wisdom through mindful movement, meditation, and intuitive art creation. Let your body lead the way to creative discovery.',
        place: {
          name: 'Sage Canvas',
          location: {
            street: '',
            city: 'Lehi, UT'
          }
        }
      },
      {
        id: '2',
        name: 'Advanced Breathwork & Creative Expression',
        start_time: '2025-12-19T18:30:00',
        description: 'Experience the transformative power of advanced breathwork techniques combined with intuitive art creation. Hosted by Tim Watts, Brock Warden, and Sarah McClellan.',
        place: {
          name: '',
          location: {
            street: '1373 W 3040 N',
            city: 'Pleasant Grove, UT'
          }
        }
      }
    ];

    // Simulate loading events
    setTimeout(() => {
      setEvents(mockEvents);
      setLoading(false);
    }, 1000);
  }, []);

  // Email notification signup handler
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setIsSubmittingEmail(true);
    setEmailError('');
    
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
        setEmail('');
        setEmailSubmitted(true);
        setTimeout(() => setEmailSubmitted(false), 5000);
      } else {
        const errorData = await response.text();
        setEmailError('Something went wrong. Please try again.');
        console.error('Email signup error:', errorData);
      }
    } catch (error) {
      setEmailError('Something went wrong. Please try again.');
      console.error('Email signup error:', error);
    } finally {
      setIsSubmittingEmail(false);
    }
  };

  const formatEventDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  // Art kit grouping (currently not used)
  // const groupedKits = groupKitsByCategory(artKits);

  return (
    <main className="min-h-screen bg-black">
      <PageMeta
        title="ArtRiot - Where Creativity Rebels Against the Ordinary"
        description="Join our community of artists, makers, and dreamers who believe art should disrupt, inspire, and unite. Experience transformative art meditation events, workshops, and creative inspiration."
        image="/Art_Riot_Banner.png"
        url="https://artriot.com"
        type="website"
      />

      <StructuredData
        type="Organization"
        data={{
          name: "ArtRiot",
          description: "Join our community of artists, makers, and dreamers who believe art should disrupt, inspire, and unite.",
          url: "https://artriot.com",
          logo: "https://artriot.com/Art_Riot_Horizontal.png",
          sameAs: [
            "https://twitter.com/artriot",
            "https://instagram.com/artriot",
            "https://facebook.com/artriot"
          ],
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer service",
            url: "https://artriot.com/contact"
          },
          address: {
            "@type": "PostalAddress",
            addressLocality: "Salt Lake City",
            addressRegion: "UT",
            addressCountry: "US"
          }
        }}
      />
      
      {/* Hero Section */}
      <section 
        className={`${getPagePadding(SHOW_BANNER)} pb-16 px-4 sm:px-6 lg:px-8 relative bg-cover bg-center bg-no-repeat`}
        style={{ 
          backgroundImage: 'url(/grey-abstract-art-background.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Dark gradient overlay from bottom to top */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/0"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10 pt-8 mt-8">
          <div className="mb-6">
            <img 
              src="/Art_Riot_Logo_No_Splatter.svg" 
              alt="ArtRiot" 
              className="mx-auto max-w-full h-auto"
              style={{ maxHeight: '240px' }}
            />
          </div>
          <p className="text-xl lg:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            A playful rebellion against perfection.<br />
            Create freely. Express mindfully. Connect with community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="#signup"
              className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
              style={{ backgroundColor: '#f11568' }}
            >
              Join the Riot
            </a>
            <a 
              href="#events"
              className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-lg font-semibold border border-gray-600 transition-all duration-300"
            >
              Upcoming Events
            </a>
          </div>
        </div>
      </section>

      {/* In Person Art Meditation Marketing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary-900/10 to-purple-900/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
              Experience Art<span className="text-primary-500" style={{ color: '#f11568' }}>Riot</span> Live
            </h2>
            <p className="text-xl lg:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              Step into transformative in-person sessions where art creation takes center stage, supported by mindful movement and energy healing practices. <span className="text-primary-400 font-medium" style={{ color: '#f11568' }}>Take home your unique creation as a lasting reminder of your healing journey.</span>
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-white mb-6">What Makes Our Sessions Unique?</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ backgroundColor: '#f11568' }}>
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">Art as Medicine</h4>
                    <p className="text-gray-300">Creative expression that speaks from your soul - painting, drawing, and mixed media creation with professional supplies provided.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ backgroundColor: '#f11568' }}>
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">Mindful Movement Integration</h4>
                    <p className="text-gray-300">Gentle somatic practices prepare your body and mind for deeper creative flow.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ backgroundColor: '#f11568' }}>
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">Integrated Energy Healing</h4>
                    <p className="text-gray-300">Experience breathwork, sound healing, guided meditation, and musical frequencies designed to shift energy and promote deep relaxation.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ backgroundColor: '#f11568' }}>
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">All Materials Included</h4>
                    <p className="text-gray-300">Professional art supplies and yoga mats—just bring your curiosity.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ backgroundColor: '#f11568' }}>
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">Safe, Supportive Community</h4>
                    <p className="text-gray-300">No experience required—perfect for beginners and seasoned artists alike.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative max-w-md mx-auto">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-primary-500/30">
                <img 
                  src="/Art-Riot-Live-Hero2.png" 
                  alt="Art Riot Live Experience" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end">
                  <div className="p-6 text-center w-full">
                    <h4 className="text-xl font-bold text-white mb-2">Join the Experience</h4>
                    <p className="text-gray-200 text-sm">
                      Limited spaces available for intimate, transformative sessions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <a 
              href="/in-person-events"
              className="inline-block bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 px-12 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              style={{ backgroundColor: '#f11568' }}
            >
              Explore In-Person Events
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* About Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-primary-500 mb-6">✨ About Art Riot</h2>
          <div className="text-lg lg:text-xl text-gray-300 leading-relaxed space-y-6">
            <p>
              Art Riot is a creative community where we break free from judgment and the &ldquo;rules&rdquo; of what art should be. 
              Together we explore mindful art practices, creative meditation, and gentle movement—guided sessions that 
              open the door to freedom, expression, and connection.
            </p>
            <p>
              This isn&rsquo;t therapy—it&rsquo;s a safe, inspiring space for all ages and all experience levels to discover the joy of making.
            </p>
          </div>
        </div>
      </section>

      {/* Event Notifications Signup Section */}
      <section id="signup" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Never Miss an <span className="text-primary-500" style={{ color: '#f11568' }}>ArtRiot</span> Event
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Be the first to know about new workshops, special events, and creative gatherings. 
            Join our notification list and stay connected with the ArtRiot community.
          </p>
          
          {emailSubmitted ? (
            <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-6 max-w-md mx-auto">
              <div className="flex items-center justify-center space-x-2 text-green-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-semibold">You&apos;re all set!</span>
              </div>
              <p className="text-green-300 mt-2">We&apos;ll notify you about upcoming events.</p>
            </div>
          ) : (
            <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  disabled={isSubmittingEmail}
                />
                <button
                  type="submit"
                  disabled={isSubmittingEmail}
                  className="bg-primary-500 hover:bg-primary-600 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed whitespace-nowrap"
                  style={{ backgroundColor: isSubmittingEmail ? undefined : '#f11568' }}
                >
                  {isSubmittingEmail ? 'Joining...' : 'Get Notified'}
                </button>
              </div>
              {emailError && (
                <p className="text-red-400 text-sm mt-3 text-center">{emailError}</p>
              )}
            </form>
          )}
          
          <p className="text-gray-500 text-sm mt-4">
            ✨ No spam, just creative inspiration. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* Events Calendar Section */}
      <section id="events" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">Upcoming Events</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Connect with fellow artists, learn new techniques, and be part of our creative community.
            </p>
          </div>

          {loading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
              <p className="text-gray-400 mt-4">Loading events...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {events.map((event) => (
                <div key={event.id} className="bg-gray-900 rounded-xl p-6 border border-gray-700 hover:border-primary-500 transition-all duration-300 relative">
                  {event.name.includes('Coming Soon') && (
                    <div className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10"
                         style={{ backgroundColor: '#f11568' }}>
                      Coming Soon
                    </div>
                  )}
                  {event.cover && (
                    <div className="w-full h-48 bg-primary-500 rounded-lg mb-4 flex items-center justify-center">
                      <span className="text-white font-medium">Event Image</span>
                    </div>
                  )}
                  <h3 className="text-xl font-semibold text-white mb-2">{event.name}</h3>
                  {event.name === ART_MEDITATION_EVENT.name ? (
                    <p className="text-gray-400 text-sm mb-3">{ART_MEDITATION_EVENT.date} at {ART_MEDITATION_EVENT.time}</p>
                  ) : !event.name.includes('Coming Soon') ? (
                    <p className="text-gray-400 text-sm mb-3">{formatEventDate(event.start_time)}</p>
                  ) : null}
                  {event.description && (
                    <p className="text-gray-300 mb-4">{event.description}</p>
                  )}
                  {event.place && (
                    <div className="text-gray-400 text-sm">
                      <p className="font-medium">{event.place.name}</p>
                      {event.place.location.street && (
                        <p>{event.place.location.street}, {event.place.location.city}</p>
                      )}
                      {!event.place.location.street && event.place.location.city && (
                        <p>{event.place.location.city}</p>
                      )}
                    </div>
                  )}
                  {event.name === 'Art Meditation' ? (
                    <a 
                      href="/register/art-meditation"
                      className="inline-block mt-4 bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                      style={{ backgroundColor: '#f11568' }}
                    >
                      Register Now
                    </a>
                  ) : event.name === 'Body Wisdom: Somatic Art Journey' ? (
                    <Link 
                      href="/register/in-person/somatic-movement"
                      className="inline-block mt-4 bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                      style={{ backgroundColor: '#f11568' }}
                    >
                      Learn More
                    </Link>
                  ) : event.name === 'Advanced Breathwork & Creative Expression' ? (
                    <Link 
                      href="/register/in-person/breathwork"
                      className="inline-block mt-4 bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                      style={{ backgroundColor: '#f11568' }}
                    >
                      Learn More
                    </Link>
                  ) : event.name === 'In Person Art Meditation' ? (
                    <Link 
                      href="/in-person-events"
                      className="inline-block mt-4 bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                      style={{ backgroundColor: '#f11568' }}
                    >
                      View Events
                    </Link>
                  ) : !event.name.includes('Coming Soon') ? (
                    <button className="mt-4 bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                         style={{ backgroundColor: '#f11568' }}>
                      Learn More
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Highlights Section - Hidden */}
      {/* 
      <section id="highlights" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">Community Highlights</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Stay updated with the latest news, artist features, and creative inspiration from our community.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {newsletterHighlights.map((highlight) => (
              <article key={highlight.id} className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-primary-500 transition-all duration-300">
                <div className="w-full h-48 bg-primary-500 flex items-center justify-center">
                  <span className="text-white font-medium">Highlight Image</span>
                </div>
                <div className="p-6">
                  <p className="text-gray-400 text-sm mb-2">{highlight.date}</p>
                  <h3 className="text-lg font-semibold text-white mb-3">{highlight.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">{highlight.excerpt}</p>
                  <button className="text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors">
                    Read More →
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      */}

      {/* Newsletter Signup Section */}
      <section id="signup" className="py-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--color-gray-900)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Ready to break free and create?</h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            This group is free to join, open to all ages, and no art skills are required. Just curiosity and a willingness to play.
          </p>
          
          {/* Newsletter Form - HIDDEN FOR NOW */}
          {/*
          <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email for session updates"
                className="flex-1 px-6 py-4 bg-gray-800 text-white placeholder-gray-400 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
              <button
                type="submit"
                className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                style={{ backgroundColor: '#f11568' }}
              >
                Join Updates
              </button>
            </div>
          </form>
          
          {isSubmitted && (
            <div className="mb-6">
              <p className="text-green-400 font-medium mb-3">Welcome to the ArtRiot community!</p>
              <p className="text-gray-400 text-sm">Check your email for a welcome message with next steps!</p>
            </div>
          )}
          */}

          {/* Facebook Group CTA */}
          <div className="mb-8">
            <p className="text-gray-400 text-sm mb-4">Connect with our daily community:</p>
            <a 
              href="https://www.facebook.com/groups/artriot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Join Facebook Group
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 text-center">
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="text-2xl font-bold text-white">100%</div>
              <div className="text-gray-400 text-sm">Judgment-Free</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="text-2xl font-bold text-white">All</div>
              <div className="text-gray-400 text-sm">Ages Welcome</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="text-2xl font-bold text-white">Free</div>
              <div className="text-gray-400 text-sm">To Join</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="text-2xl font-bold text-white">All</div>
              <div className="text-gray-400 text-sm">Skill Levels</div>
            </div>
          </div>
        </div>
      </section>

      {/* Art Kits Section */}
      <section id="art-kits" className="py-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--color-black)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">Curated Art Kits</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Handpicked supplies to support your creative journey. Quality materials 
              trusted by our mindful art community.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Acrylic Painting Kit */}
            <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-primary-500 transition-all duration-300">
              <div className="w-full h-48 bg-white flex items-center justify-center overflow-hidden">
                <img 
                  src="/Acrylic_Paint_Kit.png" 
                  alt="Acrylic Painting Kit"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = '<span className="text-primary-500 font-medium text-lg">Acrylic Painting</span>';
                  }}
                />
              </div>
              <div className="p-6">
                <h4 className="text-xl font-semibold text-white mb-3">Acrylic Painting Kit</h4>
                <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                  Vibrant acrylic colors, quality brushes, and canvas boards. Perfect for expressive, mindful painting sessions.
                </p>
                <a
                  href="https://amzn.to/4gRtxbb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-primary-500 hover:bg-primary-600 text-white text-center px-6 py-3 rounded-lg font-medium transition-all duration-300"
                  style={{ backgroundColor: '#f11568' }}
                >
                  Get Kit on Amazon →
                </a>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  As an Amazon Associate, we earn from qualifying purchases
                </p>
              </div>
            </div>

            {/* Graphite Drawing Kit */}
            <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-primary-500 transition-all duration-300">
              <div className="w-full h-48 bg-white flex items-center justify-center overflow-hidden">
                <img 
                  src="/Graphite_Kit.jpg" 
                  alt="Graphite Drawing Kit"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = '<span className="text-primary-500 font-medium text-lg">Graphite Drawing</span>';
                  }}
                />
              </div>
              <div className="p-6">
                <h4 className="text-xl font-semibold text-white mb-3">Graphite Drawing Kit</h4>
                <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                  Professional graphite pencils, blending tools, and sketching paper for contemplative drawing practice.
                </p>
                <a
                  href="https://amzn.to/3KMInnD"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-primary-500 hover:bg-primary-600 text-white text-center px-6 py-3 rounded-lg font-medium transition-all duration-300"
                  style={{ backgroundColor: '#f11568' }}
                >
                  Get Kit on Amazon →
                </a>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  As an Amazon Associate, we earn from qualifying purchases
                </p>
              </div>
            </div>

            {/* Mixed Media Kit */}
            <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-primary-500 transition-all duration-300">
              <div className="w-full h-48 bg-white flex items-center justify-center overflow-hidden">
                <img 
                  src="/Mixed_Media_Kit.jpg" 
                  alt="Mixed Media Kit"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = '<span className="text-primary-500 font-medium text-lg">Mixed Media</span>';
                  }}
                />
              </div>
              <div className="p-6">
                <h4 className="text-xl font-semibold text-white mb-3">Mixed Media Kit</h4>
                <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                  Explore multiple mediums with pastels, watercolors, charcoal, and textured papers for creative freedom.
                </p>
                <a
                  href="https://amzn.to/3KRVGTK"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-primary-500 hover:bg-primary-600 text-white text-center px-6 py-3 rounded-lg font-medium transition-all duration-300"
                  style={{ backgroundColor: '#f11568' }}
                >
                  Get Kit on Amazon →
                </a>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  As an Amazon Associate, we earn from qualifying purchases
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-white mb-4">ArtRiot</h3>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            A playful rebellion against perfection. Join our mindful creative community 
            where art is about expression, connection, and joy.
          </p>
          
          {/* Facebook Group CTA */}
          <div className="mb-8">
            <a 
              href="https://www.facebook.com/groups/artriot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Join Our Facebook Group
            </a>
            <p className="text-gray-500 text-sm mt-2">Connect with fellow creators in our supportive community</p>
          </div>
          
          <p className="text-gray-500 text-sm">
            © 2025 ArtRiot. All rights reserved. | A Tim Watts Art Initiative
          </p>
        </div>
      </footer>
    </main>
  );
}
