import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

export default function Icon() {
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
          borderRadius: '6px',
          position: 'relative',
        }}
      >
        {/* Pink accent glow */}
        <div
          style={{
            position: 'absolute',
            top: '2px',
            left: '2px',
            right: '2px',
            bottom: '2px',
            background: 'radial-gradient(circle at center, rgba(236, 72, 153, 0.3) 0%, transparent 70%)',
            borderRadius: '4px',
          }}
        />
        
        {/* AR Letters */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#ffffff',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            letterSpacing: '-1px',
            textShadow: '0 1px 2px rgba(0,0,0,0.5)',
            zIndex: 1,
          }}
        >
          <span style={{ color: '#ec4899' }}>A</span>
          <span style={{ color: '#ffffff' }}>R</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}