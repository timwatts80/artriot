'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitStatus('error');
        setErrorMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitStatus('error');
      setErrorMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-black pt-20">
      {/* Hero Section */}
      <section className="py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 to-black"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Have questions about Art Riot Live? Want to collaborate or bring sessions to your community? 
            We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-8">
        <div className="max-w-2xl mx-auto px-6">
          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
            {submitStatus === 'success' && (
              <div className="mb-8 p-4 bg-green-900/30 border border-green-500/30 rounded-lg">
                <p className="text-green-400 font-medium">✅ Message sent successfully!</p>
                <p className="text-green-300 text-sm mt-1">Check your email for confirmation.</p>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mb-8 p-4 bg-red-900/30 border border-red-500/30 rounded-lg">
                <p className="text-red-400 font-medium">❌ {errorMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-white font-medium mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  placeholder="Your full name"
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-white font-medium mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  placeholder="your.email@example.com"
                />
              </div>

              {/* Subject Field */}
              <div>
                <label htmlFor="subject" className="block text-white font-medium mb-2">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                >
                  <option value="">Select a subject</option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Session Information">Session Information</option>
                  <option value="Private Event">Private Event / Group Booking</option>
                  <option value="Partnership">Partnership Opportunity</option>
                  <option value="Venue Collaboration">Venue Collaboration</option>
                  <option value="Media Inquiry">Media Inquiry</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Message Field */}
              <div>
                <label htmlFor="message" className="block text-white font-medium mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-vertical"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100"
                  style={{ backgroundColor: isSubmitting ? '#6b7280' : '#f11568' }}
                >
                  {isSubmitting ? 'Sending Message...' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-16 bg-gray-900/30">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">Other Ways to Connect</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-white font-bold mb-2">📧 Email</h3>
              <p className="text-gray-400 mb-2">For general inquiries</p>
              <a 
                href="mailto:info@artriot.live" 
                className="text-primary-500 hover:text-primary-400 transition-colors text-lg"
                style={{ color: '#f11568' }}
              >
                info@artriot.live
              </a>
            </div>

            <div>
              <h3 className="text-white font-bold mb-2">👥 Community</h3>
              <p className="text-gray-400 mb-2">Join our Facebook group for daily inspiration and connection</p>
              <a 
                href="https://www.facebook.com/groups/artriot" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-500 hover:text-primary-400 transition-colors text-lg"
                style={{ color: '#f11568' }}
              >
                Art Riot Community
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}