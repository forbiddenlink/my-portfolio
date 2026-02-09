'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useViewStore } from '@/lib/store'
import { getProjectById } from '@/lib/galaxyData'

export function DeepLinkHandler() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const zoomToProject = useViewStore((state) => state.zoomToProject)

  useEffect(() => {
    const projectParam = searchParams.get('p')
    
    if (projectParam) {
      const project = getProjectById(projectParam)
      
      // Check for WebGL support and reduced motion preference
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      const hasWebGL = !!gl
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (!hasWebGL || prefersReducedMotion) {
        // Escape hatch: redirect to canonical /work/[slug] page
        router.replace(`/work/${projectParam}`)
      } else if (project) {
        // Show 3D mode with project modal
        zoomToProject(projectParam)
      } else {
        // Invalid project ID, remove param
        router.replace('/')
      }
    }
  }, [searchParams, router, zoomToProject])

  return null
}
