'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useViewStore } from '@/lib/store'
import { ArrowRight, Sparkles } from 'lucide-react'

// Seeded random for consistent star positions (fixes hydration mismatch)
function seededRandom(seed: number) {
    const x = Math.sin(seed * 9999) * 10000
    return x - Math.floor(x)
}

// Generate star particles for background
function StarParticles() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const stars = useMemo(() =>
        Array.from({ length: 100 }, (_, i) => ({
            id: i,
            x: seededRandom(i * 1) * 100,
            y: seededRandom(i * 2) * 100,
            size: seededRandom(i * 3) * 2 + 0.5,
            delay: seededRandom(i * 4) * 3,
            duration: 2 + seededRandom(i * 5) * 3,
        })), []
    )

    if (!mounted) return null

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {stars.map((star) => (
                <motion.div
                    key={star.id}
                    className="absolute rounded-full bg-white"
                    style={{
                        left: `${star.x}%`,
                        top: `${star.y}%`,
                        width: star.size,
                        height: star.size,
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                        opacity: [0, 1, 0.5, 1, 0],
                        scale: [0, 1, 0.8, 1, 0],
                    }}
                    transition={{
                        duration: star.duration,
                        delay: star.delay,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            ))}
        </div>
    )
}

// Animated letter component
function AnimatedLetter({ char, index, total }: { char: string; index: number; total: number }) {
    return (
        <motion.span
            className="inline-block"
            initial={{ opacity: 0, y: 50, rotateX: -90 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{
                duration: 0.6,
                delay: 0.5 + index * 0.05,
                ease: [0.22, 1, 0.36, 1],
            }}
        >
            {char === ' ' ? '\u00A0' : char}
        </motion.span>
    )
}

export function Entrance() {
    const hasEntered = useViewStore((state) => state.hasEntered)
    const enter = useViewStore((state) => state.enter)
    const [isEntering, setIsEntering] = useState(false)

    const handleEnter = () => {
        setIsEntering(true)
        setTimeout(() => {
            enter()
        }, 1200)
    }

    const firstName = 'ELIZABETH'
    const lastName = 'STEIN'

    return (
        <AnimatePresence>
            {!hasEntered && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        scale: 1.2,
                        filter: 'blur(30px)',
                    }}
                    transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
                    className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden"
                >
                    {/* Animated star particles */}
                    <StarParticles />

                    {/* Multiple gradient layers for depth */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-950/40 via-purple-950/20 to-transparent" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(99,102,241,0.05)_60deg,transparent_120deg)] pointer-events-none" />

                    {/* Animated rings */}
                    <motion.div
                        className="absolute w-[600px] h-[600px] md:w-[800px] md:h-[800px] rounded-full border border-white/5"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                    />
                    <motion.div
                        className="absolute w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full border border-white/5"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
                    />
                    <motion.div
                        className="absolute w-[200px] h-[200px] md:w-[400px] md:h-[400px] rounded-full border border-indigo-500/10"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                    />

                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center text-center space-y-10 px-4">
                        {/* Subtitle */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="flex items-center justify-center gap-3 text-indigo-400/80"
                        >
                            <motion.div
                                animate={{ rotate: [0, 15, -15, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                <Sparkles className="w-4 h-4" />
                            </motion.div>
                            <span className="text-xs tracking-[0.3em] font-light uppercase">
                                Interactive Portfolio Experience
                            </span>
                            <motion.div
                                animate={{ rotate: [0, -15, 15, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                <Sparkles className="w-4 h-4" />
                            </motion.div>
                        </motion.div>

                        {/* Main title with letter animation */}
                        <div className="space-y-4">
                            <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter">
                                <div className="overflow-hidden flex items-center justify-center gap-4">
                                    {/* Decorative star icon */}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0, rotate: -180 }}
                                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                        transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                        className="relative w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 flex-shrink-0"
                                    >
                                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 to-indigo-600 animate-pulse" />
                                        <div className="absolute inset-1 rounded-full bg-gradient-to-br from-fuchsia-300 to-purple-500" />
                                        <div className="absolute inset-[6px] rounded-full bg-white/80" />
                                        <motion.div
                                            className="absolute inset-0 rounded-full border-2 border-purple-400/50"
                                            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        />
                                    </motion.div>
                                    <span className="bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                                        {firstName.split('').map((char, i) => (
                                            <AnimatedLetter key={i} char={char} index={i} total={firstName.length} />
                                        ))}
                                    </span>
                                </div>
                                <div className="overflow-hidden">
                                    <span className="bg-gradient-to-r from-purple-200 via-white to-purple-200 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                                        {lastName.split('').map((char, i) => (
                                            <AnimatedLetter key={i} char={char} index={firstName.length + i} total={lastName.length} />
                                        ))}
                                    </span>
                                </div>
                            </h1>

                            {/* Enhanced gradient line under name */}
                            <motion.div
                                initial={{ scaleX: 0, opacity: 0 }}
                                animate={{ scaleX: 1, opacity: 1 }}
                                transition={{ duration: 1, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
                                className="h-[3px] w-full max-w-lg mx-auto bg-gradient-to-r from-transparent via-purple-500 to-transparent shadow-[0_0_20px_rgba(168,85,247,0.5)]"
                            />
                        </div>

                        {/* Tagline */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 1.5 }}
                            className="text-white/50 text-base md:text-xl font-light tracking-wide max-w-lg mx-auto leading-relaxed"
                        >
                            Designing immersive digital universes
                            <br />
                            <span className="text-indigo-400/70">and intelligent systems</span>
                        </motion.p>

                        {/* Enter button */}
                        <motion.button
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{
                                scale: 1.05,
                                boxShadow: '0 0 40px rgba(99, 102, 241, 0.4)',
                            }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ duration: 0.5, delay: 1.8 }}
                            onClick={handleEnter}
                            disabled={isEntering}
                            className="group relative mt-4 px-14 py-6 md:px-16 md:py-7 bg-gradient-to-r from-indigo-600/30 to-purple-600/30 border-2 border-indigo-500/40 hover:border-indigo-400/60 rounded-full backdrop-blur-xl overflow-hidden transition-all duration-500 shadow-2xl shadow-indigo-500/20"
                        >
                            {/* Animated border glow */}
                            <motion.div
                                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                style={{
                                    background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.3), transparent)',
                                    backgroundSize: '200% 100%',
                                }}
                                animate={{
                                    backgroundPosition: ['200% 0', '-200% 0'],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: 'linear',
                                }}
                            />

                            {/* Button content */}
                            <span className="relative z-10 flex items-center gap-4 text-white font-semibold tracking-[0.15em] text-sm md:text-base">
                                {isEntering ? (
                                    <motion.span
                                        animate={{ opacity: [1, 0.5, 1] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                    >
                                        LAUNCHING...
                                    </motion.span>
                                ) : (
                                    <>
                                        ENTER UNIVERSE
                                        <motion.div
                                            animate={{ x: [0, 5, 0] }}
                                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                                        >
                                            <ArrowRight className="w-5 h-5" />
                                        </motion.div>
                                    </>
                                )}
                            </span>
                        </motion.button>
                    </div>

                    {/* Bottom decorative elements */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 2 }}
                        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
                    >
                        <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                            className="w-[1px] h-12 bg-gradient-to-b from-transparent to-white/30"
                        />
                        <span className="text-[10px] tracking-[0.4em] text-white/30 uppercase">
                            Click to enter
                        </span>
                        {/* Skip intro for recruiters */}
                        <button
                            onClick={handleEnter}
                            className="text-[10px] tracking-[0.2em] text-white/20 hover:text-white/50 transition-colors uppercase mt-2"
                        >
                            Skip to portfolio →
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
