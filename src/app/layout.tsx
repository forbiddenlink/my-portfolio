import type { Metadata } from 'next'
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@/components/Analytics'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { NebulaCursor } from '@/components/ui/NebulaCursor'
import { WarpTransition } from '@/components/ui/WarpTransition'
import { StarryBackground } from '@/components/ui/StarryBackground' // Imported as per instruction
import { SmoothScroll } from '@/components/ui/SmoothScroll'
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
  title: 'Elizabeth Stein | Full-Stack Developer & AI Integration Specialist',
  description: 'Full-stack development, AI integration, design systems, and enterprise-scale applications. Explore 40+ projects across 6 galaxies with 1,200+ automated tests.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://elizabethstein.com'),
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  keywords: [
    'Full-Stack Developer',
    'AI Integration',
    'React',
    'Next.js',
    'TypeScript',
    'Three.js',
    'Claude AI',
    'OpenAI GPT-4',
    'Design Systems',
    'Enterprise Applications',
    'Web Development',
    'Supabase',
    'Portfolio',
  ],
  authors: [{ name: 'Elizabeth Stein' }],
  creator: 'Elizabeth Stein',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Elizabeth Stein Portfolio',
    title: 'Elizabeth Stein | Full-Stack Developer & AI Integration Specialist',
    description: 'Full-stack development, AI integration, design systems, and enterprise-scale applications. Explore 40+ projects across 6 galaxies with 1,200+ automated tests.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Elizabeth Stein | Full-Stack Developer & AI Integration Specialist',
    description: 'Full-stack development, AI integration, design systems, and enterprise-scale applications.',
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
  name: 'Elizabeth Stein',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://elizabethstein.com',
  jobTitle: 'Full-Stack Developer & AI Integration Specialist',
  description: 'Full-stack developer specializing in AI integration, design systems, and enterprise-scale applications.',
  knowsAbout: [
    'Full-Stack Development',
    'AI Integration',
    'Claude AI',
    'OpenAI GPT-4',
    'Stable Diffusion',
    'React',
    'Next.js',
    'TypeScript',
    'Three.js',
    'Design Systems',
    'Enterprise Applications',
    'Supabase',
    'PostgreSQL',
  ],
  sameAs: [
    'https://github.com/forbiddenlink',
    'https://linkedin.com/in/imkindageeky',
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
