export default function Debug() {
  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Social Media Meta Debug</h1>
      <h2>Open Graph Tags:</h2>
      <pre>{`
<meta property="og:title" content="ArtRiot - Where Creativity Rebels Against the Ordinary" />
<meta property="og:description" content="Join our community of artists, makers, and dreamers who believe art should disrupt, inspire, and unite." />
<meta property="og:image" content="https://artriot.com/Art_Riot_Horizontal.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:type" content="image/png" />
<meta property="og:url" content="https://artriot.com" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="ArtRiot" />
      `}</pre>
      
      <h2>Twitter Card Tags:</h2>
      <pre>{`
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="ArtRiot - Where Creativity Rebels Against the Ordinary" />
<meta name="twitter:description" content="Experience transformative art meditation events combining creativity, movement, and healing." />
<meta name="twitter:image" content="https://artriot.com/Art_Riot_Horizontal.png" />
<meta name="twitter:creator" content="@artriot" />
<meta name="twitter:site" content="@artriot" />
      `}</pre>

      <h2>Test Links:</h2>
      <ul>
        <li><a href="https://developers.facebook.com/tools/debug/" target="_blank">Facebook Debugger</a></li>
        <li><a href="https://cards-dev.twitter.com/validator" target="_blank">Twitter Card Validator</a></li>
        <li><a href="https://www.linkedin.com/post-inspector/" target="_blank">LinkedIn Post Inspector</a></li>
      </ul>

      <h2>Image URLs to test:</h2>
      <ul>
        <li><a href="https://artriot.com/Art_Riot_Horizontal.png" target="_blank">Main OG Image</a></li>
        <li><a href="https://artriot.com/opengraph-image" target="_blank">Generated OG Image</a></li>
        <li><a href="https://artriot.com/in-person-events/opengraph-image" target="_blank">Events OG Image</a></li>
      </ul>
    </div>
  );
}