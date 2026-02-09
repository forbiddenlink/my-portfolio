'use client'

import { useEffect, useRef } from 'react'

interface GenerativeHeroProps {
    name: string
    color: string
}

export function GenerativeHero({ name, color }: GenerativeHeroProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Set resolution
        const dpr = window.devicePixelRatio || 1
        const rect = canvas.getBoundingClientRect()
        canvas.width = rect.width * dpr
        canvas.height = rect.height * dpr
        ctx.scale(dpr, dpr)

        // Clear
        ctx.fillStyle = '#111018' // Dark blueprint bg base - matching parent bg/opacity
        ctx.clearRect(0, 0, rect.width, rect.height)

        // Seed logic (simple hash from name)
        const seed = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)

        // Helper random seeded (pseudo)
        let currentSeed = seed
        const random = () => {
            const x = Math.sin(currentSeed++) * 10000
            return x - Math.floor(x)
        }

        // Grid properties
        const gridSize = 40
        const cols = Math.ceil(rect.width / gridSize)
        const rows = Math.ceil(rect.height / gridSize)

        // Draw Grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)'
        ctx.lineWidth = 1

        // Vertical lines
        for (let i = 0; i < cols; i++) {
            ctx.beginPath()
            ctx.moveTo(i * gridSize, 0)
            ctx.lineTo(i * gridSize, rect.height)
            ctx.stroke()
        }
        // Horizontal lines
        for (let i = 0; i < rows; i++) {
            ctx.beginPath()
            ctx.moveTo(0, i * gridSize)
            ctx.lineTo(rect.width, i * gridSize)
            ctx.stroke()
        }

        // Draw "Data Points" and "Connections"
        const points: { x: number, y: number }[] = []
        const numPoints = 15 + Math.floor(random() * 10)

        for (let i = 0; i < numPoints; i++) {
            points.push({
                x: (Math.floor(random() * (cols - 4)) + 2) * gridSize, // Snap to grid
                y: (Math.floor(random() * (rows - 4)) + 2) * gridSize
            })
        }

        // Draw Connections
        ctx.strokeStyle = `${color}40` // Low opacity hex
        ctx.lineWidth = 1.5
        ctx.beginPath()
        points.forEach((p, i) => {
            if (i === 0) ctx.moveTo(p.x, p.y)
            else ctx.lineTo(p.x, p.y)
        })
        ctx.stroke()

        // Draw Nodes
        points.forEach(p => {
            ctx.beginPath()
            ctx.arc(p.x, p.y, 4, 0, Math.PI * 2)
            ctx.fillStyle = color
            ctx.fill()

            // Glow
            ctx.beginPath()
            ctx.arc(p.x, p.y, 12, 0, Math.PI * 2)
            ctx.fillStyle = `${color}20`
            ctx.fill()
        })

        // Draw "Schematic Details" (circles, arcs)
        const numShapes = 3
        for (let i = 0; i < numShapes; i++) {
            const cx = rect.width / 2 + (random() - 0.5) * rect.width * 0.5
            const cy = rect.height / 2 + (random() - 0.5) * rect.height * 0.5
            const radius = 50 + random() * 100

            ctx.beginPath()
            ctx.arc(cx, cy, radius, random() * Math.PI, random() * Math.PI + Math.PI)
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
            ctx.lineWidth = 1
            ctx.setLineDash([5, 5])
            ctx.stroke()
            ctx.setLineDash([])
        }

        // Add "Tech details" text
        ctx.font = '10px monospace'
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
        ctx.fillText(`ID: ${seed.toString(16).toUpperCase()}`, 20, rect.height - 20)
        ctx.fillText(`SYS: ${name.toUpperCase().substring(0, 12)}`, 20, rect.height - 35)

    }, [name, color])

    return (
        <canvas
            ref={canvasRef}
            className="w-full h-full object-cover opacity-60 mix-blend-screen"
        />
    )
}
