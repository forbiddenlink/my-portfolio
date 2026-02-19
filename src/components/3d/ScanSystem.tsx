'use client'

import { useRef, useState, useEffect, useMemo, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Text, Billboard, Ring } from '@react-three/drei'
import * as THREE from 'three'
import { useViewStore } from '@/lib/store'
import { galaxies, allProjects } from '@/lib/galaxyData'
import { generateProjectPosition, getSizeMultiplier } from '@/lib/utils'
import type { Project } from '@/lib/types'
import { create } from 'zustand'

// =============================================================================
// SCAN TARGET STORE - Shared state for HUD to read
// =============================================================================

interface ScanTargetState {
  targetPlanet: Project | null
  targetPosition: [number, number, number] | null
  canScan: boolean
  isScanning: boolean
  isScanned: boolean
  distance: number
  setTarget: (planet: Project | null, position: [number, number, number] | null, distance: number) => void
}

const useScanTargetStore = create<ScanTargetState>((set) => ({
  targetPlanet: null,
  targetPosition: null,
  canScan: false,
  isScanning: false,
  isScanned: false,
  distance: Infinity,
  setTarget: (planet, position, distance) => set({
    targetPlanet: planet,
    targetPosition: position,
    distance,
    canScan: distance < SCAN_RANGE
  }),
}))

// =============================================================================
// CONSTANTS
// =============================================================================

const SCAN_RANGE = 15 // Units - distance within which scanning is possible
const SCAN_DURATION = 1.5 // Seconds to complete a scan

// =============================================================================
// HOOK: useScanTarget - Export for HUD to use
// =============================================================================

export function useScanTarget() {
  const targetPlanet = useScanTargetStore((s) => s.targetPlanet)
  const canScan = useScanTargetStore((s) => s.canScan)
  const distance = useScanTargetStore((s) => s.distance)

  const scanningPlanet = useViewStore((s) => s.scanningPlanet)
  const scannedPlanets = useViewStore((s) => s.scannedPlanets)
  const scanProgress = useViewStore((s) => s.scanProgress)

  const isScanning = targetPlanet ? scanningPlanet === targetPlanet.id : false
  const isScanned = targetPlanet ? scannedPlanets.has(targetPlanet.id) : false

  return {
    targetPlanet,
    canScan,
    isScanning,
    isScanned,
    scanProgress: isScanning ? scanProgress : 0,
    distance,
  }
}

// =============================================================================
// HELPER: Pre-compute planet positions for performance
// =============================================================================

interface PlanetData {
  project: Project
  position: THREE.Vector3
  positionTuple: [number, number, number]
}

function usePlanetPositions(): PlanetData[] {
  return useMemo(() => {
    const positions: PlanetData[] = []

    galaxies.forEach((galaxy, galaxyIndex) => {
      galaxy.projects.forEach((project, projectIndex) => {
        const pos = generateProjectPosition(
          project.id,
          galaxy.id,
          galaxyIndex,
          projectIndex,
          galaxy.projects.length
        )
        positions.push({
          project,
          position: new THREE.Vector3(...pos),
          positionTuple: pos,
        })
      })
    })

    return positions
  }, [])
}

// =============================================================================
// COMPONENT: ScanProgressRing - Visual feedback during scanning
// =============================================================================

function ScanProgressRing({
  position,
  progress,
  color,
  size
}: {
  position: [number, number, number]
  progress: number
  color: string
  size: number
}) {
  const ringRef = useRef<THREE.Mesh>(null)
  const outerRingRef = useRef<THREE.Mesh>(null)

  // Animate the ring
  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 2
    }
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z = -state.clock.elapsedTime * 1.5
    }
  })

  // Only render the arc portion that represents progress
  const innerRadius = size * 1.3
  const outerRadius = size * 1.5
  const thetaStart = 0
  const thetaLength = Math.PI * 2 * progress

  return (
    <group position={position}>
      {/* Progress arc */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[innerRadius, outerRadius, 64, 1, thetaStart, thetaLength]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Background ring (full circle, dimmer) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[innerRadius, outerRadius, 64]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Outer decorative ring */}
      <mesh ref={outerRingRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[outerRadius + 0.1, outerRadius + 0.2, 32, 1, 0, Math.PI * 0.5]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}

// =============================================================================
// COMPONENT: ScannedPlanetData - Floating 3D text and tech icons
// =============================================================================

function ScannedPlanetData({
  project,
  position
}: {
  project: Project
  position: [number, number, number]
}) {
  const groupRef = useRef<THREE.Group>(null)
  const size = getSizeMultiplier(project.size)

  // Offset the data display to the side of the planet
  const offset: [number, number, number] = [size * 2 + 1.5, size * 0.5, 0]

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating animation
      groupRef.current.position.y = offset[1] + Math.sin(state.clock.elapsedTime * 1.5) * 0.1
    }
  })

  // Limit to 3 tags for display
  const displayTags = project.tags.slice(0, 3)

  return (
    <group position={position}>
      <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
        <group ref={groupRef} position={offset}>
          {/* Project title */}
          <Text
            position={[0, 0.3, 0]}
            fontSize={0.5}
            color="#ffffff"
            anchorX="left"
            anchorY="middle"
            font="/fonts/inter-medium.woff"
            outlineWidth={0.02}
            outlineColor="#000000"
          >
            {project.title}
          </Text>

          {/* Tech tags */}
          <group position={[0, -0.2, 0]}>
            {displayTags.map((tag, index) => (
              <Text
                key={tag}
                position={[index * 1.5, 0, 0]}
                fontSize={0.25}
                color={project.color}
                anchorX="left"
                anchorY="middle"
                font="/fonts/inter-medium.woff"
              >
                {tag}
              </Text>
            ))}
          </group>

          {/* Scan indicator line connecting to planet */}
          <mesh position={[-size - 0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <planeGeometry args={[0.02, size * 1.5]} />
            <meshBasicMaterial
              color={project.color}
              transparent
              opacity={0.4}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </group>
      </Billboard>
    </group>
  )
}

// =============================================================================
// COMPONENT: ScanSystem - Main component
// =============================================================================

export function ScanSystem() {
  const { camera } = useThree()
  const planetPositions = usePlanetPositions()

  // Store actions
  const startScan = useViewStore((s) => s.startScan)
  const updateScanProgress = useViewStore((s) => s.updateScanProgress)
  const completeScan = useViewStore((s) => s.completeScan)
  const cancelScan = useViewStore((s) => s.cancelScan)
  const scanningPlanet = useViewStore((s) => s.scanningPlanet)
  const scannedPlanets = useViewStore((s) => s.scannedPlanets)
  const scanProgress = useViewStore((s) => s.scanProgress)
  const view = useViewStore((s) => s.view)

  // Local state
  const setTarget = useScanTargetStore((s) => s.setTarget)
  const [nearestPlanet, setNearestPlanet] = useState<PlanetData | null>(null)
  const [isSpaceHeld, setIsSpaceHeld] = useState(false)
  const scanStartTimeRef = useRef<number | null>(null)
  // Refs to track previous values and avoid unnecessary state updates
  const prevNearestIdRef = useRef<string | null>(null)
  const prevDistanceRef = useRef<number>(Infinity)
  const prevProgressRef = useRef<number>(0)

  // Keyboard handlers for Space key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault()
        setIsSpaceHeld(true)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        setIsSpaceHeld(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  // Handle scan state changes based on Space key
  useEffect(() => {
    if (isSpaceHeld && nearestPlanet && !scannedPlanets.has(nearestPlanet.project.id)) {
      // Start scanning if not already
      if (scanningPlanet !== nearestPlanet.project.id) {
        startScan(nearestPlanet.project.id)
        scanStartTimeRef.current = performance.now()
      }
    } else if (!isSpaceHeld && scanningPlanet) {
      // Cancel scan if space is released before completion
      cancelScan()
      scanStartTimeRef.current = null
    }
  }, [isSpaceHeld, nearestPlanet, scanningPlanet, scannedPlanets, startScan, cancelScan])

  // Main update loop - CRITICAL: Avoid state updates unless values actually change
  useFrame((state, delta) => {
    // Skip in exploration mode
    if (view === 'exploration') return

    // 1. Find nearest planet within scan range
    let nearest: PlanetData | null = null
    let minDistance = SCAN_RANGE

    for (const planetData of planetPositions) {
      const distance = camera.position.distanceTo(planetData.position)
      if (distance < minDistance) {
        minDistance = distance
        nearest = planetData
      }
    }

    // Only update state if the nearest planet ID changed (not object reference)
    const nearestId = nearest?.project.id ?? null
    if (nearestId !== prevNearestIdRef.current) {
      prevNearestIdRef.current = nearestId
      setNearestPlanet(nearest)
    }

    // Only update target store if distance changed significantly (>0.5 units)
    const distanceChanged = Math.abs(minDistance - prevDistanceRef.current) > 0.5
    const targetChanged = nearestId !== prevNearestIdRef.current

    if (targetChanged || distanceChanged) {
      prevDistanceRef.current = minDistance
      if (nearest) {
        setTarget(nearest.project, nearest.positionTuple, minDistance)
      } else {
        setTarget(null, null, Infinity)
      }
    }

    // 2. Update scan progress if actively scanning
    if (scanningPlanet && scanStartTimeRef.current !== null) {
      const elapsed = (performance.now() - scanStartTimeRef.current) / 1000
      const progress = Math.min(elapsed / SCAN_DURATION, 1)

      // Only update if progress changed by at least 1%
      if (Math.abs(progress - prevProgressRef.current) > 0.01) {
        prevProgressRef.current = progress
        updateScanProgress(progress)
      }

      // Complete scan when done
      if (progress >= 1) {
        completeScan(scanningPlanet)
        scanStartTimeRef.current = null
        prevProgressRef.current = 0
      }
    }
  })

  // Get the planet being scanned for visual feedback
  const scanningPlanetData = useMemo(() => {
    if (!scanningPlanet) return null
    return planetPositions.find(p => p.project.id === scanningPlanet) || null
  }, [scanningPlanet, planetPositions])

  // Get all scanned planets for data display
  const scannedPlanetDataList = useMemo(() => {
    return planetPositions.filter(p => scannedPlanets.has(p.project.id))
  }, [scannedPlanets, planetPositions])

  // Don't render in exploration mode
  if (view === 'exploration') return null

  return (
    <group>
      {/* Scan progress ring for planet being scanned */}
      {scanningPlanetData && (
        <ScanProgressRing
          position={scanningPlanetData.positionTuple}
          progress={scanProgress}
          color={scanningPlanetData.project.color}
          size={getSizeMultiplier(scanningPlanetData.project.size)}
        />
      )}

      {/* Floating data for all scanned planets */}
      {scannedPlanetDataList.map((planetData) => (
        <ScannedPlanetData
          key={planetData.project.id}
          project={planetData.project}
          position={planetData.positionTuple}
        />
      ))}
    </group>
  )
}
