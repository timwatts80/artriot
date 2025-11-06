/**
 * Utility to get consistent page padding that accounts for header and optional banner
 * @param showBanner - Whether banner is currently shown
 * @returns Tailwind class for proper top padding
 */
export const getPagePadding = (showBanner: boolean = true) => {
  // Banner (12) + Header (20) = 32 (pt-32)
  // Just Header = 20 (pt-20)
  return showBanner ? 'pt-32' : 'pt-20';
};

/**
 * Get the banner status - centralized place to check if banner should be shown
 * Change this to false to disable banner site-wide
 */
export const SHOW_BANNER = true;