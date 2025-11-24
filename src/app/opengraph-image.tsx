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
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          fontFamily: 'system-ui',
        }}
      >
        {/* Art Riot Logo */}
        <img
          src="https://artriot.com/Art_Riot_Horizontal.png"
          alt="Art Riot Logo"
          style={{
            maxWidth: '600px',
            maxHeight: '300px',
            objectFit: 'contain',
          }}
        />
        
        {/* Tagline */}
        <div
          style={{
            fontSize: '32px',
            fontWeight: '600',
            color: '#1a1a1a',
            marginTop: '40px',
            textAlign: 'center',
            maxWidth: '800px',
            lineHeight: 1.3,
          }}
        >
          Where Creativity Rebels Against the Ordinary
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}