'use client'

import { useEffect, useRef } from 'react'

interface InteractiveParticlesProps {
  count?: number
}

export function InteractiveParticles({ count = 40 }: InteractiveParticlesProps) {
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

    // Particle class
    class Particle {
      x: number
      y: number
      baseX: number
      baseY: number
      size: number
      speedX: number
      speedY: number
      opacity: number

      constructor() {
        this.x = Math.random() * canvas!.width
        this.y = Math.random() * canvas!.height
        this.baseX = this.x
        this.baseY = this.y
        this.size = Math.random() * 2 + 0.5
        this.speedX = Math.random() * 0.5 - 0.25
        this.speedY = Math.random() * 0.5 - 0.25
        this.opacity = Math.random() * 0.3 + 0.1
      }

      update(mouse: { x: number; y: number }) {
        // Mouse interaction
        const dx = mouse.x - this.x
        const dy = mouse.y - this.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const maxDistance = 150

        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance
          const angle = Math.atan2(dy, dx)
          this.x -= Math.cos(angle) * force * 5
          this.y -= Math.sin(angle) * force * 5
        } else {
          // Return to base position
          if (this.x !== this.baseX) {
            const dx = this.x - this.baseX
            this.x -= dx * 0.05
          }
          if (this.y !== this.baseY) {
            const dy = this.y - this.baseY
            this.y -= dy * 0.05
          }
        }

        // Drift
        this.baseX += this.speedX
        this.baseY += this.speedY

        // Wrap around edges
        if (this.baseX < 0) this.baseX = canvas!.width
        if (this.baseX > canvas!.width) this.baseX = 0
        if (this.baseY < 0) this.baseY = canvas!.height
        if (this.baseY > canvas!.height) this.baseY = 0
      }

      draw() {
        if (!ctx) return
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Create particles
    const particles: Particle[] = []
    for (let i = 0; i < count; i++) {
      particles.push(new Particle())
    }

    // Mouse position
    const mouse = { x: 0, y: 0 }
    
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    
    window.addEventListener('mousemove', handleMouseMove)

    // Animation loop
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        particle.update(mouse)
        particle.draw()
      })

      // Draw connections
      particles.forEach((particleA, i) => {
        particles.slice(i + 1).forEach((particleB) => {
          const dx = particleA.x - particleB.x
          const dy = particleA.y - particleB.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance / 100)})`
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(particleA.x, particleA.y)
            ctx.lineTo(particleB.x, particleB.y)
            ctx.stroke()
          }
        })
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [count])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-5 opacity-30"
      style={{ mixBlendMode: 'screen' }}
    />
  )
}
