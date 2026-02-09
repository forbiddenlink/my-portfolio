'use client'

import { useEffect } from 'react'

export function SmoothScroll() {
  useEffect(() => {
    let rafId: number
    let scrollY = window.scrollY
    let isMounted = true
    
    const smoothScroll = () => {
      if (!isMounted) return
      
      const targetY = window.scrollY
      scrollY += (targetY - scrollY) * 0.1
      
      if (Math.abs(targetY - scrollY) > 0.1) {
        rafId = requestAnimationFrame(smoothScroll)
      }
    }
    
    const handleScroll = () => {
      if (!isMounted) return
      if (!rafId) {
        rafId = requestAnimationFrame(smoothScroll)
      }
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      isMounted = false
      window.removeEventListener('scroll', handleScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])
  
  return null
}
