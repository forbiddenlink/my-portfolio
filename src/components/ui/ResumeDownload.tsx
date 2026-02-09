'use client'

import { Download } from 'lucide-react'
import { useViewStore } from '@/lib/store'

export function ResumeDownload() {
  const isJourneyMode = useViewStore((state) => state.isJourneyMode)
  const view = useViewStore((state) => state.view)

  // Hide during journey mode and exploration mode
  if (isJourneyMode || view === 'exploration') return null

  return (
    <a
      href="/resume.pdf"
      download="Elizabeth_Stein_Resume.pdf"
      className="fixed top-4 right-4 md:top-6 md:right-6 z-40 group flex items-center gap-2 md:gap-3 bg-white/15 backdrop-blur-xl border border-white/30 hover:bg-white/25 hover:border-white/40 rounded-xl transition-all duration-300 hover:scale-105 shadow-2xl px-4 py-3 md:px-8 md:py-5"
    >
      <Download className="w-4 h-4 md:w-5 md:h-5 text-white/80 group-hover:text-white" />
      <span className="text-white/90 group-hover:text-white font-medium text-sm md:text-base">Resume</span>
    </a>
  )
}
