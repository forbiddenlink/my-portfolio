'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ExternalLink, Github, Search, X } from 'lucide-react'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { SplitWords } from '@/components/ui/SplitText'
import { TiltCard } from '@/components/ui/TiltCard'
import { RandomProjectButton } from '@/components/ui/RandomProjectButton'
import { GalaxyFilter } from '@/components/ui/GalaxyFilter'
import { formatDateRange, cn } from '@/lib/utils'
import type { Galaxy, Project } from '@/lib/types'

function ProjectLinks({ project }: { project: Project }) {
  if (!project.links) return null
  const hasLive = !!project.links.live
  const hasGithub = !!project.links.github
  if (!hasLive && !hasGithub) return null

  return (
    <div className="flex items-center gap-2 text-white/30">
      {hasLive && (
        <span className="flex items-center gap-1 text-[10px]" title="Live demo available">
          <ExternalLink className="w-3 h-3" />
          <span className="sr-only">Live demo</span>
        </span>
      )}
      {hasGithub && (
        <span className="flex items-center gap-1 text-[10px]" title="Source code available">
          <Github className="w-3 h-3" />
          <span className="sr-only">Source code</span>
        </span>
      )}
    </div>
  )
}

interface WorkPageClientProps {
  galaxies: Galaxy[]
}

export function WorkPageClient({ galaxies }: WorkPageClientProps) {
  const [selectedGalaxy, setSelectedGalaxy] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const allProjects = useMemo(() => galaxies.flatMap(g => g.projects), [galaxies])

  const filteredGalaxies = useMemo(() => {
    let filtered = selectedGalaxy
      ? galaxies.filter(g => g.id === selectedGalaxy)
      : galaxies

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.map(galaxy => ({
        ...galaxy,
        projects: galaxy.projects.filter(p =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.tags.some(tag => tag.toLowerCase().includes(query))
        )
      })).filter(g => g.projects.length > 0)
    }

    return filtered
  }, [galaxies, selectedGalaxy, searchQuery])

  const projectCount = useMemo(() => {
    return filteredGalaxies.reduce((acc, g) => acc + g.projects.length, 0)
  }, [filteredGalaxies])

  return (
    <div id="work-content" className="max-w-7xl w-full mx-auto">
      {/* Header */}
      <header className="mb-16">
        <ScrollReveal direction="up" delay={0.2}>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <SplitWords delay={0.3}>All Work</SplitWords>
          </h1>
        </ScrollReveal>
        <ScrollReveal direction="up" delay={0.4}>
          <p className="text-lg text-white/50 max-w-2xl leading-relaxed">
            {projectCount} projects spanning enterprise applications, AI integration, full-stack development,
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

      {/* Search and Filter */}
      <ScrollReveal direction="up" delay={0.7}>
        <div className="mb-12 space-y-4">
          {/* Search Input */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search projects, technologies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all text-sm"
              aria-label="Search projects"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Galaxy Filter */}
          <GalaxyFilter
            galaxies={galaxies.map(g => ({ id: g.id, name: g.name, color: g.color }))}
            selectedGalaxy={selectedGalaxy}
            onFilterChange={setSelectedGalaxy}
          />
        </div>
      </ScrollReveal>

      {/* No Results Message */}
      {filteredGalaxies.length === 0 && (
        <div className="text-center py-16">
          <p className="text-white/50 text-lg mb-4">No projects found for "{searchQuery}"</p>
          <button
            onClick={() => {
              setSearchQuery('')
              setSelectedGalaxy(null)
            }}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white/70 hover:bg-white/15 hover:text-white transition-all text-sm"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Projects by Galaxy - Bento Grid */}
      {filteredGalaxies.map((galaxy, galaxyIdx) => {
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
                <span className="text-sm text-white/30">({galaxy.projects.length})</span>
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

                    <div className="flex items-center justify-between text-[11px] text-white/30 font-mono mt-auto pt-3 border-t border-white/5">
                      <span>{formatDateRange(project.dateRange)}</span>
                      <ProjectLinks project={project} />
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

                    <div className="flex items-center justify-between text-[11px] text-white/30 font-mono mt-auto pt-3 border-t border-white/5">
                      <span>{formatDateRange(project.dateRange)}</span>
                      <ProjectLinks project={project} />
                    </div>
                  </Link>
                </TiltCard>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
