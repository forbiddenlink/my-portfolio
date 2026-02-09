'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  color: string
}

export function ParticleTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const lastTimeRef = useRef(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only show on desktop
    const isMobile = window.matchMedia('(pointer: coarse)').matches
    if (isMobile) return

    setIsVisible(true)

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', handleMouseMove)

    // Particle colors - galaxy themed
    const colors = [
      '#6366F1', // Indigo
      '#A855F7', // Purple
      '#EC4899', // Pink
      '#3B82F6', // Blue
      '#8B5CF6', // Violet
      '#06B6D4', // Cyan
    ]

    let particleId = 0

    // Animation loop
    const animate = (time: number) => {
      const deltaTime = time - lastTimeRef.current
      lastTimeRef.current = time

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Create new particles (throttle based on movement)
      if (deltaTime > 16) { // ~60fps
        const particle: Particle = {
          id: particleId++,
          x: mouseRef.current.x,
          y: mouseRef.current.y,
          size: Math.random() * 3 + 1,
          opacity: 1,
          color: colors[Math.floor(Math.random() * colors.length)]
        }
        particlesRef.current.push(particle)

        // Limit particle count
        if (particlesRef.current.length > 50) {
          particlesRef.current.shift()
        }
      }

      // Update and draw particles
      particlesRef.current.forEach((particle, index) => {
        // Fade out
        particle.opacity -= 0.02
        particle.size *= 0.98

        // Remove if invisible
        if (particle.opacity <= 0) {
          particlesRef.current.splice(index, 1)
          return
        }

        // Draw particle
        ctx.save()
        ctx.globalAlpha = particle.opacity
        ctx.fillStyle = particle.color
        ctx.shadowBlur = 15
        ctx.shadowColor = particle.color
        
        // Draw glow circle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
        
        ctx.restore()
      })

      requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  if (!isVisible) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[5]"
      style={{ mixBlendMode: 'screen' }}
    />
  )
}
