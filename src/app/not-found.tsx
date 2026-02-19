'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { StarryBackground } from '@/components/ui/StarryBackground'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black font-sans text-white">
            <StarryBackground />

            <div className="relative z-10 flex flex-col items-center text-center p-6">
                {/* Animated Glitch Effect */}
                <div className="relative mb-8">
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-[12rem] font-bold leading-none bg-gradient-to-b from-white to-white/10 bg-clip-text text-transparent select-none"
                    >
                        404
                    </motion.h1>
                    <motion.div
                        animate={{
                            opacity: [0, 0.5, 0],
                            x: [-10, 10, -5, 5, 0],
                            clipPath: ['inset(40% 0 61% 0)', 'inset(10% 0 10% 0)', 'inset(80% 0 5% 0)']
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "mirror",
                            times: [0, 0.2, 1]
                        }}
                        className="absolute inset-0 text-[12rem] font-bold leading-none text-red-500/50 mix-blend-screen pointer-events-none"
                    >
                        404
                    </motion.div>
                </div>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl md:text-4xl font-light tracking-wide mb-6"
                >
                    Signal Lost
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-white/40 max-w-md mb-12 text-lg"
                >
                    The coordinates you entered seem to lead to a black hole. Let's get you back to the known universe.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                >
                    <Link
                        href="/"
                        className="group relative inline-flex items-center gap-2 min-h-[44px] px-8 py-4 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-md"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform text-purple-400" />
                        <span>Return to Mission Control</span>
                        <div className="absolute inset-0 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.2)] group-hover:shadow-[0_0_40px_rgba(168,85,247,0.4)] transition-shadow duration-300" />
                    </Link>
                </motion.div>
            </div>

            {/* Decorative Planet */}
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-gradient-to-br from-purple-900/40 to-blue-900/10 rounded-full blur-3xl opacity-50" />
        </div>
    )
}
