'use client'

import { useEffect, useState } from 'react'
import { useViewStore } from '@/lib/store'
import { X } from 'lucide-react'

export function KeyboardShortcutsHelp() {
  const [isVisible, setIsVisible] = useState(false)
  const view = useViewStore((state) => state.view)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault()
        setIsVisible(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-40 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200 flex items-center justify-center text-white/70 hover:text-white text-sm font-bold"
        aria-label="Show keyboard shortcuts"
      >
        ?
      </button>
    )
  }

  const shortcuts = [
    { keys: ['←', '→', '↑', '↓'], description: 'Navigate galaxies/projects' },
    { keys: ['1-6'], description: 'Jump to galaxy' },
    { keys: ['H'], description: 'Home (universe view)' },
    { keys: ['ESC'], description: 'Zoom out / Close' },
    { keys: ['Enter'], description: 'Select / Zoom in' },
    { keys: ['?'], description: 'Toggle this help' },
    { keys: ['Ctrl+Shift+P'], description: 'Show FPS counter' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative bg-gradient-to-br from-black/90 to-black/70 border border-white/20 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold mb-6">Keyboard Shortcuts</h2>

        <div className="space-y-4">
          {shortcuts.map((shortcut, i) => (
            <div key={i} className="flex items-center justify-between gap-4">
              <div className="flex gap-2">
                {shortcut.keys.map((key, j) => (
                  <kbd
                    key={j}
                    className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-sm font-mono font-semibold"
                  >
                    {key}
                  </kbd>
                ))}
              </div>
              <span className="text-white/70 text-sm flex-1 text-right">
                {shortcut.description}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-white/10">
          <p className="text-white/50 text-xs text-center">
            Current view: <span className="text-white/80 font-semibold capitalize">{view}</span>
          </p>
        </div>
      </div>
    </div>
  )
}
