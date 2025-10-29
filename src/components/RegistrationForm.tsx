'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

interface RegistrationFormProps {
  eventType: string;
  eventName: string;
  eventDate: string;
  price: string;
  maxCapacity: number;
  currentRegistrations?: number;
  availableSpots?: number;
  soldOut?: boolean;
  loading?: boolean;
}

interface ParticipantInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  dietaryRestrictions: string;
  medicalConditions: string;
  experience: string;
}

interface EmergencyContact {
  name: string;
  phone: string;
  relation: string;
}

export default function RegistrationForm({ 
  eventType, 
  eventName, 
  eventDate, 
  price,
  maxCapacity,
  currentRegistrations = 0,
  availableSpots = 0,
  soldOut = false,
  loading = false
}: RegistrationFormProps) {
  const [participantInfo, setParticipantInfo] = useState<ParticipantInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    dietaryRestrictions: '',
    medicalConditions: '',
    experience: '',
  });

  const [emergencyContact, setEmergencyContact] = useState<EmergencyContact>({
    name: '',
    phone: '',
    relation: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const spotsRemaining = availableSpots > 0 ? availableSpots : maxCapacity - currentRegistrations;
  const isSoldOut = soldOut || spotsRemaining <= 0;

  const handleParticipantChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setParticipantInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEmergencyContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEmergencyContact(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreedToTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Create checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventType,
          participantInfo,
          emergencyContact,
          eventDate,
        }),
      });

      const { sessionId, url, error: apiError } = await response.json();

      if (apiError) {
        throw new Error(apiError);
      }

      // Redirect to Stripe checkout URL
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL received');
      }

    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSoldOut) {
    return (
      <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-4">{eventName}</h3>
          <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-6">
            <p className="text-red-400 font-medium text-lg">🎫 Event Sold Out</p>
            <p className="text-red-300 mt-2">All {maxCapacity} spots have been filled.</p>
          </div>
          <p className="text-gray-400 mt-4">
            Join our mailing list to be notified of future events!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">{eventName}</h3>
        <div className="flex flex-wrap gap-4 text-sm text-gray-300">
          <span>📅 {eventDate}</span>
          <span>💰 {price}</span>
          <span className={spotsRemaining <= 5 ? 'text-orange-400' : 'text-green-400'}>
            🎫 {spotsRemaining} spots remaining
          </span>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-900/30 border border-red-500/30 rounded-lg">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Participant Information */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Participant Information</h4>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-white font-medium mb-2">
                First Name *
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={participantInfo.firstName}
                onChange={handleParticipantChange}
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter your first name"
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-white font-medium mb-2">
                Last Name *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={participantInfo.lastName}
                onChange={handleParticipantChange}
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter your last name"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-white font-medium mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={participantInfo.email}
              onChange={handleParticipantChange}
              required
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="your@email.com"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="phone" className="block text-white font-medium mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={participantInfo.phone}
                onChange={handleParticipantChange}
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="(555) 123-4567"
              />
            </div>

            <div>
              <label htmlFor="dateOfBirth" className="block text-white font-medium mb-2">
                Date of Birth *
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={participantInfo.dateOfBirth}
                onChange={handleParticipantChange}
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label htmlFor="experience" className="block text-white font-medium mb-2">
              Previous Experience with Movement/Art Therapy
            </label>
            <select
              id="experience"
              name="experience"
              value={participantInfo.experience}
              onChange={handleParticipantChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select your experience level</option>
              <option value="none">No prior experience</option>
              <option value="some">Some experience</option>
              <option value="experienced">Experienced</option>
              <option value="professional">Professional/Practitioner</option>
            </select>
          </div>

          <div>
            <label htmlFor="dietaryRestrictions" className="block text-white font-medium mb-2">
              Allergies
            </label>
            <textarea
              id="dietaryRestrictions"
              name="dietaryRestrictions"
              value={participantInfo.dietaryRestrictions}
              onChange={handleParticipantChange}
              rows={2}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Please list any allergies we should be aware of..."
            />
          </div>

          <div>
            <label htmlFor="medicalConditions" className="block text-white font-medium mb-2">
              Medical Conditions or Physical Limitations
            </label>
            <textarea
              id="medicalConditions"
              name="medicalConditions"
              value={participantInfo.medicalConditions}
              onChange={handleParticipantChange}
              rows={2}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Please describe any medical conditions we should be aware of..."
            />
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Emergency Contact</h4>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="emergencyName" className="block text-white font-medium mb-2">
                Emergency Contact Name *
              </label>
              <input
                type="text"
                id="emergencyName"
                name="name"
                value={emergencyContact.name}
                onChange={handleEmergencyContactChange}
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Emergency contact name"
              />
            </div>

            <div>
              <label htmlFor="emergencyPhone" className="block text-white font-medium mb-2">
                Emergency Contact Phone *
              </label>
              <input
                type="tel"
                id="emergencyPhone"
                name="phone"
                value={emergencyContact.phone}
                onChange={handleEmergencyContactChange}
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="(555) 123-4567"
              />
            </div>
          </div>

          <div>
            <label htmlFor="emergencyRelation" className="block text-white font-medium mb-2">
              Relationship to Participant *
            </label>
            <select
              id="emergencyRelation"
              name="relation"
              value={emergencyContact.relation}
              onChange={handleEmergencyContactChange}
              required
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select relationship</option>
              <option value="spouse">Spouse/Partner</option>
              <option value="parent">Parent</option>
              <option value="child">Child</option>
              <option value="sibling">Sibling</option>
              <option value="friend">Friend</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="terms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-700 rounded bg-gray-800"
            />
            <label htmlFor="terms" className="text-sm text-gray-300 leading-relaxed">
              I agree to the{' '}
              <a href="/terms" className="text-primary-500 hover:text-primary-400" style={{ color: '#f11568' }}>
                Terms and Conditions
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-primary-500 hover:text-primary-400" style={{ color: '#f11568' }}>
                Privacy Policy
              </a>
              . I understand that participation in this event involves physical movement and creative expression, and I participate at my own risk. I hereby release and hold harmless Art Riot and Tim Watts from any and all claims, damages, or injuries that may occur during or as a result of my participation in this event.
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !agreedToTerms}
          className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100"
          style={{ backgroundColor: agreedToTerms ? '#f11568' : undefined }}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            `Register & Pay ${price}`
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-400">
        <p>🔒 Secure payment powered by Stripe</p>
        <p className="mt-1">You&apos;ll receive a confirmation email after successful payment.</p>
      </div>
    </div>
  );
}