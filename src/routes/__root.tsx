import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import React from 'react'
import appCss from '../styles.css?url'

const organizationSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://vniexport.com/#organization',
      name: 'VNI Export & Import',
      legalName: 'VNI Export & Import',
      alternateName: [
        'VNI',
        'VNI Export',
        'VNI Import',
        'VNI Export and Import',
        'vniexport',
        'vniexport.com',
        'VNI Surat',
      ],
      url: 'https://vniexport.com/',
      logo: 'https://vniexport.com/images/vni-logo.png',
      image: 'https://vniexport.com/images/vni-logo.png',
      description:
        'VNI Export & Import is an APEDA & FSSAI certified Indian merchant exporter based in Surat, Gujarat. Supplier of premium pulses, non-GMO soyabean, 1121 & 1509 basmati rice, fresh fruits, vegetables, nuts, and authentic Indian spices to global importers worldwide.',
      telephone: '+91 95107 36285',
      email: 'info@vniexport.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Plot No. 18, Bhajiwala Estate-2, A.K. Road',
        addressLocality: 'Surat',
        addressRegion: 'Gujarat',
        postalCode: '395006',
        addressCountry: 'IN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: '21.2050',
        longitude: '72.8450',
      },
      areaServed: {
        '@type': 'AdministrativeArea',
        name: 'Worldwide',
      },
      knowsAbout: [
        'Agricultural Exports',
        'Indian Basmati Rice',
        'Pulses (Chana, Moong, Kidney Beans)',
        'Non-GMO Soyabean',
        'Fresh Fruits and Vegetables',
        'Indian Spices',
        'Incoterms (CIF, CIP, FOB, FCA, EXW)',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://vniexport.com/#website',
      url: 'https://vniexport.com/',
      name: 'VNI Export & Import',
      alternateName: [
        'VNI',
        'VNI Export',
        'VNI Import',
        'VNI Export and Import',
        'vniexport',
        'vniexport.com',
      ],
      description:
        'Official website of VNI Export & Import – Indian Fruits, Vegetables, Pulses, Soyabean, Rice & Spices Exporter from Surat, India.',
      publisher: {
        '@id': 'https://vniexport.com/#organization',
      },
      inLanguage: 'en',
    },
    {
      '@type': 'WholesaleStore',
      '@id': 'https://vniexport.com/#store',
      name: 'VNI Export & Import',
      url: 'https://vniexport.com/',
      telephone: '+91 95107 36285',
      email: 'info@vniexport.com',
      image: 'https://vniexport.com/images/warehouse.jpg',
      priceRange: '$$$',
      currenciesAccepted: 'USD, EUR, GBP, AED, INR',
      paymentAccepted: 'Letter of Credit, Telegraphic Transfer (TT), Advance Payment',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Plot No. 18, Bhajiwala Estate-2, A.K. Road',
        addressLocality: 'Surat',
        addressRegion: 'Gujarat',
        postalCode: '395006',
        addressCountry: 'IN',
      },
    },
  ],
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, viewport-fit=cover',
      },
      {
        title:
          'VNI Export & Import – Indian Fruits, Vegetables, Pulses, Soyabean, Rice & Spices | vniexport.com',
      },
      {
        name: 'description',
        content:
          'VNI Export & Import (vniexport.com) is an APEDA & FSSAI certified merchant exporter based in Surat, Gujarat, India. Supplying premium pulses (chana, moong, kidney beans), non-GMO soyabean, 1121 & 1509 basmati rice, fresh fruits, vegetables, nuts, and authentic Indian spices with CIF, CIP, FOB, and FCA delivery worldwide.',
      },
      {
        name: 'keywords',
        content:
          'VNI, VNI Export, VNI Import, VNI Export and Import, VNI Export & Import, vniexport, vniexport.com, vni surat, Indian agro commodities exporter, pulses exporter Surat Gujarat, soyabean exporter India, basmati rice 1121 exporter, pusa 1509 rice, traditional basmati rice, fresh onion exporter, pomegranate exporter, Indian spices exporter, APEDA registered exporter, FSSAI certified merchant exporter',
      },
      {
        name: 'author',
        content: 'VNI Export & Import',
      },
      {
        name: 'application-name',
        content: 'VNI Export & Import',
      },
      {
        name: 'apple-mobile-web-app-title',
        content: 'VNI Export',
      },
      {
        name: 'robots',
        content:
          'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      },
      {
        name: 'googlebot',
        content: 'index, follow, max-snippet:-1, max-image-preview:large',
      },
      {
        name: 'bingbot',
        content: 'index, follow, max-snippet:-1, max-image-preview:large',
      },
      {
        name: 'google-site-verification',
        content: 'fbd3e6',
      },
      // Open Graph Tags
      {
        property: 'og:site_name',
        content: 'VNI Export & Import',
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:url',
        content: 'https://vniexport.com/',
      },
      {
        property: 'og:title',
        content:
          'VNI Export & Import – Indian Fruits, Vegetables, Pulses, Soyabean, Rice & Spices',
      },
      {
        property: 'og:description',
        content:
          'Certified Indian merchant exporter based in Surat, Gujarat. Exporting pulses, non-GMO soyabean, basmati rice, vegetables, fruits, and spices globally with CIF, CIP, FOB, and FCA delivery.',
      },
      {
        property: 'og:image',
        content: 'https://vniexport.com/images/warehouse.jpg',
      },
      {
        property: 'og:image:width',
        content: '1200',
      },
      {
        property: 'og:image:height',
        content: '630',
      },
      {
        property: 'og:image:alt',
        content: 'VNI Export & Import Surat Warehouse and Packing Facility',
      },
      {
        property: 'og:locale',
        content: 'en_US',
      },
      // Twitter Card Tags
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:url',
        content: 'https://vniexport.com/',
      },
      {
        name: 'twitter:title',
        content:
          'VNI Export & Import – Indian Agro Commodities Exporter (Surat, India)',
      },
      {
        name: 'twitter:description',
        content:
          'Supplying fresh produce, pulses, soyabean, basmati rice, and spices worldwide from Surat, India.',
      },
      {
        name: 'twitter:image',
        content: 'https://vniexport.com/images/warehouse.jpg',
      },
      // Geo / Local SEO
      {
        name: 'geo.region',
        content: 'IN-GJ',
      },
      {
        name: 'geo.placename',
        content: 'Surat, Gujarat, India',
      },
      {
        name: 'geo.position',
        content: '21.2050;72.8450',
      },
      {
        name: 'ICBM',
        content: '21.2050, 72.8450',
      },
      {
        name: 'theme-color',
        content: '#12263f',
      },
    ],
    links: [
      {
        rel: 'canonical',
        href: 'https://vniexport.com/',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '48x48',
        href: '/favicon-48x48.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        href: '/favicon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '96x96',
        href: '/favicon-96x96.png',
      },
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: '/favicon.svg',
      },
      {
        rel: 'icon',
        href: '/favicon.ico',
        sizes: 'any',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png',
      },
      {
        rel: 'shortcut icon',
        href: '/favicon.ico',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
      {
        rel: 'manifest',
        href: '/site.webmanifest',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400..700;1,9..40,400..700&family=Sora:wght@500;600;700;800&display=swap',
      },
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}

