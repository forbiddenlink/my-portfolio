'use client'

import { useEffect } from 'react'

export function RippleEffect() {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.currentTarget as HTMLElement
      if (!target.classList.contains('ripple-button')) return

      const ripple = document.createElement('span')
      const rect = target.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      const x = e.clientX - rect.left - size / 2
      const y = e.clientY - rect.top - size / 2

      ripple.style.width = ripple.style.height = `${size}px`
      ripple.style.left = `${x}px`
      ripple.style.top = `${y}px`
      ripple.classList.add('ripple')

      target.appendChild(ripple)

      setTimeout(() => {
        ripple.remove()
      }, 600)
    }

    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.ripple-button')
    buttons.forEach((button) => {
      button.addEventListener('click', handleClick as EventListener)
    })

    return () => {
      buttons.forEach((button) => {
        button.removeEventListener('click', handleClick as EventListener)
      })
    }
  }, [])

  return (
    <style jsx global>{`
      .ripple-button {
        position: relative;
        overflow: hidden;
      }

      .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
      }

      @keyframes ripple-animation {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
    `}</style>
  )
}
