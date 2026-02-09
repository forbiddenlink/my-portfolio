'use client'

import { motion } from 'framer-motion'

const stats = [
  { label: 'Projects', value: '40+' },
  { label: 'Tests', value: '1,200+' },
  { label: 'Years', value: '6+' },
]

export function StatsBar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0, duration: 0.5 }}
      className="flex items-center gap-6 mt-6"
    >
      {stats.map((stat, idx) => (
        <div key={stat.label} className="flex items-center gap-2">
          <span className="text-lg md:text-xl font-bold text-white/90">{stat.value}</span>
          <span className="text-xs text-white/50 uppercase tracking-wider">{stat.label}</span>
          {idx < stats.length - 1 && (
            <span className="ml-4 w-px h-4 bg-white/20" aria-hidden="true" />
          )}
        </div>
      ))}
    </motion.div>
  )
}
