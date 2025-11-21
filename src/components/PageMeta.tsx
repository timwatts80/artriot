import { useEffect } from 'react';

interface PageMetaProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

export default function PageMeta({
  title = "ArtRiot - Where Creativity Rebels Against the Ordinary",
  description = "Join our community of artists, makers, and dreamers who believe art should disrupt, inspire, and unite.",
  image = "/Art_Riot_Banner.png",
  url = "https://artriot.com",
  type = "website"
}: PageMetaProps) {
  const fullTitle = title.includes('ArtRiot') ? title : `${title} | ArtRiot`;
  const imageUrl = image.startsWith('http') ? image : `https://artriot.com${image}`;

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    // Function to update or create meta tag
    const updateMeta = (property: string, content: string, isProperty = true) => {
      const selector = isProperty ? `meta[property="${property}"]` : `meta[name="${property}"]`;
      let meta = document.querySelector(selector);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(isProperty ? 'property' : 'name', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Open Graph Meta Tags
    updateMeta('og:site_name', 'ArtRiot');
    updateMeta('og:title', fullTitle);
    updateMeta('og:description', description);
    updateMeta('og:type', type);
    updateMeta('og:url', url);
    updateMeta('og:image', imageUrl);
    updateMeta('og:image:width', '1641');
    updateMeta('og:image:height', '857');
    updateMeta('og:image:alt', title);
    updateMeta('og:locale', 'en_US');
    updateMeta('fb:app_id', '123456789012345');

    // Twitter Card Meta Tags
    updateMeta('twitter:card', 'summary_large_image', false);
    updateMeta('twitter:site', '@artriot', false);
    updateMeta('twitter:creator', '@artriot', false);
    updateMeta('twitter:title', fullTitle, false);
    updateMeta('twitter:description', description, false);
    updateMeta('twitter:image', imageUrl, false);
    updateMeta('twitter:image:src', imageUrl, false);
    updateMeta('twitter:image:alt', title, false);

    // Additional Meta Tags for messaging apps
    updateMeta('image', imageUrl, false);
    updateMeta('theme-color', '#ec4899', false);
    updateMeta('robots', 'index, follow', false);
    updateMeta('googlebot', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1', false);
    updateMeta('author', 'ArtRiot', false);

    // Schema.org structured data properties
    const updateItemprop = (property: string, content: string) => {
      let meta = document.querySelector(`meta[itemprop="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('itemprop', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    updateItemprop('name', fullTitle);
    updateItemprop('description', description);
    updateItemprop('image', imageUrl);

  }, [fullTitle, description, imageUrl, url, type, title]);

  return null; // This component doesn't render anything
}