'use client'

import { useEffect } from 'react'
import { useViewStore } from '@/lib/store'
import { galaxies, allProjects } from '@/lib/galaxyData'

export function KeyboardNavigation() {
  const view = useViewStore((state) => state.view)
  const selectedGalaxy = useViewStore((state) => state.selectedGalaxy)
  const selectedProject = useViewStore((state) => state.selectedProject)
  const zoomToGalaxy = useViewStore((state) => state.zoomToGalaxy)
  const zoomToProject = useViewStore((state) => state.zoomToProject)
  const zoomOut = useViewStore((state) => state.zoomOut)
  const reset = useViewStore((state) => state.reset)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ESC - zoom out one level
      if (e.key === 'Escape') {
        e.preventDefault()
        zoomOut()
        return
      }

      // H - go home (universe view)
      if (e.key === 'h' || e.key === 'H') {
        e.preventDefault()
        reset()
        return
      }

      // Arrow keys for navigation
      if (view === 'universe') {
        // In universe view, arrow keys select galaxies
        const currentIndex = selectedGalaxy 
          ? galaxies.findIndex(g => g.id === selectedGalaxy)
          : -1
        
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault()
          const nextIndex = (currentIndex + 1) % galaxies.length
          zoomToGalaxy(galaxies[nextIndex].id)
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault()
          const prevIndex = currentIndex <= 0 ? galaxies.length - 1 : currentIndex - 1
          zoomToGalaxy(galaxies[prevIndex].id)
        }
      } else if (view === 'galaxy' && selectedGalaxy) {
        // In galaxy view, arrow keys navigate projects within galaxy
        const galaxy = galaxies.find(g => g.id === selectedGalaxy)
        if (!galaxy) return
        
        const projects = galaxy.projects
        const currentIndex = selectedProject
          ? projects.findIndex(p => p.id === selectedProject)
          : -1
        
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault()
          const nextIndex = (currentIndex + 1) % projects.length
          zoomToProject(projects[nextIndex].id)
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault()
          const prevIndex = currentIndex <= 0 ? projects.length - 1 : currentIndex - 1
          zoomToProject(projects[prevIndex].id)
        } else if (e.key === 'Enter' && currentIndex >= 0) {
          e.preventDefault()
          zoomToProject(projects[currentIndex].id)
        }
      } else if (view === 'project') {
        // In project view, arrow keys navigate between all projects
        const currentIndex = selectedProject
          ? allProjects.findIndex(p => p.id === selectedProject)
          : -1
        
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault()
          const nextIndex = (currentIndex + 1) % allProjects.length
          zoomToProject(allProjects[nextIndex].id)
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault()
          const prevIndex = currentIndex <= 0 ? allProjects.length - 1 : currentIndex - 1
          zoomToProject(allProjects[prevIndex].id)
        }
      }

      // Number keys (1-6) - quick jump to galaxies
      const num = parseInt(e.key)
      if (num >= 1 && num <= galaxies.length) {
        e.preventDefault()
        zoomToGalaxy(galaxies[num - 1].id)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [view, selectedGalaxy, selectedProject, zoomToGalaxy, zoomToProject, zoomOut, reset])

  return null
}
