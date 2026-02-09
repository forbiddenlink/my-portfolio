'use client'

import { Mail, Linkedin, Github } from 'lucide-react'
import { MagneticButton } from './MagneticButton'
import { useViewStore } from '@/lib/store'

export function ContactSection() {
  const isJourneyMode = useViewStore((state) => state.isJourneyMode)
  const view = useViewStore((state) => state.view)

  // Hide during journey mode and exploration mode
  if (isJourneyMode || view === 'exploration') return null

  return (
    <div className="fixed top-auto bottom-32 right-6 z-20 flex flex-col gap-3 md:top-[28rem] md:bottom-auto">
      <MagneticButton strength={0.3} tiltStrength={10}>
      <a
        href="mailto:purplegumdropz@gmail.com"
        className="group flex items-center gap-3 py-5 px-8 bg-white/15 backdrop-blur-xl border border-white/30 hover:bg-white/25 hover:border-white/40 rounded-xl transition-all duration-300"
        title="Send me an email"
      >
        <Mail className="w-5 h-5 text-white/80 group-hover:text-white" />
        <span className="text-white/80 group-hover:text-white text-sm font-medium">Contact</span>
      </a>
      </MagneticButton>

      <div className="flex gap-2">
        <a
          href="https://linkedin.com/in/imkindageeky"
          target="_blank"
          rel="noopener noreferrer"
          className="p-5 bg-white/15 backdrop-blur-xl border border-white/30 hover:bg-white/25 hover:border-white/40 rounded-xl transition-all duration-300 hover:scale-110"
          title="LinkedIn"
          aria-label="Connect on LinkedIn"
        >
          <Linkedin className="w-5 h-5 text-white/80 hover:text-white" aria-hidden="true" />
        </a>

        <a
          href="https://github.com/forbiddenlink"
          target="_blank"
          rel="noopener noreferrer"
          className="p-5 bg-white/15 backdrop-blur-xl border border-white/30 hover:bg-white/25 hover:border-white/40 rounded-xl transition-all duration-300 hover:scale-110"
          title="GitHub"
          aria-label="View GitHub profile"
        >
          <Github className="w-5 h-5 text-white/80 hover:text-white" aria-hidden="true" />
        </a>
      </div>
    </div>
  )
}
