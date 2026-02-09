'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorDotRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const cursor = cursorRef.current
    const cursorDot = cursorDotRef.current
    if (!cursor || !cursorDot) return

    // Only show custom cursor on desktop
    const isMobile = window.matchMedia('(pointer: coarse)').matches
    if (isMobile) return

    setIsVisible(true)

    const pos = { x: 0, y: 0 }
    const mouse = { x: 0, y: 0 }
    const speed = 0.15 // Lower = smoother/slower

    const updatePosition = () => {
      pos.x += (mouse.x - pos.x) * speed
      pos.y += (mouse.y - pos.y) * speed
      
      gsap.set(cursor, {
        x: pos.x,
        y: pos.y,
      })
    }

    const updateDotPosition = (e: MouseEvent) => {
      gsap.set(cursorDot, {
        x: e.clientX,
        y: e.clientY,
      })
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      updateDotPosition(e)
    }

    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => setIsHovering(false)

    // Add magnetic effect to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, canvas, [role="button"]')
    
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', handleMouseEnter as EventListener)
      el.addEventListener('mouseleave', handleMouseLeave as EventListener)
    })

    // Animation loop
    gsap.ticker.add(updatePosition)
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      gsap.ticker.remove(updatePosition)
      window.removeEventListener('mousemove', handleMouseMove)
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter as EventListener)
        el.removeEventListener('mouseleave', handleMouseLeave as EventListener)
      })
    }
  }, [])

  if (!isVisible) return null

  return (
    <>
      {/* Outer ring - follows with delay */}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] mix-blend-difference"
        style={{
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div
          className={`rounded-full border-2 border-white transition-all duration-300 ${
            isHovering ? 'h-16 w-16 opacity-50' : 'h-10 w-10 opacity-30'
          }`}
        />
      </div>

      {/* Inner dot - follows immediately */}
      <div
        ref={cursorDotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] mix-blend-difference"
        style={{
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div
          className={`rounded-full bg-white transition-all duration-200 ${
            isHovering ? 'h-2 w-2 opacity-80' : 'h-1 w-1 opacity-60'
          }`}
        />
      </div>
    </>
  )
}
