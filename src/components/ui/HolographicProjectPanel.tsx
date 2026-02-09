'use client'

import { useViewStore } from '@/lib/store'
import { getProjectById } from '@/lib/galaxyData'
import { ExternalLink, Github, X } from 'lucide-react'

export function HolographicProjectPanel({ show }: { show: boolean }) {
  const selectedProject = useViewStore((state) => state.selectedProject)
  const reset = useViewStore((state) => state.reset)
  const project = selectedProject ? getProjectById(selectedProject) : null

  if (!show || !project) return null

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-auto animate-in fade-in zoom-in-95 duration-500">
      <div
        className="relative bg-black/40 backdrop-blur-2xl border-2 rounded-2xl p-8 max-w-2xl"
        style={{
          borderColor: project.color,
          boxShadow: `0 0 60px ${project.color}40, inset 0 0 30px ${project.color}20`,
          background: `linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,20,40,0.4) 50%, rgba(0,0,0,0.6) 100%)`
        }}
      >
        {/* Scanline effect */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div className="h-full w-full bg-gradient-to-b from-transparent via-white to-transparent animate-pulse" style={{ backgroundSize: '100% 4px' }} />
        </div>

        {/* Close button */}
        <button
          onClick={reset}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 pointer-events-auto"
          aria-label="Close project panel"
        >
          <X className="w-5 h-5 text-white/70 hover:text-white" />
        </button>

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <div
                className="text-xs font-mono tracking-wider mb-2"
                style={{ color: project.color }}
              >
                ACCESSING PROJECT DATA...
              </div>
              <h2 className="text-4xl font-bold mb-2" style={{ color: project.color }}>
                {project.title}
              </h2>
              {project.company && (
                <p className="text-white/70 text-lg font-mono">{project.company}</p>
              )}
            </div>
            <div
              className="w-16 h-16 rounded-lg"
              style={{
                backgroundColor: project.color,
                boxShadow: `0 0 20px ${project.color}`,
                opacity: 0.6
              }}
            />
          </div>

          {/* Description */}
          <p className="text-white/90 text-lg mb-6 leading-relaxed">
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.slice(0, 6).map(tag => (
              <span
                key={tag}
                className="px-3 py-1 text-sm font-mono border rounded"
                style={{
                  borderColor: `${project.color}40`,
                  color: project.color,
                  background: `${project.color}10`
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Links */}
          {project.links && (
            <div className="flex gap-4 pointer-events-auto">
              {project.links.live && (
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 hover:bg-white/10 transition-all duration-200"
                  style={{
                    borderColor: project.color,
                    color: project.color
                  }}
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="font-mono text-sm">VIEW LIVE</span>
                </a>
              )}
              {project.links.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-white/10 transition-all duration-200 border-white/30 text-white/70 hover:text-white"
                >
                  <Github className="w-4 h-4" />
                  <span className="font-mono text-sm">SOURCE</span>
                </a>
              )}
            </div>
          )}

          {/* Footer hint */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <p className="text-white/50 text-xs font-mono text-center">
              Press ESC to return to galaxy view
            </p>
          </div>
        </div>

        {/* Corner accents */}
        <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2" style={{ borderColor: project.color }} />
        <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2" style={{ borderColor: project.color }} />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2" style={{ borderColor: project.color }} />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2" style={{ borderColor: project.color }} />
      </div>
    </div>
  )
}
