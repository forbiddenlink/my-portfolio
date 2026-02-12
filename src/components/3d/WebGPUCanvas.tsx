'use client'

import { Canvas, extend, type CanvasProps } from '@react-three/fiber'
import { useState, useEffect, useCallback, type ReactNode } from 'react'
import * as THREE from 'three'
import { checkWebGPUSupport, type RendererType } from '@/lib/webgpu'

interface RendererConfig {
  antialias?: boolean
  alpha?: boolean
  powerPreference?: 'default' | 'high-performance' | 'low-power'
  toneMapping?: THREE.ToneMapping
  toneMappingExposure?: number
  outputColorSpace?: THREE.ColorSpace
}

interface WebGPUCanvasProps extends Omit<CanvasProps, 'gl'> {
  children: ReactNode
  /** Callback when renderer type is determined */
  onRendererReady?: (type: RendererType) => void
  /** Show a small debug indicator of which renderer is active */
  showRendererIndicator?: boolean
  /** Renderer configuration options (applied to both WebGPU and WebGL) */
  rendererConfig?: RendererConfig
  /** Fallback component while checking WebGPU support */
  loadingFallback?: ReactNode
}

/**
 * Canvas component with automatic WebGPU/WebGL fallback.
 *
 * Uses WebGPU when available (Chrome, Edge, Safari 26+) for better performance.
 * Falls back to WebGL2 for unsupported browsers (Firefox, older browsers).
 */
export function WebGPUCanvas({
  children,
  onRendererReady,
  showRendererIndicator = false,
  rendererConfig = {},
  loadingFallback,
  ...canvasProps
}: WebGPUCanvasProps) {
  const [rendererType, setRendererType] = useState<RendererType | null>(null)
  const [isChecking, setIsChecking] = useState(true)

  // Default renderer configuration
  const config: Required<RendererConfig> = {
    antialias: rendererConfig.antialias ?? true,
    alpha: rendererConfig.alpha ?? false,
    powerPreference: rendererConfig.powerPreference ?? 'high-performance',
    toneMapping: rendererConfig.toneMapping ?? THREE.ACESFilmicToneMapping,
    toneMappingExposure: rendererConfig.toneMappingExposure ?? 1.0,
    outputColorSpace: rendererConfig.outputColorSpace ?? THREE.SRGBColorSpace,
  }

  // Check WebGPU support on mount
  useEffect(() => {
    let mounted = true

    async function checkSupport() {
      const hasWebGPU = await checkWebGPUSupport()
      if (mounted) {
        const type: RendererType = hasWebGPU ? 'webgpu' : 'webgl'
        setRendererType(type)
        setIsChecking(false)
        onRendererReady?.(type)

        if (process.env.NODE_ENV === 'development') {
          console.log(`[WebGPUCanvas] Using ${type.toUpperCase()} renderer`)
        }
      }
    }

    checkSupport()

    return () => {
      mounted = false
    }
  }, [onRendererReady])

  // WebGPU renderer factory
  const createWebGPURenderer = useCallback(async (props: THREE.WebGLRendererParameters) => {
    // Dynamically import WebGPU module
    const THREE_WEBGPU = await import('three/webgpu')

    // Extend R3F with WebGPU types
    extend(THREE_WEBGPU as any)

    // Create WebGPU renderer
    const renderer = new THREE_WEBGPU.WebGPURenderer({
      ...props,
      antialias: config.antialias,
      powerPreference: config.powerPreference,
    } as any)

    // Initialize WebGPU renderer (required before first render)
    await renderer.init()

    // Apply tone mapping settings
    renderer.toneMapping = config.toneMapping
    renderer.toneMappingExposure = config.toneMappingExposure
    renderer.outputColorSpace = config.outputColorSpace

    return renderer
  }, [config.antialias, config.powerPreference, config.toneMapping, config.toneMappingExposure, config.outputColorSpace])

  // WebGL renderer configuration (fallback)
  const createWebGLConfig = useCallback(() => ({
    antialias: config.antialias,
    alpha: config.alpha,
    powerPreference: config.powerPreference,
    toneMapping: config.toneMapping,
    toneMappingExposure: config.toneMappingExposure,
    outputColorSpace: config.outputColorSpace,
  }), [config])

  // Show loading state while checking support
  if (isChecking) {
    return loadingFallback || null
  }

  // Configure gl prop based on renderer type
  const glConfig = rendererType === 'webgpu'
    ? async (props: THREE.WebGLRendererParameters) => {
        try {
          return await createWebGPURenderer(props)
        } catch (error) {
          // If WebGPU initialization fails, fall back to WebGL
          console.warn('[WebGPUCanvas] WebGPU initialization failed, falling back to WebGL:', error)
          setRendererType('webgl')
          // Return undefined to use default WebGL renderer with config
          return undefined as any
        }
      }
    : createWebGLConfig()

  return (
    <>
      <Canvas
        {...canvasProps}
        gl={glConfig}
      >
        {children}
      </Canvas>
      {showRendererIndicator && rendererType && (
        <RendererIndicator type={rendererType} />
      )}
    </>
  )
}

/**
 * Small indicator showing which renderer is active.
 * Hidden by default, enable with showRendererIndicator prop.
 */
function RendererIndicator({ type }: { type: RendererType }) {
  const [isVisible, setIsVisible] = useState(true)

  // Auto-hide after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div
      className="fixed bottom-4 right-4 z-50 px-3 py-1.5 rounded-full text-xs font-mono backdrop-blur-sm transition-opacity duration-300"
      style={{
        background: type === 'webgpu'
          ? 'rgba(34, 197, 94, 0.2)'
          : 'rgba(59, 130, 246, 0.2)',
        color: type === 'webgpu' ? '#22c55e' : '#3b82f6',
        border: `1px solid ${type === 'webgpu' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
      }}
    >
      {type === 'webgpu' ? 'WebGPU' : 'WebGL2'}
    </div>
  )
}

export default WebGPUCanvas
