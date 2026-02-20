import type { Metadata } from 'next'
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@/components/Analytics'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { NebulaCursor } from '@/components/ui/NebulaCursor'
import { WarpTransition } from '@/components/ui/WarpTransition'
// import { StarryBackground } from '@/components/ui/StarryBackground'
import { SmoothScroll } from '@/components/ui/SmoothScroll'
import { SITE, CONTACT } from '@/lib/constants'
import '@/app/globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: SITE.fullTitle,
  description: SITE.description,
  metadataBase: new URL(SITE.url),
  // icons: {
  //   icon: '/favicon.svg',
  //   shortcut: '/favicon.svg',
  //   apple: '/favicon.svg',
  // },
  keywords: [...SITE.keywords],
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: `${SITE.name} Portfolio`,
    title: SITE.fullTitle,
    description: SITE.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE.fullTitle,
    description: SITE.shortDescription,
  },
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
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: SITE.name,
  url: SITE.url,
  jobTitle: SITE.title,
  description: SITE.shortDescription,
  knowsAbout: [...SITE.knowsAbout],
  sameAs: [
    CONTACT.github,
    CONTACT.linkedin,
    'https://imkindageeky.com',
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={` bg-black text-white antialiased ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
        <SmoothScroll />
        <WarpTransition />
        <NebulaCursor />
        <Analytics />
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  )
}
