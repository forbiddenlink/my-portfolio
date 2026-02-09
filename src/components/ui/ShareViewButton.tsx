'use client'

import { useState, useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { Share2, Check } from 'lucide-react'
import { gsap } from 'gsap'

// Store to communicate between Canvas and UI
let getCameraData: (() => any) | null = null

export function ShareViewButton() {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    if (!getCameraData) return

    // Get current camera position and rotation
    const cameraData = getCameraData()

    // Create shareable URL
    const params = new URLSearchParams()
    params.set('cam', JSON.stringify(cameraData))
    const shareUrl = `${window.location.origin}?${params.toString()}`

    try {
      // Try to use Web Share API first (mobile-friendly)
      if (navigator.share) {
        await navigator.share({
          title: 'Elizabeth Stein Portfolio - Galaxy View',
          text: 'Check out this view of my project galaxy!',
          url: shareUrl,
        })
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareUrl)
        setCopied(true)
        
        // Reset after 2 seconds
        setTimeout(() => setCopied(false), 2000)
      }
    } catch {
      // Silently fail if share/copy fails
    }
  }

  return (
    <div
      onClick={handleShare}
      className="flex items-center justify-center gap-3 py-5 px-8 min-w-[200px] rounded-xl bg-black/30 backdrop-blur-xl border border-white/20 text-white/80 hover:bg-black/40 hover:text-white hover:border-white/30 transition-all duration-300 shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
      title="Share this view"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleShare()
        }
      }}
    >
      {copied ? (
        <>
          <Check className="w-5 h-5 text-green-400" />
          <span className="text-sm text-green-400 font-semibold whitespace-nowrap leading-none">Copied!</span>
        </>
      ) : (
        <>
          <Share2 className="w-5 h-5" />
          <span className="text-sm font-semibold whitespace-nowrap leading-none">Share View</span>
        </>
      )}
    </div>
  )
}

// Component inside Canvas to handle camera state
export function CameraShareController() {
  const { camera } = useThree()

  useEffect(() => {
    // Expose camera getter to UI component
    getCameraData = () => ({
      position: {
        x: camera.position.x.toFixed(2),
        y: camera.position.y.toFixed(2),
        z: camera.position.z.toFixed(2),
      },
      rotation: {
        x: camera.rotation.x.toFixed(2),
        y: camera.rotation.y.toFixed(2),
        z: camera.rotation.z.toFixed(2),
      },
    })

    return () => {
      getCameraData = null
    }
  }, [camera])

  return null
}

// Component to restore camera position from URL
export function CameraRestorer() {
  const { camera } = useThree()

  useEffect(() => {
    // Only run on mount
    if (typeof window === 'undefined') return

    const params = new URLSearchParams(window.location.search)
    const camData = params.get('cam')

    if (camData) {
      try {
        const { position, rotation } = JSON.parse(camData)
        
        // Animate camera to shared position
        gsap.to(camera.position, {
          x: parseFloat(position.x),
          y: parseFloat(position.y),
          z: parseFloat(position.z),
          duration: 2,
          ease: 'power2.inOut',
        })

        gsap.to(camera.rotation, {
          x: parseFloat(rotation.x),
          y: parseFloat(rotation.y),
          z: parseFloat(rotation.z),
          duration: 2,
          ease: 'power2.inOut',
        })
      } catch {
        // Invalid camera data in URL - ignore
      }
    }
  }, [camera])

  return null
}