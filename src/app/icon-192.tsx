import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 192,
  height: 192,
}
export const contentType = 'image/png'

export default function Icon192() {
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
          borderRadius: '24px',
          position: 'relative',
        }}
      >
        {/* Background glow effects */}
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            right: '10px',
            bottom: '10px',
            background: 'radial-gradient(circle at 40% 40%, rgba(236, 72, 153, 0.4) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.3) 0%, transparent 60%)',
            borderRadius: '20px',
          }}
        />
        
        {/* AR Letters with enhanced styling */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '96px',
            fontWeight: 'bold',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            letterSpacing: '-6px',
            textShadow: '0 4px 8px rgba(0,0,0,0.8), 0 0 20px rgba(236, 72, 153, 0.5)',
            zIndex: 1,
          }}
        >
          <span style={{ 
            color: '#ec4899',
            background: 'linear-gradient(135deg, #ec4899 0%, #f97316 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>A</span>
          <span style={{ color: '#ffffff' }}>R</span>
        </div>
        
        {/* Small decorative dots */}
        <div
          style={{
            position: 'absolute',
            top: '20px',
            right: '30px',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#ec4899',
            opacity: 0.8,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '30px',
            left: '25px',
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            background: '#9333ea',
            opacity: 0.6,
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  )
}