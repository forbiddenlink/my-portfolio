'use client'

import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, PerformanceMonitor } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, DepthOfField, ChromaticAberration } from '@react-three/postprocessing'
import { useRef, useMemo, useState, useEffect, Suspense, useCallback } from 'react'
import * as THREE from 'three'
import { useViewStore, usePrefersReducedMotion } from '@/lib/store'
import { WebGPUCanvas } from '@/components/3d/WebGPUCanvas'
import { type RendererType } from '@/lib/webgpu'
import { TwinklingStarfield } from '@/components/3d/TwinklingStarfield'
import { NebulaBackground } from '@/components/3d/NebulaBackground'
import { EnhancedProjectStars } from '@/components/3d/EnhancedProjectStars'
import { ShootingStars } from '@/components/3d/ShootingStars'
import { InteractiveSpaceDust } from '@/components/3d/InteractiveSpaceDust'
import { getProjectById, galaxies } from '@/lib/galaxyData'
import { PlanetSurfaceExplorer } from '@/components/3d/PlanetSurfaceExplorer'
import { GalaxyNavigation } from '@/components/ui/GalaxyNavigation'
import { MobileGalaxyNav } from '@/components/ui/MobileGalaxyNav'
import { MotionToggle } from '@/components/ui/MotionToggle'
import { MinimapNavigator } from '@/components/ui/MinimapNavigator'
import { JourneyCameraController, JourneyOverlay } from '@/components/ui/JourneyMode'
import { TourElements } from '@/components/3d/TourElements'
import { GalaxyCores } from '@/components/3d/GalaxyCore'
import { PlanetEnhancements } from '@/components/3d/PlanetEnhancements'
import { ProjectRelationships } from '@/components/3d/ProjectRelationships'
import { CosmicComets } from '@/components/3d/CosmicComets'
import { AuroraRibbons } from '@/components/3d/AuroraRibbons'
import { CosmicJellyfish } from '@/components/3d/CosmicJellyfish'
import { Pulsars } from '@/components/3d/Pulsars'
import { SolarFlares } from '@/components/3d/SolarFlares'
import { BlendFunction } from 'postprocessing'
import { getGalaxyCenterPosition } from '@/lib/utils'

// Camera fly-to controller for galaxy navigation
function GalaxyCameraController({ controlsRef }: { controlsRef: React.RefObject<any> }) {
  const { camera } = useThree()
  const selectedGalaxy = useViewStore((state) => state.selectedGalaxy)
  const view = useViewStore((state) => state.view)

  // Animation state
  const isAnimating = useRef(false)
  const targetPosition = useRef(new THREE.Vector3(0, 20, 60))
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0))
  const animationProgress = useRef(0)
  const startPosition = useRef(new THREE.Vector3())
  const startLookAt = useRef(new THREE.Vector3())

  // Check for reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    }
  }, [])

  // Handle galaxy selection changes
  useEffect(() => {
    if (selectedGalaxy && view === 'galaxy') {
      const galaxyIndex = galaxies.findIndex(g => g.id === selectedGalaxy)
      if (galaxyIndex !== -1) {
        const [gx, gy, gz] = getGalaxyCenterPosition(galaxyIndex)

        // Set target position (camera offset from galaxy center)
        const cameraDistance = 35
        const cameraHeight = 15
        targetLookAt.current.set(gx, gy, gz)
        targetPosition.current.set(gx, gy + cameraHeight, gz + cameraDistance)

        // Store start position
        startPosition.current.copy(camera.position)
        startLookAt.current.set(0, 0, 0) // Current look target
        if (controlsRef.current) {
          startLookAt.current.copy(controlsRef.current.target)
        }

        // Start animation
        animationProgress.current = 0
        isAnimating.current = true
      }
    } else if (view === 'universe' && !selectedGalaxy) {
      // Zoom out to universe view
      targetPosition.current.set(0, 20, 60)
      targetLookAt.current.set(0, 0, 0)

      startPosition.current.copy(camera.position)
      if (controlsRef.current) {
        startLookAt.current.copy(controlsRef.current.target)
      }

      animationProgress.current = 0
      isAnimating.current = true
    }
  }, [selectedGalaxy, view, camera, controlsRef])

  // Animate camera
  useFrame((_, delta) => {
    if (!isAnimating.current) return

    // Easing function (ease-out cubic)
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

    // Animation speed (faster if reduced motion preferred)
    const speed = prefersReducedMotion ? 8 : 1.5
    animationProgress.current += delta * speed

    if (animationProgress.current >= 1) {
      animationProgress.current = 1
      isAnimating.current = false
    }

    const t = easeOutCubic(animationProgress.current)

    // Lerp camera position
    camera.position.lerpVectors(startPosition.current, targetPosition.current, t)

    // Update OrbitControls target for smooth lookAt
    if (controlsRef.current) {
      controlsRef.current.target.lerpVectors(startLookAt.current, targetLookAt.current, t)
      controlsRef.current.update()
    }
  })

  return null
}

function SceneContent({ isMobile, controlsRef }: { isMobile: boolean; controlsRef: React.RefObject<any> }) {
  const { camera } = useThree()
  const hasEntered = useViewStore((state) => state.hasEntered)
  const view = useViewStore((state) => state.view)
  const selectedProject = useViewStore((state) => state.selectedProject)
  const selectedGalaxy = useViewStore((state) => state.selectedGalaxy)
  const exitExploration = useViewStore((state) => state.exitExploration)
  const isJourneyMode = useViewStore((state) => state.isJourneyMode)

  const activeProject = selectedProject ? getProjectById(selectedProject) : null

  // Animate camera slightly for "breathing" effect and Entrance Zoom
  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    if (!hasEntered) {
      // Orbit slowly while waiting at a distance
      const radius = 120
      camera.position.x = Math.sin(time * 0.2) * radius
      camera.position.z = Math.cos(time * 0.2) * radius
      camera.position.y = 60
      camera.lookAt(0, 0, 0)
    }
    // Note: Breathing effect removed to avoid fighting with GalaxyCameraController
  })

  return (
    <>
      <color attach="background" args={['#000000']} />
      <fog attach="fog" args={['#000510', 180, 450]} />

      {/* Lights */}
      <ambientLight intensity={0.9} color="#0a0a15" />
      <pointLight position={[100, 100, 100]} intensity={2.0} color="#6d28d9" castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[-100, -100, -50]} intensity={1.5} color="#3b82f6" castShadow shadow-mapSize={[512, 512]} />
      <directionalLight position={[0, 50, 0]} intensity={0.8} color="#ffffff" castShadow />
      <hemisphereLight intensity={0.3} color="#8b5cf6" groundColor="#1e1b4b" />

      {/* Environment */}
      <Suspense fallback={null}>
        {view === 'exploration' && activeProject ? (
          <PlanetSurfaceExplorer
            project={activeProject}
            planetType={activeProject.size === 'supermassive' ? 'gas' : 'rocky'} // Simple logic for demo
            planetColor={activeProject.color}
            onExit={exitExploration}
          />
        ) : (
          <>
            <NebulaBackground />
            <TwinklingStarfield count={isMobile ? 2000 : 5000} />
            <GalaxyCores />
            <EnhancedProjectStars />
            <PlanetEnhancements />
            <ProjectRelationships />
            {!isMobile && (
              <>
                <ShootingStars count={isMobile ? 2 : 5} />
                <InteractiveSpaceDust count={isMobile ? 300 : 800} />
                <CosmicComets count={3} />
                <AuroraRibbons count={4} />
                <CosmicJellyfish count={4} />
                <Pulsars count={3} />
                <SolarFlares />
              </>
            )}
          </>
        )}
      </Suspense>

      {/* Tour interactive elements (aliens, stations, trail) */}
      <TourElements />

      {/* Journey Mode camera controller */}
      {isJourneyMode && <JourneyCameraController />}

      {/* OrbitControls - disabled during exploration and journey */}
      {view !== 'exploration' && !isJourneyMode && (
        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          minDistance={10}
          maxDistance={150}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI - Math.PI / 4}
          rotateSpeed={0.5}
          zoomSpeed={0.8}
          panSpeed={0.5}
          enableDamping
          dampingFactor={0.05}
          makeDefault
        />
      )}

      {/* Post Processing - Reduced for mobile */}
      {isMobile ? (
        <EffectComposer enableNormalPass={false}>
          <Bloom
            intensity={0.6}
            luminanceThreshold={0.35}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
          <Vignette
            offset={0.25}
            darkness={0.7}
            eskil={false}
            blendFunction={BlendFunction.NORMAL}
          />
        </EffectComposer>
      ) : (
        <EffectComposer enableNormalPass={false}>
          <Bloom
            intensity={1.2}
            luminanceThreshold={0.15}
            luminanceSmoothing={0.9}
            radius={0.9}
            mipmapBlur
          />
          <ChromaticAberration
            blendFunction={BlendFunction.NORMAL}
            offset={new THREE.Vector2(0.0008, 0.0008)}
            radialModulation={true}
            modulationOffset={0.3}
          />
          <Vignette
            offset={0.2}
            darkness={0.7}
            eskil={false}
            blendFunction={BlendFunction.NORMAL}
          />
        </EffectComposer>
      )}
    </>
  )
}

// Wrapper component to provide controlsRef inside Canvas
function SceneWrapper({ isMobile }: { isMobile: boolean }) {
  const controlsRef = useRef<any>(null)

  return (
    <>
      <PerformanceMonitor onDecline={() => {}} />
      <SceneContent isMobile={isMobile} controlsRef={controlsRef} />
      <GalaxyCameraController controlsRef={controlsRef} />
    </>
  )
}

export default function GalaxyScene() {
  const [dpr, setDpr] = useState(1)
  const [isMobile, setIsMobile] = useState(false)
  const [rendererType, setRendererType] = useState<RendererType | null>(null)

  useEffect(() => {
    // Basic mobile check
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      // Use full device pixel ratio for sharp rendering
      setDpr(Math.min(window.devicePixelRatio, mobile ? 2 : 3))
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Callback when renderer is ready
  const handleRendererReady = useCallback((type: RendererType) => {
    setRendererType(type)
  }, [])

  // Static fallback for browsers without WebGL support
  const WebGLFallback = (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-black via-indigo-950 to-black">
      <div className="text-center p-8 max-w-lg">
        <div className="text-6xl mb-4">*</div>
        <h2 className="text-2xl font-bold text-white mb-4">Welcome to My Portfolio</h2>
        <p className="text-gray-300 mb-6">
          This experience is best viewed in a browser with WebGL support.
          Please try Chrome, Firefox, Safari, or Edge for the full 3D experience.
        </p>
        <a
          href="/work"
          className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        >
          View Projects
        </a>
      </div>
    </div>
  )

  // Loading state while checking WebGPU support
  const LoadingFallback = (
    <div className="w-full h-full flex items-center justify-center bg-black">
      <div className="text-white/50 text-sm">Initializing 3D renderer...</div>
    </div>
  )

  return (
    <div className="w-full h-screen relative">
      <WebGPUCanvas
        dpr={dpr}
        className="w-full h-full block"
        rendererConfig={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.4,
          outputColorSpace: THREE.SRGBColorSpace
        }}
        camera={{ position: [0, 20, 60], fov: 45 }}
        fallback={WebGLFallback}
        loadingFallback={LoadingFallback}
        onRendererReady={handleRendererReady}
        showRendererIndicator={process.env.NODE_ENV === 'development'}
      >
        <SceneWrapper isMobile={isMobile} />
      </WebGPUCanvas>

      <GalaxyNavigation />
      <MobileGalaxyNav />
      <MotionToggle />
      <MinimapNavigator />
      <JourneyOverlay />
    </div>
  )
}
