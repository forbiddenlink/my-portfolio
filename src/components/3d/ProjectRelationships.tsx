'use client'

import { useRef, useMemo, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { galaxies, allProjects } from '@/lib/galaxyData'
import { generateProjectPosition } from '@/lib/utils'
import { useViewStore } from '@/lib/store'
import { Html, Line } from '@react-three/drei'

interface ProjectConnection {
  fromId: string
  toId: string
  fromPos: THREE.Vector3
  toPos: THREE.Vector3
  sharedTags: string[]
  strength: number // 0-1 based on number of shared tags
  color: string
}

// Key technologies to highlight connections for
const KEY_TECHNOLOGIES = [
  'AI', 'Next.js', 'React', 'TypeScript', 'Supabase', 'Stripe',
  'Claude', 'GPT-4', 'Three.js', 'Spaced Repetition', 'RAG'
]

// Colors for different connection types
const CONNECTION_COLORS: Record<string, string> = {
  'AI': '#00D9FF',
  'Next.js': '#9D4EDD',
  'React': '#61DAFB',
  'TypeScript': '#3178C6',
  'Supabase': '#3ECF8E',
  'Stripe': '#635BFF',
  'Claude': '#D97706',
  'GPT-4': '#10A37F',
  'Three.js': '#000000',
  'default': '#FFFFFF'
}

/**
 * Compute relationships between projects based on shared tags
 */
function computeProjectRelationships(): ProjectConnection[] {
  const connections: ProjectConnection[] = []
  const seenPairs = new Set<string>()

  // Get all projects with their positions
  const projectsWithPositions = allProjects.map((project) => {
    const galaxy = galaxies.find(g => g.id === project.galaxy)
    const galaxyIndex = galaxies.findIndex(g => g.id === project.galaxy)
    const projectIndex = galaxy?.projects.findIndex(p => p.id === project.id) ?? 0
    const totalProjects = galaxy?.projects.length ?? 1

    const position = new THREE.Vector3(
      ...generateProjectPosition(
        project.id,
        project.galaxy,
        galaxyIndex,
        projectIndex,
        totalProjects
      )
    )

    return { ...project, position }
  })

  // Find connections based on shared tags
  for (let i = 0; i < projectsWithPositions.length; i++) {
    for (let j = i + 1; j < projectsWithPositions.length; j++) {
      const projectA = projectsWithPositions[i]
      const projectB = projectsWithPositions[j]

      // Skip if same galaxy (AnimatedConstellation handles intra-galaxy for enterprise)
      if (projectA.galaxy === projectB.galaxy) continue

      // Find shared key technologies
      const sharedTags = projectA.tags.filter(
        tag => projectB.tags.includes(tag) && KEY_TECHNOLOGIES.includes(tag)
      )

      // Only create connection if they share at least one key technology
      if (sharedTags.length === 0) continue

      const pairKey = [projectA.id, projectB.id].sort().join('-')
      if (seenPairs.has(pairKey)) continue
      seenPairs.add(pairKey)

      // Determine primary color based on most significant shared tag
      const primaryTag = sharedTags.find(tag => CONNECTION_COLORS[tag]) || 'default'
      const color = CONNECTION_COLORS[primaryTag] || CONNECTION_COLORS['default']

      connections.push({
        fromId: projectA.id,
        toId: projectB.id,
        fromPos: projectA.position,
        toPos: projectB.position,
        sharedTags,
        strength: Math.min(sharedTags.length / 3, 1),
        color
      })
    }
  }

  return connections
}

/**
 * Get connections related to a specific project
 */
function getProjectConnections(projectId: string, allConnections: ProjectConnection[]): ProjectConnection[] {
  return allConnections.filter(
    conn => conn.fromId === projectId || conn.toId === projectId
  )
}

interface ConnectionLineProps {
  connection: ProjectConnection
  visible: boolean
  highlighted: boolean
}

function ConnectionLine({ connection, visible, highlighted }: ConnectionLineProps) {
  const particlesRef = useRef<THREE.Points>(null)
  const progressRef = useRef<Float32Array | null>(null)

  // Create curved path between projects
  const { curve, points } = useMemo(() => {
    const midPoint = new THREE.Vector3()
      .addVectors(connection.fromPos, connection.toPos)
      .multiplyScalar(0.5)

    // Add arc height based on distance
    const distance = connection.fromPos.distanceTo(connection.toPos)
    midPoint.y += distance * 0.2

    const curve = new THREE.QuadraticBezierCurve3(
      connection.fromPos,
      midPoint,
      connection.toPos
    )

    return {
      curve,
      points: curve.getPoints(50).map(p => [p.x, p.y, p.z] as [number, number, number])
    }
  }, [connection])

  // Create particle data for flowing effect
  const particleData = useMemo(() => {
    const count = 15
    const positions = new Float32Array(count * 3)
    const progress = new Float32Array(count)
    const speeds = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      progress[i] = i / count
      speeds[i] = 0.2 + Math.random() * 0.1

      const point = curve.getPoint(progress[i])
      positions[i * 3] = point.x
      positions[i * 3 + 1] = point.y
      positions[i * 3 + 2] = point.z
    }

    return { positions, progress, speeds, count }
  }, [curve])

  useEffect(() => {
    progressRef.current = new Float32Array(particleData.progress)
  }, [particleData])

  // Animate particles
  useFrame(() => {
    if (!visible || !particlesRef.current || !progressRef.current) return

    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array

    for (let i = 0; i < particleData.count; i++) {
      progressRef.current[i] += particleData.speeds[i] * 0.01
      if (progressRef.current[i] > 1) progressRef.current[i] = 0

      const point = curve.getPoint(progressRef.current[i])
      positions[i * 3] = point.x
      positions[i * 3 + 1] = point.y
      positions[i * 3 + 2] = point.z
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true
  })

  if (!visible) return null

  return (
    <group>
      {/* Main connection line using drei Line */}
      <Line
        points={points}
        color={connection.color}
        lineWidth={highlighted ? 3 : 1.5}
        transparent
        opacity={highlighted ? 0.8 : 0.4}
      />

      {/* Glow line */}
      <Line
        points={points}
        color={connection.color}
        lineWidth={highlighted ? 6 : 3}
        transparent
        opacity={highlighted ? 0.4 : 0.2}
      />

      {/* Flowing particles */}
      {highlighted && (
        <points ref={particlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={particleData.count}
              array={particleData.positions}
              itemSize={3}
              args={[particleData.positions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.5}
            color={connection.color}
            transparent
            opacity={0.9}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            sizeAttenuation
          />
        </points>
      )}

      {/* Connection label (midpoint) */}
      {highlighted && (
        <Html
          position={curve.getPoint(0.5).toArray()}
          center
          style={{
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          <div className="px-2 py-1 bg-black/80 backdrop-blur-sm rounded text-xs text-white whitespace-nowrap border border-white/20">
            {connection.sharedTags.join(' • ')}
          </div>
        </Html>
      )}
    </group>
  )
}

export function ProjectRelationships() {
  const selectedProject = useViewStore((state) => state.selectedProject)
  const view = useViewStore((state) => state.view)
  const selectedGalaxy = useViewStore((state) => state.selectedGalaxy)

  // Compute all relationships once
  const allConnections = useMemo(() => computeProjectRelationships(), [])

  // Get connections to display based on current view
  const activeConnections = useMemo(() => {
    // If a specific project is selected, show its connections
    if (selectedProject) {
      return getProjectConnections(selectedProject, allConnections)
    }

    // In galaxy view, show strong cross-galaxy connections
    if (view === 'galaxy' || view === 'universe') {
      // Show only the strongest connections (2+ shared tags) to avoid visual clutter
      return allConnections.filter(c => c.strength >= 0.66)
    }

    return []
  }, [selectedProject, allConnections, view])

  // Always show in main views (not during exploration/landing)
  const shouldShow = view === 'galaxy' || view === 'universe' || view === 'project'

  if (!shouldShow || activeConnections.length === 0) return null

  return (
    <group>
      {activeConnections.map((connection) => (
        <ConnectionLine
          key={`${connection.fromId}-${connection.toId}`}
          connection={connection}
          visible={true}
          highlighted={
            selectedProject === connection.fromId ||
            selectedProject === connection.toId
          }
        />
      ))}
    </group>
  )
}
