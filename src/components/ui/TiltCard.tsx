'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TiltCardProps {
    children: React.ReactNode
    className?: string
}

function usePrefersReducedMotion() {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
        setPrefersReducedMotion(mediaQuery.matches)

        const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
        mediaQuery.addEventListener('change', handler)
        return () => mediaQuery.removeEventListener('change', handler)
    }, [])

    return prefersReducedMotion
}

export function TiltCard({ children, className }: TiltCardProps) {
    const ref = useRef<HTMLDivElement>(null)
    const [hovered, setHovered] = useState(false)
    const prefersReducedMotion = usePrefersReducedMotion()

    const x = useMotionValue(0)
    const y = useMotionValue(0)

    // Spring physics for smooth tilt (disabled if user prefers reduced motion)
    const springConfig = { damping: 15, stiffness: 150, mass: 0.5 }
    const rotateX = useSpring(useTransform(y, [-0.5, 0.5], prefersReducedMotion ? [0, 0] : [10, -10]), springConfig)
    const rotateY = useSpring(useTransform(x, [-0.5, 0.5], prefersReducedMotion ? [0, 0] : [-10, 10]), springConfig)
    const scale = useSpring(hovered && !prefersReducedMotion ? 1.05 : 1, springConfig)

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return
        const rect = ref.current.getBoundingClientRect()

        // Calculate normalized mouse position (-0.5 to 0.5)
        // 0,0 is center of card
        const normalizedX = (e.clientX - rect.left) / rect.width - 0.5
        const normalizedY = (e.clientY - rect.top) / rect.height - 0.5

        x.set(normalizedX)
        y.set(normalizedY)
    }

    const handleMouseLeave = () => {
        setHovered(false)
        x.set(0)
        y.set(0)
    }

    return (
        <motion.div
            ref={ref}
            className={cn("relative preserve-3d py-2", className)}
            style={{
                rotateX,
                rotateY,
                scale,
                transformStyle: 'preserve-3d',
                perspective: 1000,
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={handleMouseLeave}
        >
            <div
                className={cn(
                    "relative h-full transition-shadow duration-300 rounded-2xl overflow-hidden",
                    hovered ? "shadow-2xl shadow-purple-500/20" : "shadow-lg"
                )}
                style={{ transform: 'translateZ(20px)' }}
            >
                {children}

                {/* Specular Sheen / Reflection */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300"
                    style={{
                        opacity: hovered ? 1 : 0,
                        background: `radial-gradient(circle at ${x.get() * 100 + 50}% ${y.get() * 100 + 50}%, rgba(255,255,255,0.2) 0%, transparent 60%)`,
                        mixBlendMode: 'overlay',
                    }}
                />
            </div>
        </motion.div>
    )
}
