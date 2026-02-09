'use client'

import { useEffect, useState, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

export function WarpTransition() {
    const pathname = usePathname()
    const [isActive, setIsActive] = useState(false)
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        // Trigger warp when pathname changes
        setIsActive(true)
        const timeout = setTimeout(() => setIsActive(false), 1000)
        return () => clearTimeout(timeout)
    }, [pathname])

    useEffect(() => {
        if (!isActive || !canvasRef.current) return

        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        const stars = Array.from({ length: 200 }).map(() => ({
            x: Math.random() * canvas.width - canvas.width / 2,
            y: Math.random() * canvas.height - canvas.height / 2,
            z: Math.random() * 1000,
        }))

        let animationFrame: number

        const render = () => {
            ctx.fillStyle = 'black'
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            const cx = canvas.width / 2
            const cy = canvas.height / 2

            ctx.fillStyle = 'white'

            stars.forEach((star) => {
                star.z -= 20 // Speed
                if (star.z <= 0) {
                    star.x = Math.random() * canvas.width - canvas.width / 2
                    star.y = Math.random() * canvas.height - canvas.height / 2
                    star.z = 1000
                }

                const x = (star.x / star.z) * 1000 + cx
                const y = (star.y / star.z) * 1000 + cy
                const size = (1 - star.z / 1000) * 4

                ctx.beginPath()
                ctx.arc(x, y, size, 0, Math.PI * 2)
                ctx.fill()
            })

            animationFrame = requestAnimationFrame(render)
        }

        render()

        return () => cancelAnimationFrame(animationFrame)
    }, [isActive])

    return (
        <AnimatePresence>
            {isActive && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[10000] pointer-events-none"
                >
                    <canvas ref={canvasRef} className="w-full h-full" />
                </motion.div>
            )}
        </AnimatePresence>
    )
}
