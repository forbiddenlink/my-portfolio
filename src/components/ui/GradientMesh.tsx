'use client'

import { useEffect, useRef } from 'react'

interface GradientMeshProps {
  colors?: string[]
  blur?: number
  opacity?: number
}

export function GradientMesh({
  colors = ['#6366F1', '#A855F7', '#EC4899'],
  blur = 100,
  opacity = 0.15
}: GradientMeshProps) {
  const meshRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!meshRef.current) return

    const animate = () => {
      if (!meshRef.current) return

      const time = Date.now() * 0.0001
      const orbs = meshRef.current.querySelectorAll('.gradient-orb')

      orbs.forEach((orb, i) => {
        const element = orb as HTMLElement
        const offset = i * Math.PI * 0.5

        // Subtle floating animation
        const x = 50 + Math.sin(time + offset) * 20
        const y = 50 + Math.cos(time * 0.8 + offset) * 20

        element.style.left = `${x}%`
        element.style.top = `${y}%`
      })

      requestAnimationFrame(animate)
    }

    const animationId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationId)
  }, [])

  return (
    <div
      ref={meshRef}
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: -1 }}
    >
      {colors.map((color, i) => (
        <div
          key={i}
          className="gradient-orb absolute w-[600px] h-[600px] rounded-full transition-all duration-1000 ease-in-out"
          style={{
            background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
            filter: `blur(${blur}px)`,
            opacity,
            left: `${30 + i * 25}%`,
            top: `${40 + i * 15}%`,
          }}
        />
      ))}

      {/* Static noise texture overlay for depth */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`,
          opacity: 0.3,
        }}
      />
    </div>
  )
}
