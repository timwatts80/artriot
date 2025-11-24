import { ImageResponse } from 'next/og'
 
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
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d1b69 50%, #1a1a1a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          fontFamily: 'system-ui',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background Pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(139, 69, 196, 0.2) 0%, transparent 50%)',
          }}
        />
        
        {/* Main Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '60px',
            zIndex: 1,
          }}
        >
          {/* Logo/Brand */}
          <div
            style={{
              fontSize: '96px',
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #f97316, #8b5cf6, #06b6d4)',
              backgroundClip: 'text',
              color: 'transparent',
              marginBottom: '30px',
              textShadow: '0 0 20px rgba(249, 115, 22, 0.3)',
            }}
          >
            ArtRiot
          </div>
          
          {/* Tagline */}
          <div
            style={{
              fontSize: '42px',
              fontWeight: '600',
              color: 'white',
              marginBottom: '20px',
              lineHeight: 1.2,
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
            }}
          >
            Where Creativity Rebels Against the Ordinary
          </div>
          
          {/* Description */}
          <div
            style={{
              fontSize: '28px',
              color: 'rgba(255, 255, 255, 0.9)',
              lineHeight: 1.3,
              maxWidth: '900px',
              textShadow: '0 1px 5px rgba(0, 0, 0, 0.3)',
            }}
          >
            Immersive art experiences • Creative workshops • Transformative events
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(249, 115, 22, 0.3) 0%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  )
}