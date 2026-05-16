import type { Metadata, Viewport } from 'next'
import { Poppins, Inter } from 'next/font/google'
import '../styles/globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://aethlacare.qa'),
  title: {
    default: 'Aethla Care | Premium Home Healthcare & Wellness in Qatar',
    template: '%s | Aethla Care Qatar',
  },
  description:
    'Aethla Care delivers compassionate, technology-driven home healthcare services in Qatar — elderly care, disability support, maternity & newborn care, telehealth, and wellness services across Doha, Lusail, Al Wakrah & Al Rayyan.',
  keywords: [
    'home healthcare Qatar',
    'home care Doha',
    'elderly care Qatar',
    'disability support Qatar',
    'newborn care Doha',
    'maternity care Qatar',
    'telehealth Qatar',
    'wellness services Doha',
    'home caregiver Qatar',
    'senior care Doha',
    'postpartum care Qatar',
    'baby nurse Doha',
    'رعاية منزلية قطر',
  ],
  authors: [{ name: 'Aethla Care', url: 'https://aethlacare.qa' }],
  creator: 'Aethla Care',
  publisher: 'Aethla Care',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_QA',
    url: 'https://aethlacare.qa',
    siteName: 'Aethla Care',
    title: 'Aethla Care | Premium Home Healthcare & Wellness in Qatar',
    description: 'Compassionate, technology-driven home healthcare for families across Qatar.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Aethla Care - Premium Home Healthcare Qatar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aethla Care | Premium Home Healthcare Qatar',
    description: 'Premium home healthcare services across Qatar.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://aethlacare.qa',
    languages: {
      'en-QA': 'https://aethlacare.qa',
      'ar-QA': 'https://aethlacare.qa/ar',
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1B6B8A',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'MedicalBusiness',
                  '@id': 'https://aethlacare.qa/#business',
                  name: 'Aethla Care',
                  description: 'Premium Home Healthcare & Wellness Services in Qatar',
                  url: 'https://aethlacare.qa',
                  logo: 'https://aethlacare.qa/logo.png',
                  image: 'https://aethlacare.qa/og-image.jpg',
                  telephone: '+974-4000-0000',
                  email: 'care@aethlacare.qa',
                  address: {
                    '@type': 'PostalAddress',
                    streetAddress: 'West Bay',
                    addressLocality: 'Doha',
                    addressCountry: 'QA',
                  },
                  geo: {
                    '@type': 'GeoCoordinates',
                    latitude: '25.3548',
                    longitude: '51.1839',
                  },
                  openingHoursSpecification: {
                    '@type': 'OpeningHoursSpecification',
                    dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
                    opens: '08:00',
                    closes: '18:00',
                  },
                  areaServed: ['Doha', 'Lusail', 'Al Wakrah', 'Al Rayyan'],
                  priceRange: '$$',
                  aggregateRating: {
                    '@type': 'AggregateRating',
                    ratingValue: '4.9',
                    reviewCount: '847',
                  },
                },
                {
                  '@type': 'WebSite',
                  '@id': 'https://aethlacare.qa/#website',
                  url: 'https://aethlacare.qa',
                  name: 'Aethla Care',
                  potentialAction: {
                    '@type': 'SearchAction',
                    target: { '@type': 'EntryPoint', urlTemplate: 'https://aethlacare.qa/blog?q={search_term_string}' },
                    'query-input': 'required name=search_term_string',
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body className="font-inter antialiased">{children}</body>
    </html>
  )
}
