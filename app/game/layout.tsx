import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Interactive Currency Converter Game',
  description: 'Test your knowledge of world currencies with this fun interactive quiz game. Learn currency symbols, codes, and countries!',
  openGraph: {
    title: 'Interactive Currency Converter Game',
    description: 'Test your knowledge of world currencies with this fun interactive quiz game. Learn currency symbols, codes, and countries!',
    url: 'https://currency-conversion-test.onrender.com/game',
    siteName: 'Currency Converter Game',
    images: [
      {
        url: 'https://via.placeholder.com/640x360/667eea/ffffff?text=Currency+Quiz+Game',
        width: 640,
        height: 360,
        alt: 'Currency Converter Game Screenshot',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Interactive Currency Converter Game',
    description: 'Test your knowledge of world currencies with this fun interactive quiz game!',
    images: ['https://via.placeholder.com/640x360/667eea/ffffff?text=Currency+Quiz+Game'],
  },
  other: {
    'oembed': 'https://currency-conversion-test.onrender.com/api/oembed?url=https://currency-conversion-test.onrender.com/game',
  },
};

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <link
        rel="alternate"
        type="application/json+oembed"
        href="https://currency-conversion-test.onrender.com/api/oembed?url=https://currency-conversion-test.onrender.com/game"
        title="Interactive Currency Converter Game"
      />
      {children}
    </>
  );
}
