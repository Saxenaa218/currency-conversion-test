'use client'

export default function GamePage() {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ 
          title: 'Currency Quiz Game', 
          url: window.location.href 
        });
      } catch (err) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  return (
    <>
      
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-blue-800">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              💰 Currency Quiz Game
            </h1>
            <p className="text-xl text-blue-100 mb-6">
              Test your knowledge of world currencies and become a financial expert!
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-blue-200">
              <span className="bg-white/20 px-3 py-1 rounded-full">🌍 Global Currencies</span>
              <span className="bg-white/20 px-3 py-1 rounded-full">🎯 Interactive Quiz</span>
              <span className="bg-white/20 px-3 py-1 rounded-full">📱 Mobile Friendly</span>
              <span className="bg-white/20 px-3 py-1 rounded-full">🏆 Score Tracking</span>
            </div>
          </div>

          {/* Game Container */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-white mb-2">
                  Ready to Play?
                </h2>
                <p className="text-blue-100">
                  Challenge yourself with questions about currency symbols, codes, and countries!
                </p>
              </div>

              {/* Game Iframe */}
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src="/game.html"
                  className="absolute top-0 left-0 w-full h-full rounded-2xl border-0"
                  allow="autoplay; fullscreen; gamepad; keyboard-map"
                  title="Currency Quiz Game"
                />
              </div>

              {/* Game Features */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-white/10 rounded-xl">
                  <div className="text-3xl mb-2">🎮</div>
                  <h3 className="text-lg font-semibold text-white mb-1">Interactive Gameplay</h3>
                  <p className="text-blue-100 text-sm">Engaging quiz format with immediate feedback</p>
                </div>
                <div className="text-center p-4 bg-white/10 rounded-xl">
                  <div className="text-3xl mb-2">📊</div>
                  <h3 className="text-lg font-semibold text-white mb-1">Score Tracking</h3>
                  <p className="text-blue-100 text-sm">Track your progress and improve your knowledge</p>
                </div>
                <div className="text-center p-4 bg-white/10 rounded-xl">
                  <div className="text-3xl mb-2">🌐</div>
                  <h3 className="text-lg font-semibold text-white mb-1">Global Knowledge</h3>
                  <p className="text-blue-100 text-sm">Learn about currencies from around the world</p>
                </div>
              </div>

              {/* Share Section */}
              <div className="mt-8 text-center">
                <h3 className="text-xl font-semibold text-white mb-4">Share This Game</h3>
                <div className="flex flex-wrap justify-center gap-4">
                  <button
                    onClick={handleShare}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full transition-colors"
                  >
                    📱 Share Game
                  </button>
                  <button
                    onClick={handleCopyLink}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full transition-colors"
                  >
                    📋 Copy Link
                  </button>
                  <a
                    href="/game-embed"
                    target="_blank"
                    className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-full transition-colors inline-block"
                  >
                    🔗 Embed Version
                  </a>
                </div>
                <p className="text-blue-200 text-sm mt-4">
                  This game can be embedded in Notion, Discord, and other platforms that support oEmbed!
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-12">
            <p className="text-blue-200">
              Built with Next.js • Embeddable via oEmbed • 
              <a href="/" className="text-blue-300 hover:text-white ml-2 underline">
                Back to Currency Detector
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
