'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { gsap } from 'gsap'

export function PageTransition({ children }: { children: React.ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsTransitioning(true)

    // Transition in with smoother easing
    gsap.from('.page-content', {
      opacity: 0,
      y: 20,
      duration: 0.7,
      ease: 'expo.out', // Smoother, more natural
      onComplete: () => {
        setIsTransitioning(false)
      },
    })
  }, [pathname])

  return (
    <>
      {isTransitioning && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-950/20 to-black animate-pulse" />
        </div>
      )}
      <div className="page-content">{children}</div>
    </>
  )
}
