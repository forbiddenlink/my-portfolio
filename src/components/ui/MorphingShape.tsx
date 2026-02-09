'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export function MorphingShape() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
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

    // Blob morphing animation
    let time = 0
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const baseRadius = Math.min(canvas.width, canvas.height) * 0.3
    const points = 8

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Create morphing blob
      ctx.beginPath()
      
      for (let i = 0; i <= points; i++) {
        const angle = (Math.PI * 2 * i) / points
        const noise = Math.sin(time + i * 0.5) * 0.3 + 1
        const radius = baseRadius * noise

        const x = centerX + Math.cos(angle) * radius
        const y = centerY + Math.sin(angle) * radius

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          // Calculate control points for smooth curves
          const prevAngle = (Math.PI * 2 * (i - 1)) / points
          const prevNoise = Math.sin(time + (i - 1) * 0.5) * 0.3 + 1
          const prevRadius = baseRadius * prevNoise
          const prevX = centerX + Math.cos(prevAngle) * prevRadius
          const prevY = centerY + Math.sin(prevAngle) * prevRadius

          const cpX = (prevX + x) / 2
          const cpY = (prevY + y) / 2

          ctx.quadraticCurveTo(cpX, cpY, x, y)
        }
      }

      // Apply gradient fill
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, baseRadius)
      gradient.addColorStop(0, 'rgba(99, 102, 241, 0.1)') // Indigo
      gradient.addColorStop(0.5, 'rgba(168, 85, 247, 0.08)') // Purple
      gradient.addColorStop(1, 'rgba(236, 72, 153, 0.05)') // Pink

      ctx.fillStyle = gradient
      ctx.fill()

      time += 0.005
      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-60"
      style={{ mixBlendMode: 'screen' }}
    />
  )
}
