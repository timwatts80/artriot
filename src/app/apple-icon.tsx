import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'

export default function AppleIcon() {
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
          borderRadius: '36px', // Rounded corners for iOS
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
            background: 'radial-gradient(circle at 30% 30%, rgba(236, 72, 153, 0.4) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(236, 72, 153, 0.3) 0%, transparent 50%)',
            borderRadius: '36px',
          }}
        />
        
        {/* Main AR Logo */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '72px',
              fontWeight: 'bold',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              letterSpacing: '-4px',
              textShadow: '0 2px 4px rgba(0,0,0,0.8)',
              marginBottom: '8px',
            }}
          >
            <span style={{ color: '#ec4899' }}>A</span>
            <span style={{ color: '#ffffff' }}>R</span>
          </div>
          <div
            style={{
              fontSize: '16px',
              color: '#ec4899',
              fontWeight: '600',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              textShadow: '0 1px 2px rgba(0,0,0,0.8)',
            }}
          >
            Riot
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}