'use client'

import { useEffect, useRef, useState } from 'react'
import { galaxies } from '@/lib/galaxyData'
import { generateProjectPosition } from '@/lib/utils'
import { useViewStore } from '@/lib/store'
import { gsap } from 'gsap'
import { Minimize2, Maximize2 } from 'lucide-react'

interface ProjectPosition {
  id: string
  x: number
  y: number
  color: string
  size: 'small' | 'medium' | 'large' | 'supermassive'
}

export function MinimapNavigator() {
  // ALL hooks must be called before any early returns to follow React's rules of hooks
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const projectPositionsRef = useRef<ProjectPosition[]>([])
  const [isExpanded, setIsExpanded] = useState(false)
  const [hoveredProject, setHoveredProject] = useState<string | null>(null)
  const selectedProject = useViewStore((state) => state.selectedProject)
  const zoomToProject = useViewStore((state) => state.zoomToProject)
  const isJourneyMode = useViewStore((state) => state.isJourneyMode)
  const view = useViewStore((state) => state.view)

  const size = isExpanded ? 300 : 180
  const padding = 20

  useEffect(() => {
    // Skip effect when hidden
    if (isJourneyMode || view === 'exploration') return
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = size
    canvas.height = size

    // Clear canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
    ctx.fillRect(0, 0, size, size)

    // Draw border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.lineWidth = 1
    ctx.strokeRect(0, 0, size, size)

    // Calculate bounds for all projects using actual 3D positions
    let minX = Infinity, maxX = -Infinity
    let minZ = Infinity, maxZ = -Infinity

    const allPositions: Array<{ pos: [number, number, number], project: any, galaxy: any }> = []

    galaxies.forEach((galaxy, gIdx) => {
      galaxy.projects.forEach((project, pIdx) => {
        const pos = generateProjectPosition(
          project.id,
          galaxy.id,
          gIdx,
          pIdx,
          galaxy.projects.length
        )
        allPositions.push({ pos, project, galaxy })

        minX = Math.min(minX, pos[0])
        maxX = Math.max(maxX, pos[0])
        minZ = Math.min(minZ, pos[2])
        maxZ = Math.max(maxZ, pos[2])
      })
    })

    const scale = (size - padding * 2) / Math.max(maxX - minX, maxZ - minZ)
    const offsetX = size / 2
    const offsetY = size / 2

    // Cache project positions for hit detection
    const positions: ProjectPosition[] = []

    // Draw projects using actual 3D positions (top-down view: X and Z axes)
    allPositions.forEach(({ pos, project, galaxy }) => {
      const x = offsetX + pos[0] * scale
      const y = offsetY + pos[2] * scale

      // Cache position for hit detection
      positions.push({
        id: project.id,
        x,
        y,
        color: galaxy.color,
        size: project.size
      })

      // Determine size and color
      const isSelected = selectedProject === project.id
      const isHovered = hoveredProject === project.id
      const baseSize = project.size === 'supermassive' ? 6 : project.size === 'large' ? 4 : 3

      // Draw glow for selected/hovered
      if (isSelected || isHovered) {
        ctx.shadowBlur = 15
        ctx.shadowColor = galaxy.color
      } else {
        ctx.shadowBlur = 5
        ctx.shadowColor = galaxy.color
      }

      // Draw project dot
      ctx.fillStyle = galaxy.color
      ctx.beginPath()
      ctx.arc(x, y, isSelected || isHovered ? baseSize * 1.5 : baseSize, 0, Math.PI * 2)
      ctx.fill()

      // Reset shadow
      ctx.shadowBlur = 0
    })

    // Store positions for click/hover detection
    projectPositionsRef.current = positions

    // Draw center marker
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.beginPath()
    ctx.arc(offsetX, offsetY, 2, 0, Math.PI * 2)
    ctx.fill()

  }, [size, selectedProject, hoveredProject, isJourneyMode, view])

  // Hide during journey mode and exploration mode - AFTER all hooks are called
  if (isJourneyMode || view === 'exploration') return null

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const clickY = e.clientY - rect.top

    // Use cached positions for hit detection
    for (const project of projectPositionsRef.current) {
      const distance = Math.sqrt(
        Math.pow(clickX - project.x, 2) + 
        Math.pow(clickY - project.y, 2)
      )
      const hitRadius = project.size === 'supermassive' ? 10 : 8

      if (distance < hitRadius) {
        zoomToProject(project.id)
        break
      }
    }
  }

  const handleCanvasHover = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const hoverX = e.clientX - rect.left
    const hoverY = e.clientY - rect.top

    let foundProject: string | null = null

    // Use cached positions for hit detection
    for (const project of projectPositionsRef.current) {
      const distance = Math.sqrt(
        Math.pow(hoverX - project.x, 2) + 
        Math.pow(hoverY - project.y, 2)
      )
      const hitRadius = project.size === 'supermassive' ? 10 : 8

      if (distance < hitRadius) {
        foundProject = project.id
        break
      }
    }

    setHoveredProject(foundProject)
  }

  return (
    <div className="fixed top-32 right-6 z-10 group hidden md:block">
      <div className="relative">
        {/* Canvas */}
        <canvas
          ref={canvasRef}
          className="rounded-lg border border-white/10 backdrop-blur-sm cursor-pointer transition-all hover:border-white/30"
          onClick={handleCanvasClick}
          onMouseMove={handleCanvasHover}
          onMouseLeave={() => setHoveredProject(null)}
          style={{
            width: size,
            height: size,
          }}
        />

        {/* Toggle size button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 rounded-lg border border-white/10 transition-colors"
          title={isExpanded ? 'Minimize' : 'Expand'}
        >
          {isExpanded ? (
            <Minimize2 className="w-4 h-4 text-white" />
          ) : (
            <Maximize2 className="w-4 h-4 text-white" />
          )}
        </button>

        {/* Hovered project tooltip */}
        {hoveredProject && (
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-3 py-2 bg-black/90 text-white text-sm rounded-lg border border-white/20 whitespace-nowrap">
            {galaxies.flatMap(g => g.projects).find(p => p.id === hoveredProject)?.title}
          </div>
        )}

        {/* Label */}
        <div className="absolute -top-8 left-0 text-xs text-white/60 font-mono">
          MINIMAP
        </div>
      </div>
    </div>
  )
}
