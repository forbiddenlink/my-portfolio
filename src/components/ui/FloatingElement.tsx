'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

interface FloatingElementProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function FloatingElement({ children, className = '', delay = 0 }: FloatingElementProps) {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!elementRef.current) return

    // Create floating animation
    gsap.to(elementRef.current, {
      y: -10,
      duration: 2 + Math.random(),
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      delay,
    })

    // Add slight rotation
    gsap.to(elementRef.current, {
      rotation: 3,
      duration: 3 + Math.random(),
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      delay: delay + 0.5,
    })
  }, [delay])

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  )
}

export function GlowOrb({ color = '#8B5CF6', size = 200, x = 50, y = 50 }: {
  color?: string
  size?: number
  x?: number
  y?: number
}) {
  return (
    <div
      className="fixed pointer-events-none animate-pulse"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${size}px`,
        height: `${size}px`,
        background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
        filter: 'blur(60px)',
        transform: 'translate(-50%, -50%)',
      }}
    />
  )
}
