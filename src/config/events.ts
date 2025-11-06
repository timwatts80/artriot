/**
 * Central Event Configuration
 * 
 * This file contains all event details to ensure consistency across
 * the homepage, registration page, and email notifications.
 * Last updated: October 19, 2025
 */

export interface EventConfig {
  name: string;
  date: string; // Human readable format
  isoDateTime: string; // ISO format for technical use
  time: string; // Human readable time
  timezone: string;
  duration: string;
  format: string;
  meetingLink: string; // Virtual meeting link (Zoom, Google Meet, etc.)
  passcode?: string; // Optional passcode for private sharing
  description: string;
}

export const ART_MEDITATION_EVENT: EventConfig = {
  name: 'Art Meditation',
  date: 'Saturday, November 9, 2025',
  isoDateTime: '2025-11-09T10:00:00-07:00', // 10 AM MST (UTC-7)
  time: '10:00 AM MST',
  timezone: 'MST',
  duration: '60 minutes',
  format: 'Virtual (Zoom)',
  meetingLink: 'https://us06web.zoom.us/j/88022506297?pwd=cibLxWX0aDVbx1AK6HWDcHbxQ6gJbh.1',
  passcode: '681022',
  description: 'A mindful art session combining meditation and creative expression. Connect with your inner artist in a peaceful, supportive virtual environment.',
};

// Helper functions for consistent formatting
export const formatEventDate = (config: EventConfig) => {
  return new Date(config.isoDateTime).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

export const getShortDate = (config: EventConfig) => {
  return new Date(config.isoDateTime).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

export const getFullEventDetails = (config: EventConfig) => ({
  ...config,
  formattedDate: formatEventDate(config),
  shortDate: getShortDate(config),
});