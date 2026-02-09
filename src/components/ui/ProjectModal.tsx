'use client'

import { useEffect, useCallback } from 'react'
import { useViewStore } from '@/lib/store'
import { getProjectById } from '@/lib/galaxyData'
import { ProjectCaseStudy } from '@/components/projects/ProjectCaseStudy'
import { GenerativeHero } from '@/components/ui/GenerativeHero'
import { X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ScrollProgress } from './ScrollProgress'

export function ProjectModal() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedProject = useViewStore((state) => state.selectedProject)
  const view = useViewStore((state) => state.view)
  const zoomOut = useViewStore((state) => state.zoomOut)

  const project = selectedProject ? getProjectById(selectedProject) : null
  const isOpen = view === 'project' && project !== null

  // Close handler that properly updates URL
  const handleClose = useCallback(() => {
    zoomOut()
    router.push('/', { scroll: false })
  }, [zoomOut, router])

  // Sync URL with selection state (deep-linking)
  useEffect(() => {
    if (selectedProject && isOpen) {
      // Update URL with query param
      router.replace(`/?p=${selectedProject}`, { scroll: false })
    }
  }, [selectedProject, isOpen, router])

  // Handle browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search)
      const projectParam = urlParams.get('p')

      if (!projectParam && isOpen) {
        zoomOut()
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [zoomOut, isOpen])

  // Handle ESC key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose()
      }
    },
    [isOpen, handleClose]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen || !project) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/90 backdrop-blur-md animate-in fade-in duration-300 gpu-accelerated"
      onClick={handleClose}
    >
      {/* Scroll Progress */}
      <ScrollProgress />

      <div
        className="relative w-full max-w-5xl bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl my-8 mx-4 shadow-2xl animate-in slide-in-from-bottom-8 zoom-in-95 duration-500 will-change-transform"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(20,20,40,0.6) 50%, rgba(0,0,0,0.8) 100%)',
          backdropFilter: 'blur(20px) saturate(180%)',
          borderColor: `${project.color}30`,
          boxShadow: `0 0 60px ${project.color}20, 0 8px 32px rgba(0,0,0,0.5)`
        }}
      >
        {/* Glass morphism inner glow */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none z-10" />

        {/* Generative Modal Background/Header */}
        <div className="absolute inset-x-0 top-0 h-64 overflow-hidden rounded-t-3xl opacity-20 mask-image-linear-to-b">
          <GenerativeHero name={project.title} color={project.color} />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black" />
        </div>

        {/* Animated border glow with project color */}
        <div
          className="absolute inset-0 rounded-3xl blur-xl -z-10 animate-pulse"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${project.color}30, transparent 70%)`
          }}
        />

        {/* Close button */}
        <button
          onClick={handleClose}
          className="ripple-button fixed top-8 right-8 z-[60] p-4 rounded-full bg-black/60 hover:bg-black/80 hover:scale-110 hover:rotate-90 transition-all duration-300 backdrop-blur-xl border-2 border-white/30 group shadow-2xl"
          aria-label="Close modal"
        >
          <X className="w-6 h-6 text-white transition-transform group-hover:scale-110" />
        </button>

        {/* Reuse the same component used in /work/[slug] */}
        <ProjectCaseStudy project={project} />

        {/* View full page link */}
        <div className="px-8 pb-8">
          <a
            href={`/work/${project.id}`}
            className="ripple-button inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/30 text-base text-white/70 hover:text-white hover:gap-3 transition-all duration-300"
          >
            View full page →
          </a>
        </div>
      </div>
    </div>
  )
}
