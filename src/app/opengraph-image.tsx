import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import { join } from 'path'

export const runtime = 'nodejs'
 
export const alt = 'ArtRiot - Where Creativity Rebels Against the Ordinary'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'
 
export default async function Image() {
  // Read the logo file from the public directory
  const logoPath = join(process.cwd(), 'public', 'Art_Riot_Banner.png')
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
        {/* Art Riot Banner */}
        <img
          src={logoBase64}
          alt="Art Riot Banner"
          width="1200"
          height="628"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  )
}