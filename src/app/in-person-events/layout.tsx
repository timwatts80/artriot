import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "In-Person Intermodal Expressive Art Healing - ArtRiot",
  description: "Experience transformative in-person healing sessions that blend movement, meditation, music, and art. Join our immersive workshops for deep personal transformation and creative expression.",
  keywords: ["expressive arts", "healing workshops", "movement meditation", "creative arts", "in-person events", "creative healing", "intermodal expression", "wellness workshops", "art and movement"],
  openGraph: {
    title: "In-Person Intermodal Expressive Art Healing - ArtRiot",
    description: "Experience transformative in-person healing sessions that blend movement, meditation, music, and art. Join our immersive workshops for deep personal transformation.",
    type: "website",
    url: "https://artriot.com/in-person-events",
    images: [
      {
        url: "/Art_Riot_Banner.jpg",
        width: 1641,
        height: 857,
        alt: "Intermodal Expressive Art Healing Sessions - ArtRiot",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "In-Person Intermodal Expressive Art Healing - ArtRiot",
    description: "Experience transformative healing through movement, meditation, music, and art.",
    images: ["/Art_Riot_Banner.jpg"],
  },
};

export default function InPersonEventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}