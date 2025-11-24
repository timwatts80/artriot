import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import { join } from 'path'
 
export const alt = 'ArtRiot - Where Creativity Rebels Against the Ordinary'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'
 
export default async function Image() {
  // Read the logo file from the public directory
  const logoPath = join(process.cwd(), 'public', 'Art_Riot_Horizontal.png')
  const logoBuffer = readFileSync(logoPath)
  const logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`

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
          src={logoBase64}
          alt="Art Riot Logo"
          width="600"
          height="445"
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