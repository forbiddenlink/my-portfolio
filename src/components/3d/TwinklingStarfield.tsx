'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function TwinklingStarfield({ count = 5000 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null)

  const [positions, colors, sizes, phases] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const phases = new Float32Array(count) // For twinkle animation

    for (let i = 0; i < count; i++) {
      // Distribute stars in a sphere
      const radius = 200 + Math.random() * 300
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)

      // Varied star colors (white, blue-white, yellow-white, red)
      const colorType = Math.random()
      if (colorType < 0.7) {
        // White stars (most common)
        colors[i * 3] = 1
        colors[i * 3 + 1] = 1
        colors[i * 3 + 2] = 1
      } else if (colorType < 0.85) {
        // Blue-white (hot stars)
        colors[i * 3] = 0.7 + Math.random() * 0.3
        colors[i * 3 + 1] = 0.8 + Math.random() * 0.2
        colors[i * 3 + 2] = 1
      } else if (colorType < 0.95) {
        // Yellow-white (sun-like)
        colors[i * 3] = 1
        colors[i * 3 + 1] = 0.9 + Math.random() * 0.1
        colors[i * 3 + 2] = 0.7 + Math.random() * 0.2
      } else {
        // Red giants
        colors[i * 3] = 1
        colors[i * 3 + 1] = 0.3 + Math.random() * 0.3
        colors[i * 3 + 2] = 0.2 + Math.random() * 0.2
      }

      // Varied sizes (realistic star magnitude distribution)
      const brightness = Math.random()
      sizes[i] = brightness < 0.9 ? 0.5 + Math.random() * 1.5 : 2 + Math.random() * 3

      // Random phase for twinkling
      phases[i] = Math.random() * Math.PI * 2
    }

    return [positions, colors, sizes, phases]
  }, [count])

  const vertexShader = `
    attribute float size;
    attribute float phase;
    varying vec3 vColor;
    varying float vTwinkle;
    uniform float time;

    void main() {
      vColor = color;

      // Multi-frequency twinkling for natural look
      float twinkle1 = sin(time * 2.0 + phase) * 0.25;
      float twinkle2 = sin(time * 3.5 + phase * 1.5) * 0.15;
      float twinkle3 = sin(time * 0.8 + phase * 0.7) * 0.1;
      float twinkle = 0.7 + twinkle1 + twinkle2 + twinkle3;

      vTwinkle = twinkle;

      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = size * twinkle * (350.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `

  const fragmentShader = `
    varying vec3 vColor;
    varying float vTwinkle;

    void main() {
      // Circular star with soft glow
      vec2 center = gl_PointCoord - vec2(0.5);
      float dist = length(center);

      if (dist > 0.5) discard;

      // Multi-layer glow effect
      float core = smoothstep(0.15, 0.0, dist);
      float glow = smoothstep(0.5, 0.1, dist);
      float outer = smoothstep(0.5, 0.3, dist) * 0.3;

      // Combine for realistic star appearance
      float brightness = core * 1.0 + glow * 0.6 + outer;
      brightness *= vTwinkle;

      // Add slight color bloom on bright stars
      vec3 finalColor = vColor;
      if (brightness > 0.8) {
        finalColor = mix(vColor, vec3(1.0), (brightness - 0.8) * 0.5);
      }

      gl_FragColor = vec4(finalColor * brightness, smoothstep(0.5, 0.0, dist));
    }
  `

  useFrame((state) => {
    if (!pointsRef.current) return
    const material = pointsRef.current.material as THREE.ShaderMaterial
    material.uniforms.time.value = state.clock.elapsedTime
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
          args={[colors, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          count={sizes.length}
          array={sizes}
          itemSize={1}
          args={[sizes, 1]}
        />
        <bufferAttribute
          attach="attributes-phase"
          count={phases.length}
          array={phases}
          itemSize={1}
          args={[phases, 1]}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          time: { value: 0 }
        }}
        transparent
        vertexColors
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
