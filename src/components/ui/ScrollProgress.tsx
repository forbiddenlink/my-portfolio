'use client'

import { useEffect, useState } from 'react'

export function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollableElement = document.querySelector('.overflow-y-auto')
      if (!scrollableElement) return

      const scrollTop = scrollableElement.scrollTop
      const scrollHeight = scrollableElement.scrollHeight - scrollableElement.clientHeight
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0
      
      setScrollProgress(progress)
    }

    const scrollableElement = document.querySelector('.overflow-y-auto')
    if (scrollableElement) {
      scrollableElement.addEventListener('scroll', updateScrollProgress)
      updateScrollProgress()
    }

    return () => {
      if (scrollableElement) {
        scrollableElement.removeEventListener('scroll', updateScrollProgress)
      }
    }
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-white/5">
      <div
        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-150 ease-out"
        style={{ width: `${scrollProgress}%` }}
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 blur-sm" />
      </div>
    </div>
  )
}
