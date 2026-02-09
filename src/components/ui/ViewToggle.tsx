'use client'

import Link from 'next/link'
import { Layers, List } from 'lucide-react'

export function ViewToggle() {
  return (
    <div className="fixed top-6 right-6 z-40 flex gap-2">
      <Link
        href="/"
        className="flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
        aria-label="3D View"
      >
        <Layers className="w-4 h-4" />
        <span className="text-sm font-medium">3D View</span>
      </Link>
      <Link
        href="/work"
        className="flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
        aria-label="List View"
      >
        <List className="w-4 h-4" />
        <span className="text-sm font-medium">List View</span>
      </Link>
    </div>
  )
}
