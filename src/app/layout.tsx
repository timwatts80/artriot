import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Header from "@/components/Header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ArtRiot - Where Creativity Rebels Against the Ordinary",
  description: "Join our community of artists, makers, and dreamers who believe art should disrupt, inspire, and unite. Discover transformative art meditation events, in-person workshops, and creative inspiration.",
  keywords: ["art", "artists", "creative community", "workshops", "events", "art supplies", "creativity", "art meditation", "online events", "Utah", "Salt Lake City", "healing arts", "somatic movement", "frequencies flow"],
  authors: [{ name: "ArtRiot" }],
  creator: "ArtRiot",
  publisher: "ArtRiot",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://artriot.com'),
  alternates: {
    canonical: 'https://artriot.com',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "ArtRiot - Where Creativity Rebels Against the Ordinary",
    description: "Join our community of artists, makers, and dreamers who believe art should disrupt, inspire, and unite. Experience transformative art meditation events combining creativity, movement, and healing.",
    type: "website",
    locale: "en_US",
    url: "https://artriot.com",
    siteName: "ArtRiot",
    images: [
      {
        url: "https://artriot.com/social-share.png",
        width: 1200,
        height: 630,
        alt: "ArtRiot - Where Creativity Rebels Against the Ordinary - Art Meditation Events",
        type: "image/png",
      },
      {
        url: "https://artriot.com/Art_Riot_Horizontal.png",
        width: 1200,
        height: 630,
        alt: "ArtRiot Community - Creative Events and Workshops",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ArtRiot - Where Creativity Rebels Against the Ordinary",
    description: "Experience transformative art meditation events combining creativity, movement, and healing. Join our community of artists and dreamers.",
    images: [
      {
        url: "https://artriot.com/social-share.png",
        alt: "ArtRiot - Art Meditation Events",
      }
    ],
    creator: "@artriot",
    site: "@artriot",
  },
  verification: {
    google: 'your-google-verification-code', // Replace with actual verification code when available
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ArtRiot",
    "description": "Join our community of artists, makers, and dreamers who believe art should disrupt, inspire, and unite.",
    "url": "https://artriot.com",
    "logo": "https://artriot.com/Art_Riot_Banner.jpg",
    "sameAs": [
      "https://twitter.com/artriot",
      "https://instagram.com/artriot",
      "https://facebook.com/artriot"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "url": "https://artriot.com"
    }
  };

  return (
    <html lang="en">
      <head>
        {/* Explicit Open Graph meta tags for better social media compatibility */}
        <meta property="og:image" content="https://artriot.com/social-share.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:alt" content="ArtRiot - Where Creativity Rebels Against the Ordinary" />
        <meta property="og:title" content="ArtRiot - Where Creativity Rebels Against the Ordinary" />
        <meta property="og:description" content="Join our community of artists, makers, and dreamers who believe art should disrupt, inspire, and unite." />
        <meta property="og:url" content="https://artriot.com" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="ArtRiot" />
        <meta property="fb:app_id" content="123456789012345" />
        <meta name="twitter:image" content="https://artriot.com/social-share.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ArtRiot - Where Creativity Rebels Against the Ordinary" />
        <meta name="twitter:description" content="Join our community of artists, makers, and dreamers who believe art should disrupt, inspire, and unite." />
        <meta name="twitter:site" content="@artriot" />
        <meta name="twitter:creator" content="@artriot" />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
