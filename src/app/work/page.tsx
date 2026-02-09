import { galaxies } from '@/lib/galaxyData'
import { formatDateRange, cn } from '@/lib/utils'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { SplitWords } from '@/components/ui/SplitText'
import { StarryBackground } from '@/components/ui/StarryBackground'
import { TiltCard } from '@/components/ui/TiltCard'

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

      <div id="work-content" className="max-w-7xl w-full mx-auto">
        {/* Header */}
        <header className="mb-32">
          <ScrollReveal direction="up" delay={0.2}>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <SplitWords delay={0.3}>All Work</SplitWords>
            </h1>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.4}>
            <p className="text-xl text-white/70 max-w-2xl leading-relaxed">
              40+ projects spanning enterprise applications, AI integration, full-stack development,
              and creative experiments — backed by 1,200+ automated tests.
            </p>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.6}>
          <nav className="mt-8 flex flex-wrap gap-4 md:gap-6" aria-label="Page navigation">
            <Link
              href="/"
              className="px-6 py-4 md:px-8 md:py-5 bg-white/15 border border-white/30 hover:bg-white/25 hover:border-white/40 rounded-xl transition-all duration-300 text-white/80 hover:text-white hover:scale-105 backdrop-blur-xl shadow-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
            >
              ← Back to 3D view
            </Link>
            <Link
              href="/about"
              className="px-6 py-4 md:px-8 md:py-5 bg-white/15 border border-white/30 hover:bg-white/25 hover:border-white/40 rounded-xl transition-all duration-300 text-white/80 hover:text-white hover:scale-105 backdrop-blur-xl shadow-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
            >
              About Me →
            </Link>
          </nav>
          </ScrollReveal>
        </header>

        {/* Projects by Galaxy */}
        {galaxies.map((galaxy, galaxyIdx) => (
          <section key={galaxy.id} className="mb-24">
            <ScrollReveal direction="up" delay={galaxyIdx * 0.15}>
            <div className="flex items-center gap-3 mb-6 px-5 py-4 bg-white/15 border border-white/30 backdrop-blur-xl rounded-xl inline-flex">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: galaxy.color, boxShadow: `0 0 15px ${galaxy.color}` }}
                aria-hidden="true"
              />
              <h2 className="text-2xl font-semibold tracking-wide">{galaxy.name}</h2>
            </div>
            <p className="text-white/60 mb-8 ml-1 text-lg">{galaxy.description}</p>
            </ScrollReveal>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {galaxy.projects.map((project) => (
                <TiltCard key={project.id} className="h-full">
                  <Link
                    href={`/work/${project.id}`}
                    className={cn(
                      'group block h-full rounded-xl border transition-all duration-300 p-6',
                      'hover:shadow-2xl hover:scale-[1.02]',
                      'border-white/30 bg-white/15 hover:bg-white/25 hover:border-white/40 backdrop-blur-xl',
                      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500/50'
                    )}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold group-hover:text-purple-300 transition-colors">
                        {project.title}
                      </h3>
                      {project.featured && (
                        <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 rounded border border-purple-500/30">
                          Featured
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-white/60 mb-4 line-clamp-3 leading-relaxed group-hover:text-white/80 transition-colors">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-[10px] uppercase tracking-wider rounded-md bg-white/5 border border-white/5 text-white/50 group-hover:border-white/20 transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 3 && (
                        <span className="px-2 py-1 text-[10px] text-white/40">
                          +{project.tags.length - 3}
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-white/40 font-mono mt-auto pt-2 border-t border-white/5">
                      {formatDateRange(project.dateRange)}
                    </div>
                  </Link>
                </TiltCard>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}
