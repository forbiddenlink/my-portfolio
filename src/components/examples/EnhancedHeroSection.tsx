'use client'

import { motion } from 'framer-motion'
import { SplitText, SplitWords } from '@/components/ui/SplitText'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { easings, animationPresets } from '@/lib/easings'

/**
 * Example: Enhanced Hero Section
 * 
 * A beautiful hero section with smooth text animations and magnetic buttons.
 * This demonstrates the motion design principles from top portfolios.
 */
export function EnhancedHeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />
      
      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Main title with character-by-character reveal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
            <SplitText delay={0.5}>
              Elizabeth Stein
            </SplitText>
          </h1>
        </motion.div>

        {/* Subtitle with word-by-word reveal */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-4xl text-white/80 font-light">
            <SplitWords delay={1.2}>
              Full-Stack Developer & AI Integration Specialist
            </SplitWords>
          </h2>
        </div>

        {/* Description with smooth fade */}
        <ScrollReveal direction="up" delay={1.8}>
          <p className="text-lg md:text-xl text-white/60 max-w-3xl mx-auto mb-12 leading-relaxed">
            Crafting exceptional digital experiences across 30+ projects.
            Specializing in React, Next.js, Three.js, and AI-powered applications.
          </p>
        </ScrollReveal>

        {/* CTA Buttons with magnetic effect */}
        <motion.div
          className="flex flex-wrap gap-6 justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: 2.2,
            duration: 0.8,
            ease: easings.easeOutExpo
          }}
        >
          <MagneticButton
            strength={0.5}
            tiltStrength={15}
            glowOnHover={true}
            href="/work"
          >
            <span className="inline-block px-8 py-4 bg-purple-600 rounded-full font-semibold text-lg hover:bg-purple-500 transition-colors">
              View My Work
            </span>
          </MagneticButton>

          <MagneticButton
            strength={0.3}
            tiltStrength={10}
            href="/contact"
          >
            <span className="inline-block px-8 py-4 border-2 border-white/20 rounded-full font-semibold text-lg hover:border-white/40 hover:bg-white/5 transition-all">
              Get in Touch
            </span>
          </MagneticButton>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: 2.8,
            duration: 0.6,
            ease: easings.easeOutQuint
          }}
        >
          <motion.div
            className="w-6 h-10 border-2 border-white/30 rounded-full p-1"
            animate={{ y: [0, 8, 0] }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: easings.easeInOutCubic
            }}
          >
            <motion.div className="w-1 h-2 bg-white/50 rounded-full mx-auto" />
          </motion.div>
          <p className="text-xs text-white/40 mt-2">Scroll to explore</p>
        </motion.div>
      </div>

      {/* Decorative gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
    </section>
  )
}

/**
 * Usage:
 * 
 * import { EnhancedHeroSection } from '@/components/examples/EnhancedHeroSection'
 * 
 * export default function HomePage() {
 *   return (
 *     <main>
 *       <EnhancedHeroSection />
 *       {/* Rest of your page *\/}
 *     </main>
 *   )
 * }
 */
