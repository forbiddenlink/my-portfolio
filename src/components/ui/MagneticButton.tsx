'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { usePrefersReducedMotion } from '@/lib/store'

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  strength?: number
  onClick?: () => void
  href?: string
  tiltStrength?: number
  glowOnHover?: boolean
}

export function MagneticButton({
  children,
  className = '',
  strength = 0.4,
  onClick,
  href,
  tiltStrength = 15,
  glowOnHover = true
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null)
  const magneticAreaRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const button = buttonRef.current
    const magneticArea = magneticAreaRef.current
    if (!button || !magneticArea) return

    // Skip magnetic effect if user prefers reduced motion
    if (prefersReducedMotion) {
      const handleMouseEnter = () => setIsHovered(true)
      const handleMouseLeave = () => setIsHovered(false)

      magneticArea.addEventListener('mouseenter', handleMouseEnter)
      magneticArea.addEventListener('mouseleave', handleMouseLeave)

      return () => {
        magneticArea.removeEventListener('mouseenter', handleMouseEnter)
        magneticArea.removeEventListener('mouseleave', handleMouseLeave)
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = magneticArea.getBoundingClientRect()
      const centerX = left + width / 2
      const centerY = top + height / 2
      const deltaX = e.clientX - centerX
      const deltaY = e.clientY - centerY

      // Calculate distance from center
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
      const maxDistance = Math.max(width, height) / 2

      if (distance < maxDistance * 1.5) {
        // Calculate tilt based on mouse position
        const tiltX = (deltaY / height) * tiltStrength
        const tiltY = -(deltaX / width) * tiltStrength

        // Apply magnetic effect with tilt
        gsap.to(button, {
          x: deltaX * strength,
          y: deltaY * strength,
          rotationX: tiltX,
          rotationY: tiltY,
          duration: 0.3,
          ease: 'power2.out',
        })
      }
    }

    const handleMouseEnter = () => {
      setIsHovered(true)
    }

    const handleMouseLeave = () => {
      setIsHovered(false)
      gsap.to(button, {
        x: 0,
        y: 0,
        rotationX: 0,
        rotationY: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.3)',
      })
    }

    magneticArea.addEventListener('mousemove', handleMouseMove)
    magneticArea.addEventListener('mouseenter', handleMouseEnter)
    magneticArea.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      magneticArea.removeEventListener('mousemove', handleMouseMove)
      magneticArea.removeEventListener('mouseenter', handleMouseEnter)
      magneticArea.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [strength, tiltStrength, prefersReducedMotion])

  const Component = href ? 'a' : 'button'

  return (
    <div 
      ref={magneticAreaRef}
      className="inline-block p-5"
            style={{
        perspective: '1000px'
      }}
    >
      <Component
        ref={buttonRef as any}
        className={`${className} ${isHovered && glowOnHover ? 'magnetic-glow' : ''} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black`}
        onClick={onClick}
        href={href}
        style={{
          transformStyle: 'preserve-3d',
          transition: glowOnHover ? 'box-shadow 0.3s ease' : 'none'
        }}
      >
        {children}
      </Component>
    </div>
  )
}
