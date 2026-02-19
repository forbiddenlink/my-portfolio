'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ExternalLink, Github, Search, X } from 'lucide-react'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { SplitWords } from '@/components/ui/SplitText'
import { TiltCard } from '@/components/ui/TiltCard'
import { RandomProjectButton } from '@/components/ui/RandomProjectButton'
import { GalaxyFilter } from '@/components/ui/GalaxyFilter'
import { formatDateRange, cn } from '@/lib/utils'
import type { Galaxy, Project } from '@/lib/types'

// Stagger animation variants for project cards
const cardVariants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      delay: i * 0.06,
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
}

function ProjectLinks({ project }: { project: Project }) {
  if (!project.links) return null
  const hasLive = !!project.links.live
  const hasGithub = !!project.links.github
  if (!hasLive && !hasGithub) return null

  return (
    <div className="flex items-center gap-2">
      {hasLive && (
        <span
          className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/10 text-success text-[10px] border border-success/20 group-hover:bg-success/20 group-hover:border-success/30 transition-all"
          title="Live demo available"
        >
          <ExternalLink className="w-3 h-3" />
          <span className="hidden sm:inline">Live demo</span>
        </span>
      )}
      {hasGithub && (
        <span
          className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent-purple/10 text-accent-purple text-[10px] border border-accent-purple/20 group-hover:bg-accent-purple/20 group-hover:border-accent-purple/30 transition-all"
          title="Source code available"
        >
          <Github className="w-3 h-3" />
          <span className="hidden sm:inline">Source code</span>
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
          <p className="text-lg text-white/[var(--text-opacity-tertiary)] max-w-2xl leading-relaxed">
            {projectCount} projects spanning enterprise applications, AI integration, full-stack development,
            and creative experiments.
          </p>
        </ScrollReveal>
        <ScrollReveal direction="up" delay={0.6}>
          <nav className="mt-8 flex flex-wrap gap-3" aria-label="Page navigation">
            <Link
              href="/"
              className="min-h-[44px] px-5 py-3 inline-flex items-center bg-surface-2 border border-white/[var(--border-opacity-default)] hover:bg-surface-3 hover:border-white/[var(--border-opacity-strong)] rounded-lg transition-all duration-normal text-white/[var(--text-opacity-secondary)] hover:text-white text-sm"
            >
              ← 3D View
            </Link>
            <Link
              href="/about"
              className="min-h-[44px] px-5 py-3 inline-flex items-center bg-surface-2 border border-white/[var(--border-opacity-default)] hover:bg-surface-3 hover:border-white/[var(--border-opacity-strong)] rounded-lg transition-all duration-normal text-white/[var(--text-opacity-secondary)] hover:text-white text-sm"
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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/[var(--text-opacity-muted)]" />
            <input
              type="text"
              placeholder="Search projects, technologies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-surface-2 border border-white/[var(--border-opacity-default)] rounded-lg text-white placeholder:text-white/[var(--text-opacity-muted)] focus:outline-none focus:border-white/[var(--border-opacity-strong)] focus:bg-surface-3 transition-all text-sm"
              aria-label="Search projects"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/[var(--text-opacity-muted)] hover:text-white/[var(--text-opacity-secondary)] transition-colors"
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
          <p className="text-white/[var(--text-opacity-tertiary)] text-lg mb-4">No projects found for "{searchQuery}"</p>
          <button
            onClick={() => {
              setSearchQuery('')
              setSelectedGalaxy(null)
            }}
            className="px-4 py-2 bg-surface-3 border border-white/[var(--border-opacity-strong)] rounded-lg text-white/[var(--text-opacity-secondary)] hover:bg-surface-4 hover:text-white transition-all text-sm"
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
                <h2 className="text-lg font-medium text-white/[var(--text-opacity-primary)]">{galaxy.name}</h2>
                <span className="text-sm text-white/[var(--text-opacity-muted)]">({galaxy.projects.length})</span>
              </div>
              <p className="text-white/[var(--text-opacity-muted)] mb-6 text-sm">{galaxy.description}</p>
            </ScrollReveal>

            {/* Bento Grid with stagger animation */}
            <motion.div
              className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
            >
              {/* Featured projects span 2 columns */}
              {featured.map((project, idx) => (
                <motion.div
                  key={project.id}
                  custom={idx}
                  variants={cardVariants}
                  className={cn("h-full", idx === 0 && featured.length > 0 && "md:col-span-2")}
                >
                <TiltCard className="h-full">
                  <Link
                    href={`/work/${project.id}`}
                    className={cn(
                      'group block h-full rounded-xl border transition-all duration-300 relative overflow-hidden',
                      'border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent',
                      'hover:border-white/25 hover:from-white/[0.08] hover:to-white/[0.02]',
                      'hover:shadow-[0_0_40px_var(--glow-color)]',
                      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/30',
                      idx === 0 && featured.length > 0 ? 'p-8' : 'p-5'
                    )}
                    style={{ '--glow-color': `${galaxy.color}30` } as React.CSSProperties}
                  >
                    {/* Accent border line at top */}
                    <div
                      className="absolute top-0 left-0 right-0 h-[2px] opacity-60 group-hover:opacity-100 transition-opacity"
                      style={{ background: `linear-gradient(90deg, transparent, ${galaxy.color}, transparent)` }}
                    />

                    <div className="flex items-start justify-between mb-3 gap-3">
                      <h3 className={cn(
                        "font-semibold transition-colors",
                        idx === 0 && featured.length > 0 ? "text-2xl" : "text-lg"
                      )} style={{ color: 'white' }}>
                        <span className="group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/70 group-hover:bg-clip-text group-hover:text-transparent transition-all">
                          {project.title}
                        </span>
                      </h3>
                      <span
                        className="px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider rounded flex-shrink-0"
                        style={{
                          backgroundColor: `${galaxy.color}20`,
                          color: galaxy.color,
                          border: `1px solid ${galaxy.color}40`
                        }}
                      >
                        Featured
                      </span>
                    </div>

                    <p className={cn(
                      "text-white/[var(--text-opacity-tertiary)] mb-4 line-clamp-2 leading-relaxed group-hover:text-white/[var(--text-opacity-secondary)] transition-colors",
                      idx === 0 && featured.length > 0 ? "text-base" : "text-sm"
                    )}>
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-[10px] rounded transition-all duration-150 hover:scale-105"
                          style={{
                            backgroundColor: `${galaxy.color}10`,
                            color: `${galaxy.color}cc`,
                            border: `1px solid ${galaxy.color}20`
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-white/[var(--text-opacity-muted)] font-mono mt-auto pt-3 border-t border-white/[var(--border-opacity-default)]">
                      <span>{formatDateRange(project.dateRange)}</span>
                      <ProjectLinks project={project} />
                    </div>
                  </Link>
                </TiltCard>
                </motion.div>
              ))}

              {/* Regular projects */}
              {regular.map((project, idx) => (
                <motion.div
                  key={project.id}
                  custom={featured.length + idx}
                  variants={cardVariants}
                  className="h-full"
                >
                <TiltCard className="h-full">
                  <Link
                    href={`/work/${project.id}`}
                    className={cn(
                      'group block h-full rounded-xl border transition-all duration-300 p-5 relative overflow-hidden',
                      'border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent',
                      'hover:border-white/20 hover:from-white/[0.06] hover:to-white/[0.01]',
                      'hover:shadow-[0_0_30px_var(--glow-color)]',
                      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/30'
                    )}
                    style={{ '--glow-color': `${galaxy.color}25` } as React.CSSProperties}
                  >
                    {/* Subtle accent dot */}
                    <div
                      className="absolute top-4 right-4 w-2 h-2 rounded-full opacity-40 group-hover:opacity-80 transition-opacity group-hover:scale-125"
                      style={{ backgroundColor: galaxy.color }}
                    />

                    <h3 className="text-lg font-semibold mb-2 text-white group-hover:text-white transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-sm text-white/[var(--text-opacity-tertiary)] mb-4 line-clamp-2 leading-relaxed group-hover:text-white/[var(--text-opacity-secondary)] transition-colors">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-[10px] rounded transition-all duration-150 hover:scale-105"
                          style={{
                            backgroundColor: `${galaxy.color}08`,
                            color: `${galaxy.color}aa`,
                            border: `1px solid ${galaxy.color}15`
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 3 && (
                        <span className="text-[10px] text-white/[var(--text-opacity-muted)]">
                          +{project.tags.length - 3}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-white/[var(--text-opacity-muted)] font-mono mt-auto pt-3 border-t border-white/[var(--border-opacity-subtle)]">
                      <span>{formatDateRange(project.dateRange)}</span>
                      <ProjectLinks project={project} />
                    </div>
                  </Link>
                </TiltCard>
                </motion.div>
              ))}
            </motion.div>
          </section>
        )
      })}
    </div>
  )
}
