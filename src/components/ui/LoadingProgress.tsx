'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface LoadingProgressProps {
  onComplete?: () => void
}

export function LoadingProgress({ onComplete }: LoadingProgressProps) {
  const [progress, setProgress] = useState(0)
  const [stage, setStage] = useState('Initializing universe...')
  const [isComplete, setIsComplete] = useState(false)

  const stages = [
    { threshold: 0, label: 'Initializing universe...' },
    { threshold: 15, label: 'Mapping star systems...' },
    { threshold: 35, label: 'Generating nebulae...' },
    { threshold: 55, label: 'Placing project stars...' },
    { threshold: 75, label: 'Calibrating cameras...' },
    { threshold: 90, label: 'Preparing for launch...' },
    { threshold: 100, label: 'Ready!' },
  ]

  useEffect(() => {
    // Simulate realistic loading progress with variable speed
    const intervals = [
      { duration: 200, increment: 8 },   // Fast start
      { duration: 150, increment: 5 },   // Medium
      { duration: 180, increment: 4 },   // Slower
      { duration: 200, increment: 3 },   // Even slower
      { duration: 100, increment: 6 },   // Speed up at end
    ]

    let currentProgress = 0
    let intervalIndex = 0

    const tick = () => {
      if (currentProgress >= 100) {
        setIsComplete(true)
        setTimeout(() => {
          onComplete?.()
        }, 500)
        return
      }

      const config = intervals[Math.min(intervalIndex, intervals.length - 1)]
      const increment = config.increment + Math.random() * 3

      currentProgress = Math.min(100, currentProgress + increment)
      setProgress(currentProgress)

      // Update stage
      const currentStage = [...stages].reverse().find(s => currentProgress >= s.threshold)
      if (currentStage) {
        setStage(currentStage.label)
      }

      intervalIndex++
      setTimeout(tick, config.duration + Math.random() * 100)
    }

    const timer = setTimeout(tick, 300)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="h-full w-full bg-black flex flex-col items-center justify-center p-8">
      {/* Animated star background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Galaxy spinner */}
      <div className="relative mb-8">
        <motion.div
          className="w-20 h-20 rounded-full border-2 border-indigo-500/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-2 rounded-full border-2 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent"
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-4 rounded-full border-2 border-t-transparent border-r-pink-500 border-b-transparent border-l-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-3 h-3 bg-white rounded-full"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-64 max-w-full">
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-4">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>

        {/* Stage text */}
        <AnimatePresence mode="wait">
          <motion.p
            key={stage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="text-white/70 text-sm text-center"
          >
            {stage}
          </motion.p>
        </AnimatePresence>

        {/* Percentage */}
        <p className="text-white/40 text-xs text-center mt-2">
          {Math.round(progress)}%
        </p>
      </div>

      {/* Tip */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 text-white/30 text-xs text-center px-4"
      >
        Tip: Use keyboard arrows to navigate the galaxy
      </motion.p>
    </div>
  )
}
