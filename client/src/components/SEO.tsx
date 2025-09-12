import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  structuredData?: any;
}

const SEO = ({
  title = 'SAK Constructions - Premium Building Plans & Architectural Designs',
  description = 'Discover premium building plans for homeowners and developers. From cozy cottages to luxury villas, we have the perfect design for your project. Professional architectural services in Ghana.',
  keywords = 'building plans, architectural designs, house plans, construction, Ghana, villas, bungalows, townhouses, SAK constructions',
  image = '/logo.png',
  url = 'https://www.sakconstructionsgh.com',
  type = 'website',
  structuredData
}: SEOProps) => {
  const fullTitle = title.includes('SAK Constructions') ? title : `${title} | SAK Constructions`;
  const fullImage = image.startsWith('http') ? image : `https://www.sakconstructionsgh.com${image}`;
  const fullUrl = url.startsWith('http') ? url : `https://www.sakconstructionsgh.com${url}`;

  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "SAK Constructions",
    "description": "Premium building plans and architectural designs for homeowners and developers in Ghana",
    "url": "https://www.sakconstructionsgh.com",
    "logo": "https://www.sakconstructionsgh.com/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+233-XXX-XXXX",
      "contactType": "customer service",
      "areaServed": "GH",
      "availableLanguage": "English"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "GH",
      "addressRegion": "Greater Accra"
    },
    "sameAs": [
      "https://www.facebook.com/sakconstructions",
      "https://www.instagram.com/sakconstructions",
      "https://www.linkedin.com/company/sakconstructions"
    ]
  };

  const mergedStructuredData = structuredData ? { ...defaultStructuredData, ...structuredData } : defaultStructuredData;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="SAK Constructions" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content="SAK Constructions" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={fullImage} />
      <meta property="twitter:site" content="@sakconstructions" />
      <meta property="twitter:creator" content="@sakconstructions" />

      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#ea580c" />
      <meta name="msapplication-TileColor" content="#ea580c" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="SAK Constructions" />

      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />

      {/* Favicon */}
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(mergedStructuredData)}
      </script>

      {/* Additional SEO Scripts */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "SAK Constructions",
          "url": "https://www.sakconstructionsgh.com",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://www.sakconstructionsgh.com/plans?search={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        })}
      </script>
    </Helmet>
  );
};

export default SEO;
