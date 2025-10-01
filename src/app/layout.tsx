import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
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
  description: "Join our community of artists, makers, and dreamers who believe art should disrupt, inspire, and unite. Discover events, workshops, and creative inspiration.",
  keywords: ["art", "artists", "creative community", "workshops", "events", "art supplies", "creativity"],
  authors: [{ name: "ArtRiot" }],
  creator: "ArtRiot",
  publisher: "ArtRiot",
  metadataBase: new URL('https://artriot.com'),
  openGraph: {
    title: "ArtRiot - Where Creativity Rebels Against the Ordinary",
    description: "Join our community of artists, makers, and dreamers who believe art should disrupt, inspire, and unite.",
    type: "website",
    locale: "en_US",
    siteName: "ArtRiot",
  },
  twitter: {
    card: "summary_large_image",
    title: "ArtRiot - Where Creativity Rebels Against the Ordinary",
    description: "Join our community of artists, makers, and dreamers who believe art should disrupt, inspire, and unite.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
