import { galaxies } from '@/lib/galaxyData'
import type { Metadata } from 'next'
import { StarryBackground } from '@/components/ui/StarryBackground'
import { WorkPageClient } from '@/components/work/WorkPageClient'

export const metadata: Metadata = {
  title: 'Work | Elizabeth Stein',
  description: 'Full-stack development, AI integration, and design systems work across 40+ projects with 1,200+ automated tests.',
  alternates: {
    canonical: '/work',
  },
  openGraph: {
    title: 'Work | Elizabeth Stein',
    description: 'Full-stack development, AI integration, and design systems work across 40+ projects with 1,200+ automated tests.',
    url: '/work',
  },
}

export default function WorkPage() {
  return (
    <main className="min-h-screen overflow-auto px-6 py-28 relative flex justify-center">
      {/* Skip Link for Accessibility */}
      <a href="#work-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-lg focus:font-medium">
        Skip to projects
      </a>
      <StarryBackground />
      <WorkPageClient galaxies={galaxies} />
    </main>
  )
}
