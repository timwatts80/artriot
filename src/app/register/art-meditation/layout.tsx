import type { Metadata } from 'next';
import { ART_MEDITATION_EVENT } from '../../../config/events';

export const metadata: Metadata = {
  title: "Art Meditation Registration - ArtRiot",
  description: `Join our mindful art session combining meditation and creative expression on ${ART_MEDITATION_EVENT.date}. Connect with your inner artist in a peaceful, supportive virtual environment.`,
  openGraph: {
    title: "Art Meditation Registration - ArtRiot",
    description: `Join our mindful art session combining meditation and creative expression on ${ART_MEDITATION_EVENT.date}. Connect with your inner artist in a peaceful, supportive virtual environment.`,
    type: "website",
    url: "https://artriot.com/register/art-meditation",
    images: [
      {
        url: "/Art_Riot_Banner.jpg",
        width: 1641,
        height: 857,
        alt: "Art Meditation - ArtRiot Event",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Art Meditation Registration - ArtRiot",
    description: `Join our mindful art session combining meditation and creative expression on ${ART_MEDITATION_EVENT.date}.`,
    images: ["/Art_Riot_Banner.jpg"],
  },
};

export default function ArtMeditationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}