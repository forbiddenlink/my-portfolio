'use client'

import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { cn } from '@/lib/utils'

export function NebulaCursor() {
    const cursorRef = useRef<HTMLDivElement>(null)
    const trailerRef = useRef<HTMLDivElement>(null)

    // Mouse position
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    // Smooth spring physics for the trailer
    const springConfig = { damping: 20, stiffness: 300, mass: 0.5 }
    const trailerX = useSpring(mouseX, springConfig)
    const trailerY = useSpring(mouseY, springConfig)

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e
            mouseX.set(clientX)
            mouseY.set(clientY)

            // Rotate trailer based on movement direction
            if (trailerRef.current) {
                const deltaX = clientX - trailerX.get()
                const deltaY = clientY - trailerY.get()
                const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI)
                trailerRef.current.style.transform = `translate(${clientX}px, ${clientY}px) rotate(${angle}deg)`
            }
        }

        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [mouseX, mouseY, trailerX, trailerY])

    return (
        <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
            {/* Main Cursor Dot */}
            <motion.div
                ref={cursorRef}
                className="absolute w-3 h-3 bg-white rounded-full mix-blend-difference"
                style={{
                    x: mouseX,
                    y: mouseY,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
            />

            {/* Nebula/Stardust Trailer */}
            <motion.div
                ref={trailerRef}
                className="absolute w-32 h-32 opacity-30 mix-blend-screen"
                style={{
                    x: trailerX,
                    y: trailerY,
                    translateX: '-50%',
                    translateY: '-50%',
                    background: 'radial-gradient(circle, rgba(147, 51, 234, 0.5) 0%, rgba(59, 130, 246, 0.2) 50%, transparent 70%)',
                    filter: 'blur(10px)',
                }}
            >
                <div className="animate-spin-slow w-full h-full opacity-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            </motion.div>
        </div>
    )
}
