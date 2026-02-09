'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Suspense } from 'react'
import { useViewStore } from '@/lib/store'
import { DeepLinkHandler } from '@/components/ui/DeepLinkHandler'
import { KeyboardNavigation } from '@/components/ui/KeyboardNavigation'
import { PerformanceMonitor } from '@/components/ui/PerformanceMonitor'
import { KeyboardShortcutsHelp } from '@/components/ui/KeyboardShortcutsHelp'
import { CustomCursor } from '@/components/ui/CustomCursor'
import { AnimatedText, FadeIn } from '@/components/ui/AnimatedText'
import { InteractiveParticles } from '@/components/ui/InteractiveParticles'
import { RippleEffect } from '@/components/ui/RippleEffect'
import { SoundManager } from '@/components/ui/SoundManager'
import { TouchGestures } from '@/components/ui/TouchGestures'
import { GlowOrb } from '@/components/ui/FloatingElement'
import { ContactSection } from '@/components/ui/ContactSection'
import { ResumeDownload } from '@/components/ui/ResumeDownload'
import { Entrance } from '@/components/ui/Entrance'
import { LoadingProgress } from '@/components/ui/LoadingProgress'
import { StatsBar } from '@/components/ui/StatsBar'
import { ScreenReaderAnnouncer } from '@/components/ui/ScreenReaderAnnouncer'

// Lazy load 3D scene - critical for < 200KB landing bundle
const GalaxyScene = dynamic(() => import('@/components/3d/GalaxyScene'), {
  ssr: false,
  loading: () => <LoadingProgress />,
})
// Lazy load heavy/modal components for better initial load
const CommandPalette = dynamic(() => import('@/components/ui/CommandPalette').then(m => ({ default: m.CommandPalette })), { ssr: false })
const ProjectModal = dynamic(() => import('@/components/ui/ProjectModal').then(m => ({ default: m.ProjectModal })), { ssr: false })
const GalaxyGuide = dynamic(() => import('@/components/ui/GalaxyGuide').then(m => ({ default: m.GalaxyGuide })), { ssr: false })
const ExplorationOverlay = dynamic(() => import('@/components/ui/ExplorationOverlay').then(m => ({ default: m.ExplorationOverlay })), { ssr: false })
const SpotlightCursor = dynamic(() => import('@/components/ui/SpotlightCursor').then(m => ({ default: m.SpotlightCursor })), { ssr: false })
const ParticleTrail = dynamic(() => import('@/components/ui/ParticleTrail').then(m => ({ default: m.ParticleTrail })), { ssr: false })
const MorphingShape = dynamic(() => import('@/components/ui/MorphingShape').then(m => ({ default: m.MorphingShape })), { ssr: false })


export default function HomePage() {
  const isJourneyMode = useViewStore((state) => state.isJourneyMode)

  return (
    <main className="relative w-full h-screen overflow-hidden bg-black">
      {/* Skip Link for Accessibility */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-lg focus:font-medium">
        Skip to main content
      </a>

      {/* Fullscreen 3D Scene - MUST BE FIRST for proper z-index */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <GalaxyScene />
      </div>

      {/* Custom Cursor - Decorative */}
      <div aria-hidden="true">
        <CustomCursor />
      </div>

      {/* Decorative Visual Effects */}
      <div aria-hidden="true">
        <SpotlightCursor />
        <ParticleTrail />
      </div>

      {/* Ripple Effect */}
      <RippleEffect />

      {/* Sound Manager */}
      <SoundManager />

      {/* Touch Gestures */}
      <TouchGestures />

      {/* Command Palette (CMD+K) */}
      <CommandPalette />

      {/* Exploration Mode Overlay */}
      <ExplorationOverlay />

      {/* Contact & Social Links */}
      <ContactSection />

      {/* Resume Download */}
      <ResumeDownload />

      {/* Hidden handlers */}
      <Suspense fallback={null}>
        <DeepLinkHandler />
        <ProjectModal />
      </Suspense>
      <KeyboardNavigation />
      <ScreenReaderAnnouncer />
      <PerformanceMonitor />
      <KeyboardShortcutsHelp />

      {/* Decorative Background Elements */}
      <div aria-hidden="true">
        <MorphingShape />
        {/* Ambient Glow Orbs - Responsive sizing */}
        <div className="hidden md:block">
          <GlowOrb color="#6366F1" size={300} x={20} y={30} />
          <GlowOrb color="#A855F7" size={250} x={80} y={60} />
          <GlowOrb color="#EC4899" size={200} x={50} y={80} />
        </div>
        <div className="md:hidden">
          <GlowOrb color="#6366F1" size={120} x={15} y={25} />
          <GlowOrb color="#A855F7" size={100} x={85} y={55} />
          <GlowOrb color="#EC4899" size={80} x={50} y={80} />
        </div>
      </div>

      {/* Interactive Particles Layer */}
      <InteractiveParticles count={50} />

      {/* Header Overlay - Top Left (hidden during tour) */}
      <header id="main-content" tabIndex={-1} className={`absolute top-4 left-4 md:top-10 md:left-10 z-10 pointer-events-none transition-opacity duration-500 ${isJourneyMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="glass-card rounded-2xl p-4 md:p-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 tracking-tight leading-tight drop-shadow-2xl flex items-center gap-3 md:gap-4">
            {/* Star icon */}
            <span className="relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex-shrink-0 inline-flex items-center justify-center">
              <span className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 to-indigo-600 animate-pulse" />
              <span className="absolute inset-1 rounded-full bg-gradient-to-br from-fuchsia-300 to-purple-500" />
              <span className="absolute inset-[5px] rounded-full bg-white/80" />
            </span>
            <span className="bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent">
              <AnimatedText type="chars" stagger={0.05}>
                Elizabeth Stein
              </AnimatedText>
            </span>
          </h1>
          <FadeIn delay={0.8} direction="up">
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/95 max-w-xl leading-relaxed mb-4 drop-shadow-lg">
              Full-stack developer + design systems + AI integration
            </p>
            <Link
              href="/about"
              className="pointer-events-auto inline-block text-sm text-white/70 hover:text-white transition-colors duration-200 underline underline-offset-4 drop-shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/50 rounded"
            >
              More about me →
            </Link>
            <StatsBar />
          </FadeIn>
        </div>
      </header>

      {/* Quick Actions - Bottom Left (offset on lg to avoid GalaxyNavigation, hidden during tour) */}
      <FadeIn delay={1.2} direction="up" className={`absolute bottom-4 left-4 right-4 md:bottom-10 md:left-10 lg:left-[240px] md:right-auto z-10 flex flex-col md:flex-row flex-wrap gap-3 md:gap-4 items-stretch md:items-center transition-opacity duration-500 ${isJourneyMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <Link
          href="/work"
          className="ripple-button group w-full md:w-auto md:min-w-[200px] rounded-xl bg-white/15 backdrop-blur-xl border border-white/30 text-white font-semibold hover:bg-white/25 hover:border-white/40 transition-all duration-300 shadow-2xl hover:shadow-white/20 hover:scale-105 pointer-events-auto flex items-center justify-center gap-3 px-6 py-4 md:px-8"
        >
          <span className="whitespace-nowrap leading-none">View all work</span>
          <span className="inline-block transition-transform group-hover:translate-x-1 leading-none">→</span>
        </Link>
      </FadeIn>

      {/* AI Galaxy Guide */}
      <GalaxyGuide />

      {/* Instructions - Bottom Right (hidden on mobile and during tour) */}
      <FadeIn delay={1.4} direction="left" className={`hidden md:block absolute bottom-10 right-10 z-10 transition-opacity duration-500 ${isJourneyMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <nav aria-label="Keyboard shortcuts" className="glass-card rounded-2xl p-6 text-right text-sm text-white space-y-3 font-medium max-w-xs">
          <p className="flex items-center justify-end gap-2.5">
            <span className="text-white/60 text-base" aria-hidden="true">✨</span>
            <span className="drop-shadow-md">Click stars to explore projects</span>
          </p>
          <p className="flex items-center justify-end gap-2.5">
            <span className="text-white/60 text-base" aria-hidden="true">⌨️</span>
            <span className="drop-shadow-md">Arrow keys to navigate</span>
          </p>
          <p className="flex items-center justify-end gap-2.5">
            <kbd className="text-white/60 text-xs bg-white/10 px-1.5 py-0.5 rounded">1-6</kbd>
            <span className="drop-shadow-md">Jump to galaxy</span>
          </p>
          <p className="flex items-center justify-end gap-2.5">
            <kbd className="text-white/60 text-xs bg-white/10 px-1.5 py-0.5 rounded">ESC</kbd>
            <span className="drop-shadow-md">Zoom out</span>
            <span className="text-white/40">•</span>
            <kbd className="text-white/60 text-xs bg-white/10 px-1.5 py-0.5 rounded">H</kbd>
            <span className="drop-shadow-md">Home</span>
          </p>
        </nav>
      </FadeIn>
      {/* Entrance Overlay - MUST BE LAST to sit on top of everything until dismissed */}
      <Entrance />
    </main>
  )
}
