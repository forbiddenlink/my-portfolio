'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, ReactNode } from 'react'
import { easings } from '@/lib/easings'

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  distance?: number
  once?: boolean
}

export function ScrollReveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  distance = 50,
  once = true
}: ScrollRevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin: '-100px' })

  const directions = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{
        ...directions[direction],
        opacity: 0,
      }}
      animate={isInView ? {
        x: 0,
        y: 0,
        opacity: 1,
      } : undefined}
      transition={{
        duration: 0.8,
        delay,
        ease: easings.easeOutExpo,
      }}
    >
      {children}
    </motion.div>
  )
}

export function ScrollScale({
  children,
  className = '',
  delay = 0,
  once = true
}: {
  children: ReactNode
  className?: string
  delay?: number
  once?: boolean
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={isInView ? { scale: 1, opacity: 1 } : undefined}
      transition={{
        duration: 0.6,
        delay,
        ease: easings.easeOutBack,
      }}
    >
      {children}
    </motion.div>
  )
}

export function ScrollStagger({
  children,
  className = '',
  staggerDelay = 0.1,
  once = true
}: {
  children: ReactNode[]
  className?: string
  staggerDelay?: number
  once?: boolean
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin: '-100px' })

  return (
    <div ref={ref} className={className}>
      {Array.isArray(children) && children.map((child, index) => (
        <motion.div
          key={index}
          initial={{ y: 30, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : undefined}
          transition={{
            duration: 0.6,
            delay: index * staggerDelay,
            ease: easings.easeOutQuint,
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  )
}
