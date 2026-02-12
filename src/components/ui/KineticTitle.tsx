'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface KineticTitleProps {
  text: string
  className?: string
  color?: string
  as?: 'h1' | 'h2' | 'h3' | 'span'
}

// Kinetic typography component - letters scatter and reassemble on hover
export function KineticTitle({
  text,
  className = '',
  color = '#ffffff',
  as: Tag = 'h2'
}: KineticTitleProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Pre-compute random offsets for each character (deterministic per character)
  const letterOffsets = useMemo(() => {
    return text.split('').map((char, i) => {
      // Use character code and position for deterministic randomness
      const seed = char.charCodeAt(0) * (i + 1)
      return {
        x: ((seed % 60) - 30),      // -30 to 30
        y: ((seed * 7) % 40) - 20,  // -20 to 20
        rotate: ((seed * 3) % 30) - 15, // -15 to 15 degrees
        scale: 0.8 + ((seed % 4) * 0.1), // 0.8 to 1.1
      }
    })
  }, [text])

  const letters = text.split('')

  return (
    <Tag
      className={cn('relative inline-flex flex-wrap cursor-default', className)}
      style={{ color }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {letters.map((letter, index) => (
        <motion.span
          key={`${letter}-${index}`}
          className="inline-block origin-center"
          initial={false}
          animate={
            isHovered
              ? {
                  x: letterOffsets[index].x,
                  y: letterOffsets[index].y,
                  rotate: letterOffsets[index].rotate,
                  scale: letterOffsets[index].scale,
                  opacity: 0.7,
                }
              : {
                  x: 0,
                  y: 0,
                  rotate: 0,
                  scale: 1,
                  opacity: 1,
                }
          }
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 25,
            mass: 0.8,
            delay: isHovered ? index * 0.02 : (letters.length - index) * 0.01,
          }}
          style={{
            textShadow: isHovered ? `0 0 20px ${color}` : 'none',
          }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </Tag>
  )
}

// Alternative: Magnetic effect where letters are attracted to cursor
export function MagneticTitle({
  text,
  className = '',
  color = '#ffffff',
  as: Tag = 'h2'
}: KineticTitleProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const letters = text.split('')

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  return (
    <Tag
      className={cn('relative inline-flex flex-wrap cursor-default', className)}
      style={{ color }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {letters.map((letter, index) => {
        // Calculate distance from mouse to approximate letter position
        const letterX = (index / letters.length) * 100 // Rough percentage position
        const distFromMouse = isHovered
          ? Math.abs(letterX - (mousePos.x / 300) * 100) // Normalize
          : 0
        const attraction = Math.max(0, 1 - distFromMouse / 30) // 0-1

        return (
          <motion.span
            key={`${letter}-${index}`}
            className="inline-block origin-center"
            animate={{
              y: isHovered ? -attraction * 8 : 0,
              scale: isHovered ? 1 + attraction * 0.15 : 1,
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 20,
            }}
            style={{
              textShadow: isHovered && attraction > 0.3 ? `0 0 ${attraction * 20}px ${color}` : 'none',
            }}
          >
            {letter === ' ' ? '\u00A0' : letter}
          </motion.span>
        )
      })}
    </Tag>
  )
}

// Wave effect - letters wave up and down in sequence
export function WaveTitle({
  text,
  className = '',
  color = '#ffffff',
  as: Tag = 'h2'
}: KineticTitleProps) {
  const [isHovered, setIsHovered] = useState(false)
  const letters = text.split('')

  return (
    <Tag
      className={cn('relative inline-flex flex-wrap cursor-default', className)}
      style={{ color }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {letters.map((letter, index) => (
        <motion.span
          key={`${letter}-${index}`}
          className="inline-block origin-center"
          animate={
            isHovered
              ? {
                  y: [0, -12, 0],
                  transition: {
                    duration: 0.5,
                    delay: index * 0.04,
                    repeat: Infinity,
                    repeatDelay: letters.length * 0.04,
                  },
                }
              : { y: 0 }
          }
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </Tag>
  )
}
