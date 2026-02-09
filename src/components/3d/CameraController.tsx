'use client'

import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { getProjectById, galaxies } from '@/lib/galaxyData'
import { generateProjectPosition } from '@/lib/utils'
import { useViewStore } from '@/lib/store'
import * as THREE from 'three'
import gsap from 'gsap'

// Camera positions for each view state
const CAMERA_POSITIONS = {
  universe: { x: 0, y: 30, z: 60 },
  galaxy: { x: 0, y: 15, z: 30 },
  project: { x: 0, y: 5, z: 15 },
}

export function CameraController() {
  const { camera } = useThree()
  const view = useViewStore((state) => state.view)
  const selectedGalaxy = useViewStore((state) => state.selectedGalaxy)
  const selectedProject = useViewStore((state) => state.selectedProject)
  
  const targetPosition = useRef(new THREE.Vector3())
  const targetLookAt = useRef(new THREE.Vector3())
  
  // Add subtle camera drift for immersion - DISABLED to allow OrbitControls
  // useFrame((state) => {
  //   if (view === 'universe') {
  //     const time = state.clock.elapsedTime
  //     camera.position.x += Math.sin(time * 0.1) * 0.002
  //     camera.position.y += Math.cos(time * 0.15) * 0.001
  //     camera.lookAt(0, 0, 0)
  //   }
  // })

  // Handle view state changes with GSAP animations
  useEffect(() => {
    const duration = 1.5
    const ease = 'power2.inOut'

    if (view === 'universe') {
      // Universe view - wide angle
      gsap.to(camera.position, {
        ...CAMERA_POSITIONS.universe,
        duration,
        ease,
      })
      gsap.to(targetLookAt.current, {
        x: 0,
        y: 0,
        z: 0,
        duration,
        ease,
      })
    } else if (view === 'galaxy' && selectedGalaxy) {
      // Galaxy view - zoom to specific galaxy cluster
      const galaxy = galaxies.find(g => g.id === selectedGalaxy)
      if (!galaxy) return
      
      // Calculate center of galaxy cluster
      const galaxyIndex = galaxies.findIndex(g => g.id === selectedGalaxy)
      const angle = (galaxyIndex / galaxies.length) * Math.PI * 2
      const radius = 25
      const galaxyPosition = {
        x: Math.cos(angle) * radius,
        y: 0,
        z: Math.sin(angle) * radius
      }
      
      gsap.to(camera.position, {
        x: galaxyPosition.x,
        y: galaxyPosition.y + 15,
        z: galaxyPosition.z + 25,
        duration,
        ease,
      })
      gsap.to(targetLookAt.current, {
        ...galaxyPosition,
        duration,
        ease,
      })
    } else if (view === 'project' && selectedProject) {
      // Project view - zoom to specific star
      const project = getProjectById(selectedProject)
      if (!project) return
      
      const [x, y, z] = generateProjectPosition(
        project.id,
        project.galaxy || 'enterprise',
        0, 0, 1
      )
      
      const projectPosition = { x, y, z }
      
      gsap.to(camera.position, {
        x: projectPosition.x + 3,
        y: projectPosition.y + 2,
        z: projectPosition.z + 8,
        duration,
        ease,
      })
      gsap.to(targetLookAt.current, {
        ...projectPosition,
        duration,
        ease,
      })
    }
  }, [view, selectedGalaxy, selectedProject, camera])

  // Update camera lookAt every frame for smooth interpolation
  useFrame(() => {
    camera.lookAt(targetLookAt.current)
  })

  return null
}
