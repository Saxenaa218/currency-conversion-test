import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Currency Quiz Game - Embed',
  description: 'Embeddable version of the Currency Quiz Game',
  robots: 'noindex, nofollow', // Prevent indexing of embed version
};

export default function GameEmbedPage() {
  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      margin: 0, 
      padding: 0,
      overflow: 'hidden'
    }}>
      <iframe
        src="/game.html"
        allow="autoplay; fullscreen; gamepad; keyboard-map"
        title="Currency Quiz Game"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          display: 'block'
        }}
      />
    </div>
  );
}
