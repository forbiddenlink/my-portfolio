'use client'

import { useRouter } from 'next/navigation'
import { Sparkles } from 'lucide-react'
import type { Project } from '@/lib/types'

interface RandomProjectButtonProps {
  projects: Project[]
}

export function RandomProjectButton({ projects }: RandomProjectButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    const randomProject = projects[Math.floor(Math.random() * projects.length)]
    router.push(`/work/${randomProject.id}`)
  }

  return (
    <button
      onClick={handleClick}
      className="px-5 py-3 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 rounded-lg transition-all duration-200 text-white/60 hover:text-white text-sm flex items-center gap-2"
    >
      <Sparkles className="w-3.5 h-3.5" />
      Surprise me
    </button>
  )
}
