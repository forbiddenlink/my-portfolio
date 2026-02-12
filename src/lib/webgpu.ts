/**
 * WebGPU Detection and Renderer Configuration
 *
 * WebGPU provides 20-30% performance boost over WebGL.
 * Supported in Chrome, Edge, and Safari 26+ (September 2025).
 * Falls back to WebGL2 for Firefox and older browsers.
 */

export type RendererType = 'webgpu' | 'webgl'

// Cache the result to avoid repeated checks
let cachedSupport: boolean | null = null
let supportPromise: Promise<boolean> | null = null

/**
 * Check if WebGPU is supported in the current browser.
 * This performs an async check to request an adapter.
 */
export async function checkWebGPUSupport(): Promise<boolean> {
  // Return cached result if available
  if (cachedSupport !== null) {
    return cachedSupport
  }

  // Return existing promise if check is in progress
  if (supportPromise) {
    return supportPromise
  }

  supportPromise = (async () => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      cachedSupport = false
      return false
    }

    // Check if navigator.gpu exists
    if (!navigator.gpu) {
      cachedSupport = false
      return false
    }

    try {
      // Request an adapter to verify WebGPU is actually available
      const adapter = await navigator.gpu.requestAdapter()
      cachedSupport = !!adapter
      return cachedSupport
    } catch (error) {
      console.warn('WebGPU adapter request failed:', error)
      cachedSupport = false
      return false
    }
  })()

  return supportPromise
}

/**
 * Synchronous check for basic WebGPU API presence.
 * Use this for quick checks, but prefer checkWebGPUSupport() for accurate results.
 */
export function hasWebGPUAPI(): boolean {
  if (typeof navigator === 'undefined') return false
  return !!navigator.gpu
}

/**
 * Get the current renderer type being used.
 * Returns null if support hasn't been checked yet.
 */
export function getRendererType(): RendererType | null {
  if (cachedSupport === null) return null
  return cachedSupport ? 'webgpu' : 'webgl'
}

/**
 * Reset the cached support result.
 * Useful for testing or when conditions may have changed.
 */
export function resetWebGPUCache(): void {
  cachedSupport = null
  supportPromise = null
}
