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
      name: 'ArtRiot Community Paint & Sip',
      start_time: '2025-10-15T18:00:00',
      description: 'Join us for an evening of creativity and community! All skill levels welcome.',
      place: {
        name: 'ArtRiot Studio',
        location: {
          street: '123 Creative Ave',
          city: 'Art District'
        }
      },
      cover: {
        source: '/events/paint-sip.jpg'
      }
    },
    {
      id: '2',
      name: 'Mixed Media Workshop',
      start_time: '2025-10-22T14:00:00',
      description: 'Explore texture and layering techniques in this hands-on workshop.',
      place: {
        name: 'Community Art Center',
        location: {
          street: '456 Maker St',
          city: 'Creative Quarter'
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

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
    setEmail('');
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
                <a href="#highlights" className="text-gray-300 hover:text-white transition-colors">Highlights</a>
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
              Art Riot is a creative community where we break free from judgment and the "rules" of what art should be. 
              Together we explore mindful art practices, creative meditation, and gentle movement—guided sessions that 
              open the door to freedom, expression, and connection.
            </p>
            <p>
              This isn't therapy—it's a safe, inspiring space for all ages and all experience levels to discover the joy of making.
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
                <div key={event.id} className="bg-gray-900 rounded-xl p-6 border border-gray-700 hover:border-primary-500 transition-all duration-300">
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
                      <p>{event.place.location.street}, {event.place.location.city}</p>
                    </div>
                  )}
                  <button className="mt-4 bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300">
                    Learn More
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Highlights Section */}
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

      {/* Newsletter Signup Section */}
      <section id="signup" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Ready to break free and create?</h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            This group is free to join, open to all ages, and no art skills are required. Just curiosity and a willingness to play.
          </p>
          
          <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 bg-gray-800 text-white placeholder-gray-400 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
              <button
                type="submit"
                className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                style={{ backgroundColor: '#f11568' }}
              >
                Join Now
              </button>
            </div>
          </form>
          
          {isSubmitted && (
            <p className="text-green-400 font-medium">Welcome to the ArtRiot community!</p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 text-center">
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="text-2xl font-bold text-white">500+</div>
              <div className="text-gray-400 text-sm">Artists</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="text-2xl font-bold text-white">50+</div>
              <div className="text-gray-400 text-sm">Monthly Events</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="text-2xl font-bold text-white">1000+</div>
              <div className="text-gray-400 text-sm">Artworks Shared</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="text-2xl font-bold text-white">24/7</div>
              <div className="text-gray-400 text-sm">Community</div>
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
              <div className="w-full h-48 bg-primary-500 flex items-center justify-center">
                <span className="text-white font-medium text-lg">Acrylic Painting</span>
              </div>
              <div className="p-6">
                <h4 className="text-xl font-semibold text-white mb-3">Acrylic Painting Kit</h4>
                <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                  Vibrant acrylic colors, quality brushes, and canvas boards. Perfect for expressive, mindful painting sessions.
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-primary-400">$34.99</span>
                </div>
                <button className="block w-full bg-primary-500 hover:bg-primary-600 text-white text-center px-6 py-3 rounded-lg font-medium transition-all duration-300">
                  Get Kit →
                </button>
              </div>
            </div>

            {/* Graphite Drawing Kit */}
            <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-primary-500 transition-all duration-300">
              <div className="w-full h-48 bg-gray-600 flex items-center justify-center">
                <span className="text-white font-medium text-lg">Graphite Drawing</span>
              </div>
              <div className="p-6">
                <h4 className="text-xl font-semibold text-white mb-3">Graphite Drawing Kit</h4>
                <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                  Professional graphite pencils, blending tools, and sketching paper for contemplative drawing practice.
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-primary-400">$24.99</span>
                </div>
                <button className="block w-full bg-primary-500 hover:bg-primary-600 text-white text-center px-6 py-3 rounded-lg font-medium transition-all duration-300">
                  Get Kit →
                </button>
              </div>
            </div>

            {/* Mixed Media Kit */}
            <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-primary-500 transition-all duration-300">
              <div className="w-full h-48 bg-gradient-to-r from-primary-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-medium text-lg">Mixed Media</span>
              </div>
              <div className="p-6">
                <h4 className="text-xl font-semibold text-white mb-3">Mixed Media Kit</h4>
                <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                  Explore multiple mediums with pastels, watercolors, charcoal, and textured papers for creative freedom.
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-primary-400">$49.99</span>
                </div>
                <button className="block w-full bg-primary-500 hover:bg-primary-600 text-white text-center px-6 py-3 rounded-lg font-medium transition-all duration-300">
                  Get Kit →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/20">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-white mb-4">ArtRiot</h3>
          <p className="text-white/60 mb-6 max-w-2xl mx-auto">
            Disrupting the ordinary through creative expression. Join our community of artists, 
            makers, and visionaries who believe art can change the world.
          </p>
          <div className="flex justify-center space-x-6 mb-6">
            <a href="#" className="text-white/60 hover:text-white transition-colors">Facebook</a>
            <a href="#" className="text-white/60 hover:text-white transition-colors">Instagram</a>
            <a href="#" className="text-white/60 hover:text-white transition-colors">Twitter</a>
            <a href="#" className="text-white/60 hover:text-white transition-colors">Discord</a>
          </div>
          <p className="text-white/40 text-sm">
            © 2025 ArtRiot. All rights reserved. | A Tim Watts Art Initiative
          </p>
        </div>
      </footer>
    </main>
  );
}
