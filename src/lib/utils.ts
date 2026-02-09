// Utility functions for deterministic positioning and helpers

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Tailwind class merger utility
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Simple hash function for deterministic seeding
 */
export function hashCode(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0
  }
  return h >>> 0
}

/**
 * Mulberry32 - fast, high-quality seeded random number generator
 * Returns a function that generates deterministic "random" numbers
 */
export function seededRandom(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Generate deterministic 3D position for a project based on its ID and galaxy
 * This ensures consistent positioning across builds without hand-coding coordinates
 */
export function generateProjectPosition(
  projectId: string,
  galaxyId: string,
  galaxyIndex: number,
  projectIndex: number,
  totalProjects: number
): [number, number, number] {
  const seed = hashCode(projectId + galaxyId)
  const rng = seededRandom(seed)

  // Galaxy positioning (6 galaxies in a rough circle)
  const galaxyAngle = (galaxyIndex / 6) * Math.PI * 2
  const galaxyRadius = 25
  const galaxyX = Math.cos(galaxyAngle) * galaxyRadius
  const galaxyZ = Math.sin(galaxyAngle) * galaxyRadius

  // Project positioning within galaxy (distribute in a sphere)
  const theta = rng() * Math.PI * 2
  const phi = Math.acos(2 * rng() - 1)
  const radius = 3 + rng() * 7 // 3-10 units from galaxy center

  const x = galaxyX + radius * Math.sin(phi) * Math.cos(theta)
  const y = radius * Math.sin(phi) * Math.sin(theta)
  const z = galaxyZ + radius * Math.cos(phi)

  return [x, y, z]
}

/**
 * Format project date range for display
 */
export function formatDateRange(dateRange: string): string {
  if (dateRange.includes('-')) {
    const [start, end] = dateRange.split('-')
    return `${start}–${end}`
  }
  return dateRange
}

/**
 * Get size multiplier for star rendering
 */
export function getSizeMultiplier(size: string): number {
  switch (size) {
    case 'supermassive':
      return 3.0
    case 'large':
      return 1.8
    case 'medium':
      return 1.2
    case 'small':
    default:
      return 0.8
  }
}

/**
 * Get galaxy center position based on index
 * Matches the positioning logic in generateProjectPosition
 */
export function getGalaxyCenterPosition(galaxyIndex: number): [number, number, number] {
  const galaxyAngle = (galaxyIndex / 6) * Math.PI * 2
  const galaxyRadius = 25
  const x = Math.cos(galaxyAngle) * galaxyRadius
  const z = Math.sin(galaxyAngle) * galaxyRadius
  return [x, 0, z]
}

/**
 * Linear interpolation for smooth animations
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t
}
