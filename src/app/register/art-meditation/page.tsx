'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ArtMeditationRegistration() {
  const [formData, setFormData] = useState({
    firstName: '',
    email: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/register-meditation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.firstName,
          email: formData.email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        alert(data.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-gray-900 rounded-xl p-8 border border-gray-700">
            <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#f11568' }}>
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Registration Confirmed!</h1>
            <p className="text-gray-300 mb-6">
              Thank you for registering for Art Meditation. You&rsquo;ll receive a confirmation email with the Google Meet link and session details soon.
            </p>
            <div className="space-y-4">
              <div className="bg-gray-800 rounded-lg p-4 text-left">
                <h3 className="text-white font-semibold mb-2">Event Details</h3>
                <p className="text-gray-300 text-sm">📅 Sunday, October 19, 2025</p>
                <p className="text-gray-300 text-sm">🕘 10:00 AM MST</p>
                <p className="text-gray-300 text-sm">💻 Virtual Event (Google Meet link in email)</p>
              </div>
              <Link 
                href="/"
                className="block w-full bg-primary-500 hover:bg-primary-600 text-white text-center px-6 py-3 rounded-lg font-medium transition-all duration-300"
                style={{ backgroundColor: '#f11568' }}
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/80 backdrop-blur-lg z-50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <h1 className="text-2xl font-bold text-white">ArtRiot</h1>
            </Link>
            <Link 
              href="/"
              className="text-gray-300 hover:text-white transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section with Logo */}
      <section className="pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg mx-auto text-center">
          <div className="mb-8">
            <img 
              src="/Art_Riot_Horizontal.png" 
              alt="ArtRiot" 
              className="mx-auto max-w-full h-auto"
              style={{ maxHeight: '200px' }}
            />
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">Art Meditation Registration</h1>
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-700 mb-6">
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div>
                  <p className="text-gray-400 uppercase tracking-wide">Date</p>
                  <p className="text-white font-medium">Oct 19</p>
                </div>
                <div>
                  <p className="text-gray-400 uppercase tracking-wide">Time</p>
                  <p className="text-white font-medium">10 AM MST</p>
                </div>
                <div>
                  <p className="text-gray-400 uppercase tracking-wide">Format</p>
                  <p className="text-white font-medium">Virtual</p>
                </div>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Enter your details to receive the session link and materials
            </p>
          </div>

          {/* Kit.com Form Integration */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
            {/* 
              REPLACE THIS COMMENT WITH YOUR KIT.COM EMBED CODE
              
              Instructions:
              1. Copy your Kit.com form embed code from your Kit dashboard
              2. Paste it here, replacing this comment
              3. The embed code will look something like:
              
              <script async data-uid="YOUR_FORM_ID" src="https://your-account.ck.page/YOUR_FORM_ID/index.js"></script>
              
              OR for an iframe:
              
              <iframe src="https://your-account.ck.page/YOUR_FORM_ID" frameborder="0" scrolling="no" style="border:none; overflow:hidden; width:100%;"></iframe>
            */}
            
            {/* Fallback form - Remove this when you add Kit embed */}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-white font-medium mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 bg-gray-800 text-white placeholder-gray-400 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="email" className="block text-white font-medium mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 bg-gray-800 text-white placeholder-gray-400 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
                style={{ backgroundColor: '#f11568' }}
              >
                {isSubmitting ? 'Registering...' : 'Get Session Link'}
              </button>
            </form>

            <p className="text-gray-400 text-xs text-center mt-4">
              You&rsquo;ll receive the Google Meet link and session details via email
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}