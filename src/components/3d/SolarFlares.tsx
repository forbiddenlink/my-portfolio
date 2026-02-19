'use client'

import { useRef, useMemo, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { galaxies } from '@/lib/galaxyData'
import { getGalaxyCenterPosition } from '@/lib/utils'
import { usePrefersReducedMotion } from '@/lib/store'

interface FlareConfig {
  startTime: number
  duration: number
  angle: number
  size: number
  color: THREE.Color
  position: THREE.Vector3
}

interface SolarFlareProps {
  position: [number, number, number]
  color: string
}

/**
 * Single galaxy's solar flare system
 */
function GalaxySolarFlares({ position, color }: SolarFlareProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [flares, setFlares] = useState<FlareConfig[]>([])
  const prefersReducedMotion = usePrefersReducedMotion()

  const baseColor = useMemo(() => new THREE.Color(color), [color])
  const brightColor = useMemo(() => baseColor.clone().multiplyScalar(1.5), [baseColor])

  // Flare shader material
  const flareMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uColor: { value: baseColor },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uProgress;
        varying vec2 vUv;
        varying float vProgress;

        void main() {
          vUv = uv;
          vProgress = uProgress;

          vec3 pos = position;

          // Expand outward based on progress
          float expansion = uProgress * 1.5;
          pos.y *= (1.0 + expansion);
          pos.x *= (1.0 + expansion * 0.3);

          // Add turbulence
          float turbulence = sin(pos.y * 5.0 + uTime * 3.0) * 0.1 * uProgress;
          pos.x += turbulence;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uProgress;
        uniform vec3 uColor;
        varying vec2 vUv;
        varying float vProgress;

        void main() {
          // Fade at edges
          float edgeFade = smoothstep(0.0, 0.3, vUv.x) * smoothstep(1.0, 0.7, vUv.x);

          // Fade toward top (eruption tip)
          float tipFade = smoothstep(1.0, 0.5, vUv.y);

          // Hot core
          float core = exp(-pow(abs(vUv.x - 0.5) * 4.0, 2.0));

          // Plasma flickering
          float flicker = sin(vUv.y * 20.0 + uTime * 10.0) * 0.15 + 0.85;
          float flicker2 = cos(vUv.x * 15.0 - uTime * 8.0) * 0.1 + 0.9;

          // Color gradient - hotter at base
          vec3 hotColor = vec3(1.0, 0.9, 0.7);
          vec3 color = mix(hotColor, uColor, vUv.y * 0.7);
          color = mix(color, hotColor, core * 0.5);

          // Fade in/out based on progress
          float lifeFade = sin(vProgress * 3.14159);

          float alpha = edgeFade * tipFade * flicker * flicker2 * lifeFade * 0.8;
          alpha += core * tipFade * lifeFade * 0.4;

          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    })
  }, [baseColor])

  // Spawn new flares and cleanup expired ones periodically (not in useFrame)
  useEffect(() => {
    if (prefersReducedMotion) return

    const spawnFlare = () => {
      const now = performance.now() / 1000
      const newFlare: FlareConfig = {
        startTime: now,
        duration: 2 + Math.random() * 2,
        angle: Math.random() * Math.PI * 2,
        size: 3 + Math.random() * 4,
        color: Math.random() > 0.5 ? baseColor.clone() : brightColor.clone(),
        position: new THREE.Vector3(...position),
      }

      setFlares(prev => [...prev.slice(-4), newFlare]) // Keep max 5 flares
    }

    // Cleanup expired flares (separate from useFrame to avoid render loop interference)
    const cleanupFlares = () => {
      const now = performance.now() / 1000
      setFlares(prev => {
        const activeFlares = prev.filter(flare => {
          const progress = (now - flare.startTime) / flare.duration
          return progress < 1
        })
        // Only return new array if something changed
        return activeFlares.length !== prev.length ? activeFlares : prev
      })
    }

    // Spawn initial flare
    const initialDelay = Math.random() * 5000
    const initialTimeout = setTimeout(spawnFlare, initialDelay)

    // Regular spawning
    const spawnInterval = setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance every interval
        spawnFlare()
      }
    }, 3000)

    // Cleanup interval (every 500ms, but outside render loop)
    const cleanupInterval = setInterval(cleanupFlares, 500)

    return () => {
      clearTimeout(initialTimeout)
      clearInterval(spawnInterval)
      clearInterval(cleanupInterval)
    }
  }, [position, baseColor, brightColor, prefersReducedMotion])

  // Update flare materials in useFrame (no state changes, just uniform updates)
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    const now = performance.now() / 1000

    if (groupRef.current) {
      groupRef.current.children.forEach((flareMesh, i) => {
        if (flareMesh instanceof THREE.Mesh && flares[i]) {
          const flare = flares[i]
          const progress = Math.min((now - flare.startTime) / flare.duration, 1)

          const material = flareMesh.material as THREE.ShaderMaterial
          material.uniforms.uTime.value = time
          material.uniforms.uProgress.value = progress
          material.uniforms.uColor.value = flare.color
        }
      })
    }
  })

  if (prefersReducedMotion) {
    // Static glow for reduced motion
    return (
      <group position={position}>
        <mesh>
          <sphereGeometry args={[2, 16, 16]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.2}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>
    )
  }

  return (
    <group ref={groupRef} position={position}>
      {flares.map((flare, i) => (
        <mesh
          key={`${flare.startTime}-${i}`}
          rotation={[0, flare.angle, Math.PI * 0.1]}
          scale={[1, flare.size, 1]}
        >
          <planeGeometry args={[2, 4, 8, 16]} />
          <primitive object={flareMaterial.clone()} attach="material" />
        </mesh>
      ))}

      {/* Base corona glow */}
      <mesh>
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshBasicMaterial
          color={brightColor}
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}

/**
 * Solar flares emanating from all galaxy cores
 */
export function SolarFlares() {
  // Get galaxy core positions
  const galaxyCores = useMemo(() => {
    return galaxies.map((galaxy, index) => {
      const [x, y, z] = getGalaxyCenterPosition(index)
      return {
        position: [x, y, z] as [number, number, number],
        color: galaxy.color,
      }
    })
  }, [])

  return (
    <group>
      {galaxyCores.map((core, i) => (
        <GalaxySolarFlares
          key={i}
          position={core.position}
          color={core.color}
        />
      ))}
    </group>
  )
}
