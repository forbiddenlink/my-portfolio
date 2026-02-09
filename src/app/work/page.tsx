import { galaxies } from '@/lib/galaxyData'
import { formatDateRange, cn } from '@/lib/utils'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { SplitWords } from '@/components/ui/SplitText'
import { StarryBackground } from '@/components/ui/StarryBackground'
import { TiltCard } from '@/components/ui/TiltCard'
import { RandomProjectButton } from '@/components/ui/RandomProjectButton'

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

// Get all projects for random selection
const allProjects = galaxies.flatMap(g => g.projects)

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
        <header className="mb-24">
          <ScrollReveal direction="up" delay={0.2}>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <SplitWords delay={0.3}>All Work</SplitWords>
            </h1>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.4}>
            <p className="text-lg text-white/50 max-w-2xl leading-relaxed">
              40+ projects spanning enterprise applications, AI integration, full-stack development,
              and creative experiments.
            </p>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.6}>
          <nav className="mt-8 flex flex-wrap gap-3" aria-label="Page navigation">
            <Link
              href="/"
              className="px-5 py-3 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 rounded-lg transition-all duration-200 text-white/60 hover:text-white text-sm"
            >
              ← 3D View
            </Link>
            <Link
              href="/about"
              className="px-5 py-3 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 rounded-lg transition-all duration-200 text-white/60 hover:text-white text-sm"
            >
              About
            </Link>
            <RandomProjectButton projects={allProjects} />
          </nav>
          </ScrollReveal>
        </header>

        {/* Projects by Galaxy - Bento Grid */}
        {galaxies.map((galaxy, galaxyIdx) => {
          const featured = galaxy.projects.filter(p => p.featured)
          const regular = galaxy.projects.filter(p => !p.featured)

          return (
            <section key={galaxy.id} className="mb-20">
              <ScrollReveal direction="up" delay={galaxyIdx * 0.1}>
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: galaxy.color }}
                    aria-hidden="true"
                  />
                  <h2 className="text-lg font-medium text-white/80">{galaxy.name}</h2>
                </div>
                <p className="text-white/40 mb-6 text-sm">{galaxy.description}</p>
              </ScrollReveal>

              {/* Bento Grid */}
              <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {/* Featured projects span 2 columns */}
                {featured.map((project, idx) => (
                  <TiltCard key={project.id} className={cn("h-full", idx === 0 && featured.length > 0 && "md:col-span-2")}>
                    <Link
                      href={`/work/${project.id}`}
                      className={cn(
                        'group block h-full rounded-xl border transition-all duration-200',
                        'border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20',
                        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/30',
                        idx === 0 && featured.length > 0 ? 'p-8' : 'p-5'
                      )}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className={cn(
                          "font-semibold group-hover:text-white transition-colors text-white/90",
                          idx === 0 && featured.length > 0 ? "text-2xl" : "text-lg"
                        )}>
                          {project.title}
                        </h3>
                        <span className="px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider bg-white/5 text-white/40 rounded">
                          Featured
                        </span>
                      </div>

                      <p className={cn(
                        "text-white/40 mb-4 line-clamp-2 leading-relaxed group-hover:text-white/60 transition-colors",
                        idx === 0 && featured.length > 0 ? "text-base" : "text-sm"
                      )}>
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.tags.slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-[10px] rounded bg-white/5 text-white/30"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="text-[11px] text-white/30 font-mono mt-auto pt-3 border-t border-white/5">
                        {formatDateRange(project.dateRange)}
                      </div>
                    </Link>
                  </TiltCard>
                ))}

                {/* Regular projects */}
                {regular.map((project) => (
                  <TiltCard key={project.id} className="h-full">
                    <Link
                      href={`/work/${project.id}`}
                      className={cn(
                        'group block h-full rounded-xl border transition-all duration-200 p-5',
                        'border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20',
                        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/30'
                      )}
                    >
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-white transition-colors text-white/90">
                        {project.title}
                      </h3>

                      <p className="text-sm text-white/40 mb-4 line-clamp-2 leading-relaxed group-hover:text-white/60 transition-colors">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-[10px] rounded bg-white/5 text-white/30"
                          >
                            {tag}
                          </span>
                        ))}
                        {project.tags.length > 3 && (
                          <span className="text-[10px] text-white/20">
                            +{project.tags.length - 3}
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-white/30 font-mono mt-auto pt-3 border-t border-white/5">
                        {formatDateRange(project.dateRange)}
                      </div>
                    </Link>
                  </TiltCard>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </main>
  )
}
