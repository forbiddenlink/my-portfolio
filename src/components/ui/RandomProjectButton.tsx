'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Shuffle } from 'lucide-react'
import type { Project } from '@/lib/types'

interface RandomProjectButtonProps {
  projects: Project[]
}

export function RandomProjectButton({ projects }: RandomProjectButtonProps) {
  const router = useRouter()
  const [isShuffling, setIsShuffling] = useState(false)

  const handleClick = () => {
    setIsShuffling(true)

    // Brief shuffle animation before navigating
    setTimeout(() => {
      const randomProject = projects[Math.floor(Math.random() * projects.length)]
      router.push(`/work/${randomProject.id}`)
    }, 400)
  }

  return (
    <motion.button
      onClick={handleClick}
      disabled={isShuffling}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="px-5 py-3 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 hover:border-purple-500/30 hover:from-purple-500/15 hover:to-indigo-500/15 rounded-lg transition-all duration-200 text-white/70 hover:text-white text-sm flex items-center gap-2 disabled:opacity-70"
    >
      <AnimatePresence mode="wait">
        {isShuffling ? (
          <motion.div
            key="shuffle"
            initial={{ rotate: 0, scale: 1 }}
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            <Shuffle className="w-3.5 h-3.5 text-purple-400" />
          </motion.div>
        ) : (
          <motion.div
            key="sparkles"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
          >
            <Sparkles className="w-3.5 h-3.5" />
          </motion.div>
        )}
      </AnimatePresence>
      <span>{isShuffling ? 'Finding...' : 'Surprise me'}</span>
    </motion.button>
  )
}
