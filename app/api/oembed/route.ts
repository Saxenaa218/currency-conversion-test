import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get('url');
  const maxwidth = searchParams.get('maxwidth');
  const maxheight = searchParams.get('maxheight');

  // Define the expected game URL
  const gameUrl = 'https://currency-conversion-test.onrender.com/game';
  
  // Check if the requested URL matches our game
  if (url === gameUrl) {
    // Calculate dimensions based on maxwidth/maxheight if provided
    let width = 640;
    let height = 360;
    
    if (maxwidth) {
      const requestedWidth = parseInt(maxwidth);
      if (requestedWidth > 0 && requestedWidth < width) {
        width = requestedWidth;
        height = Math.round((requestedWidth / 640) * 360);
      }
    }
    
    if (maxheight) {
      const requestedHeight = parseInt(maxheight);
      if (requestedHeight > 0 && requestedHeight < height) {
        height = requestedHeight;
        width = Math.round((requestedHeight / 360) * 640);
      }
    }

    const oembedResponse = {
      version: "1.0",
      type: "rich",
      provider_name: "Currency Converter Game",
      provider_url: "https://currency-conversion-test.onrender.com",
      title: "Interactive Currency Converter Game",
      author_name: "Currency Converter",
      author_url: "https://currency-conversion-test.onrender.com",
      html: `<iframe src="https://currency-conversion-test.onrender.com/game-embed" width="${width}" height="${height}" frameborder="0" allow="autoplay; fullscreen; gamepad; keyboard-map" allowfullscreen></iframe>`,
      width: width,
      height: height,
      thumbnail_url: "https://via.placeholder.com/640x360/667eea/ffffff?text=Currency+Quiz+Game",
      thumbnail_width: 640,
      thumbnail_height: 360
    };

    return NextResponse.json(oembedResponse, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } else {
    return NextResponse.json(
      { error: 'URL not found' },
      { 
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      }
    );
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
