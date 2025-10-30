import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'ArtRiot - Where Creativity Rebels Against the Ordinary'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          fontFamily: 'system-ui',
          position: 'relative',
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 30%, rgba(236, 72, 153, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(236, 72, 153, 0.2) 0%, transparent 50%)',
          }}
        />
        
        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            zIndex: 1,
            padding: '40px',
          }}
        >
          <h1
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              color: 'white',
              margin: '0 0 20px 0',
              letterSpacing: '-2px',
            }}
          >
            ArtRiot
          </h1>
          <p
            style={{
              fontSize: '36px',
              color: '#e5e7eb',
              margin: '0 0 20px 0',
              fontWeight: '300',
              maxWidth: '800px',
              lineHeight: '1.2',
            }}
          >
            Where Creativity Rebels Against the Ordinary
          </p>
          <p
            style={{
              fontSize: '24px',
              color: '#ec4899',
              margin: '0',
              fontWeight: '500',
            }}
          >
            Art Meditation • Workshops • Creative Community
          </p>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}