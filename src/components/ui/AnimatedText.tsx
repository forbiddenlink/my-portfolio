'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { easingsToCss } from '@/lib/easings'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(SplitText)
}

interface AnimatedTextProps {
  children: React.ReactNode
  className?: string
  delay?: number
  type?: 'chars' | 'words' | 'lines'
  stagger?: number
  style?: React.CSSProperties
}

export function AnimatedText({
  children,
  className = '',
  delay = 0,
  type = 'chars',
  stagger = 0.03,
  style
}: AnimatedTextProps) {
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!textRef.current) return

    const split = new SplitText(textRef.current, {
      type,
      linesClass: 'split-line'
    })

    // Animate each character/word/line
    gsap.from(split[type], {
      opacity: 0,
      y: 20,
      rotateX: -90,
      stagger,
      duration: 0.8,
      ease: 'expo.out', // Smoother easing
      delay,
    })

    return () => {
      split.revert()
    }
  }, [children, delay, type, stagger])

  return (
    <div ref={textRef} className={className} style={style}>
      {children}
    </div>
  )
}

interface FadeInProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  duration?: number
}

export function FadeIn({ 
  children, 
  className = '', 
  delay = 0,
  direction = 'up',
  duration = 0.8 
}: FadeInProps) {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!elementRef.current) return

    const directionMap = {
      up: { y: 30 },
      down: { y: -30 },
      left: { x: 30 },
      right: { x: -30 },
      none: {},
    }

    gsap.from(elementRef.current, {
      opacity: 0,
      ...directionMap[direction],
      duration,
      ease: 'expo.out', // Smoother easing
      delay,
    })
  }, [delay, direction, duration])

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  )
}
