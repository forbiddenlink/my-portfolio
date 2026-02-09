'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

export function SpotlightCursor() {
  const spotlightRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only show on desktop
    const isMobile = window.matchMedia('(pointer: coarse)').matches
    if (isMobile) return

    setIsVisible(true)

    const spotlight = spotlightRef.current
    if (!spotlight) return

    const handleMouseMove = (e: MouseEvent) => {
      gsap.to(spotlight, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.6,
        ease: 'power2.out',
      })
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  if (!isVisible) return null

  return (
    <div
      ref={spotlightRef}
      className="fixed pointer-events-none z-10"
      style={{
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)',
        transform: 'translate(-50%, -50%)',
        filter: 'blur(40px)',
      }}
    />
  )
}
