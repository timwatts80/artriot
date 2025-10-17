'use client';

import { useState, useEffect } from 'react';

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

interface ArtKit {
  id: number;
  name: string;
  description: string;
  amazonUrl: string;
  price: string;
  image: string;
  category: string;
}

interface NewsletterHighlight {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  image: string;
}

export default function ArtRiotHomePage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for development - replace with actual API calls
  const mockEvents: Event[] = [
    {
      id: '1',
      name: 'Art Meditation',
      start_time: '2025-10-19T17:00:00',
      description: 'A mindful art session combining meditation and creative expression. Connect with your inner artist in a peaceful, supportive virtual environment.',
      place: {
        name: 'Virtual Event',
        location: {
          street: '',
          city: 'Online'
        }
      }
    },
    {
      id: '2',
      name: 'Coming Soon: In Person Art Flow',
      start_time: '2025-10-22T14:00:00',
      description: 'Stay tuned for our upcoming in-person art flow experience. Details coming soon!',
      place: {
        name: 'Location TBA',
        location: {
          street: '',
          city: 'Details Coming Soon'
        }
      }
    }
  ];

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

  const artKits: ArtKit[] = [
    // Beginner Kits
    {
      id: 1,
      name: "Essential Acrylic Starter Set",
      description: "Perfect for beginners: 12 vibrant acrylic colors, brushes, and canvas boards",
      amazonUrl: "https://amazon.com/dp/B08EXAMPLE1",
      price: "$29.99",
      image: "/kits/acrylic-starter.jpg",
      category: "Beginner"
    },
    {
      id: 2,
      name: "Watercolor Discovery Kit",
      description: "High-quality watercolor paints, brushes, and premium watercolor paper",
      amazonUrl: "https://amazon.com/dp/B08EXAMPLE2",
      price: "$34.99",
      image: "/kits/watercolor-beginner.jpg",
      category: "Beginner"
    },
    {
      id: 3,
      name: "Drawing Fundamentals Set",
      description: "Pencils, charcoal, blending tools, and sketching paper for drawing basics",
      amazonUrl: "https://amazon.com/dp/B08EXAMPLE3",
      price: "$19.99",
      image: "/kits/drawing-basics.jpg",
      category: "Beginner"
    },
    // Intermediate Kits
    {
      id: 4,
      name: "Professional Acrylic Paint Set",
      description: "Artist-grade acrylics with extended working time and rich pigmentation",
      amazonUrl: "https://amazon.com/dp/B08EXAMPLE4",
      price: "$67.99",
      image: "/kits/acrylic-pro.jpg",
      category: "Intermediate"
    },
    {
      id: 5,
      name: "Mixed Media Explorer Kit",
      description: "Combine techniques with pastels, charcoal, watercolor, and textured papers",
      amazonUrl: "https://amazon.com/dp/B08EXAMPLE5",
      price: "$89.99",
      image: "/kits/mixed-media.jpg",
      category: "Intermediate"
    },
    {
      id: 6,
      name: "Oil Painting Starter Kit",
      description: "Traditional oil paints, solvents, brushes, and canvas for classical techniques",
      amazonUrl: "https://amazon.com/dp/B08EXAMPLE6",
      price: "$124.99",
      image: "/kits/oil-starter.jpg",
      category: "Intermediate"
    },
    // Advanced Kits
    {
      id: 7,
      name: "Master Artist Oil Set",
      description: "Premium pigments, finest brushes, and archival canvas for serious artists",
      amazonUrl: "https://amazon.com/dp/B08EXAMPLE7",
      price: "$299.99",
      image: "/kits/oil-master.jpg",
      category: "Advanced"
    },
    {
      id: 8,
      name: "Professional Watercolor Studio",
      description: "Artist-grade tubes, natural hair brushes, and handmade watercolor papers",
      amazonUrl: "https://amazon.com/dp/B08EXAMPLE8",
      price: "$189.99",
      image: "/kits/watercolor-pro.jpg",
      category: "Advanced"
    },
    {
      id: 9,
      name: "Digital Art Creation Kit",
      description: "Graphics tablet, stylus, and premium digital art software bundle",
      amazonUrl: "https://amazon.com/dp/B08EXAMPLE9",
      price: "$249.99",
      image: "/kits/digital-art.jpg",
      category: "Advanced"
    }
  ];

  useEffect(() => {
    // Simulate loading events
    setTimeout(() => {
      setEvents(mockEvents);
      setLoading(false);
    }, 1000);
  }, []);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/newsletter-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 5000);
        setEmail('');
      } else {
        alert(data.error || 'Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Newsletter signup error:', error);
      alert('Signup failed. Please check your connection and try again.');
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

  const groupKitsByCategory = (kits: ArtKit[]) => {
    return kits.reduce((acc, kit) => {
      if (!acc[kit.category]) {
        acc[kit.category] = [];
      }
      acc[kit.category].push(kit);
      return acc;
    }, {} as Record<string, ArtKit[]>);
  };

  const groupedKits = groupKitsByCategory(artKits);

  return (
    <main className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/80 backdrop-blur-lg z-50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">ArtRiot</h1>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center space-x-8">
                <a href="#events" className="text-gray-300 hover:text-white transition-colors">Events</a>
                <a href="#signup" className="text-gray-300 hover:text-white transition-colors">Join</a>
                <a href="#art-kits" className="text-gray-300 hover:text-white transition-colors">Art Kits</a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url(/grey-abstract-art-background.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Dark gradient overlay from bottom to top */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/0"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="mb-6">
            <img 
              src="/Art_Riot_Horizontal.png" 
              alt="ArtRiot" 
              className="mx-auto max-w-full h-auto"
              style={{ maxHeight: '400px' }}
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
                  <p className="text-gray-400 text-sm mb-3">{formatEventDate(event.start_time)}</p>
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
                  ) : (
                    <button className="mt-4 bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300">
                      Learn More
                    </button>
                  )}
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
      <section id="signup" className="py-16 px-4 sm:px-6 lg:px-8">
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
                <path d="M24 12.073c0-6.627-5.373-12-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
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
      <section id="art-kits" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900">
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
                  src="/81Rgxg6QEBL._AC_SL1500_.jpg" 
                  alt="Graphite Drawing Kit"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = '<span className="text-gray-600 font-medium text-lg">Graphite Drawing</span>';
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
                  src="/81SXnw-qMQL._AC_SL1500_.jpg" 
                  alt="Mixed Media Kit"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = '<span className="text-purple-600 font-medium text-lg">Mixed Media</span>';
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
