'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface SplitTextProps {
  children: string
  className?: string
  delay?: number
  duration?: number
}

export function SplitText({ children, className = '', delay = 0, duration = 0.05 }: SplitTextProps) {
  const words = children.split(' ')
  
  return (
    <span className={className}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block mr-[0.25em]">
          {word.split('').map((char, charIndex) => (
            <motion.span
              key={charIndex}
              className="inline-block"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.8,
                delay: delay + (wordIndex * 0.1) + (charIndex * duration),
                ease: [0.16, 1, 0.3, 1]
              }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </span>
  )
}

export function SplitWords({ children, className = '', delay = 0 }: { children: string, className?: string, delay?: number }) {
  const words = children.split(' ')
  
  return (
    <span className={className}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="inline-block mr-[0.25em]"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.6,
            delay: delay + (index * 0.08),
            ease: [0.16, 1, 0.3, 1]
          }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  )
}

export function SplitLines({ children, className = '', delay = 0 }: { children: ReactNode, className?: string, delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay }}
    >
      {children}
    </motion.div>
  )
}
