'use client'

import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface InteractiveSpaceDustProps {
  count?: number
  size?: number
  spread?: number
}

/**
 * Interactive floating space dust particles that:
 * - Drift slowly through space
 * - React to mouse movement with subtle repulsion
 * - Have depth-based size variation
 * - Glow softly with varied colors
 */
export function InteractiveSpaceDust({
  count = 800,
  size = 0.15,
  spread = 100
}: InteractiveSpaceDustProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const { camera, pointer } = useThree()

  // Store original positions and velocities
  const particleData = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const originalPositions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const phases = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3

      // Random position in a box
      const x = (Math.random() - 0.5) * spread * 2
      const y = (Math.random() - 0.5) * spread
      const z = (Math.random() - 0.5) * spread * 2

      positions[i3] = x
      positions[i3 + 1] = y
      positions[i3 + 2] = z

      originalPositions[i3] = x
      originalPositions[i3 + 1] = y
      originalPositions[i3 + 2] = z

      // Slow drift velocities
      velocities[i3] = (Math.random() - 0.5) * 0.02
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.01
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.02

      // Varied dust colors - whites, blues, subtle purples
      const colorType = Math.random()
      if (colorType < 0.5) {
        // White/gray
        const brightness = 0.6 + Math.random() * 0.4
        colors[i3] = brightness
        colors[i3 + 1] = brightness
        colors[i3 + 2] = brightness
      } else if (colorType < 0.75) {
        // Blue tint
        colors[i3] = 0.5 + Math.random() * 0.3
        colors[i3 + 1] = 0.6 + Math.random() * 0.3
        colors[i3 + 2] = 0.8 + Math.random() * 0.2
      } else {
        // Purple tint
        colors[i3] = 0.6 + Math.random() * 0.3
        colors[i3 + 1] = 0.4 + Math.random() * 0.3
        colors[i3 + 2] = 0.7 + Math.random() * 0.3
      }

      // Size variation
      sizes[i] = size * (0.5 + Math.random() * 1.0)

      // Random phase for animation
      phases[i] = Math.random() * Math.PI * 2
    }

    return { positions, originalPositions, velocities, colors, sizes, phases }
  }, [count, spread, size])

  // Shader for soft glowing particles
  const vertexShader = `
    attribute float particleSize;
    attribute float phase;
    varying vec3 vColor;
    varying float vAlpha;
    uniform float time;
    uniform vec3 mouseWorld;
    uniform float mouseInfluence;

    void main() {
      vColor = color;

      // Calculate world position
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);

      // Mouse repulsion in world space
      vec3 toMouse = worldPosition.xyz - mouseWorld;
      float distToMouse = length(toMouse);
      float repulsionRadius = 20.0;

      if (distToMouse < repulsionRadius && mouseInfluence > 0.0) {
        float repulsion = (1.0 - distToMouse / repulsionRadius) * mouseInfluence * 3.0;
        worldPosition.xyz += normalize(toMouse) * repulsion;
      }

      // Subtle floating animation
      float float1 = sin(time * 0.5 + phase) * 0.3;
      float float2 = cos(time * 0.3 + phase * 1.5) * 0.2;
      worldPosition.y += float1;
      worldPosition.x += float2;

      // Transform to view space
      vec4 mvPosition = viewMatrix * worldPosition;

      // Size attenuation with distance
      float sizeAtten = particleSize * (200.0 / -mvPosition.z);
      gl_PointSize = max(sizeAtten, 1.0);

      // Fade based on distance for depth
      float dist = -mvPosition.z;
      vAlpha = smoothstep(200.0, 20.0, dist) * 0.6;

      // Twinkle
      vAlpha *= 0.7 + sin(time * 2.0 + phase * 3.0) * 0.3;

      gl_Position = projectionMatrix * mvPosition;
    }
  `

  const fragmentShader = `
    varying vec3 vColor;
    varying float vAlpha;

    void main() {
      // Soft circular particle with glow
      vec2 center = gl_PointCoord - vec2(0.5);
      float dist = length(center);

      if (dist > 0.5) discard;

      // Soft falloff
      float alpha = smoothstep(0.5, 0.0, dist) * vAlpha;

      // Add slight glow
      float glow = exp(-dist * 4.0) * 0.5;

      gl_FragColor = vec4(vColor + glow, alpha);
    }
  `

  // Track mouse position in 3D
  const mouseWorld = useRef(new THREE.Vector3())
  const raycaster = useMemo(() => new THREE.Raycaster(), [])

  useFrame((state, delta) => {
    if (!pointsRef.current) return

    const material = pointsRef.current.material as THREE.ShaderMaterial
    material.uniforms.time.value = state.clock.elapsedTime

    // Project mouse to 3D world space
    raycaster.setFromCamera(pointer, camera)
    const planeNormal = new THREE.Vector3(0, 0, 1)
    const plane = new THREE.Plane(planeNormal, 0)
    raycaster.ray.intersectPlane(plane, mouseWorld.current)

    // Update mouse uniform (smoothed)
    const currentMouse = material.uniforms.mouseWorld.value as THREE.Vector3
    currentMouse.lerp(mouseWorld.current, 0.1)

    // Mouse influence based on movement
    const mouseInfluence = pointer.x !== 0 || pointer.y !== 0 ? 1.0 : 0.0
    material.uniforms.mouseInfluence.value = THREE.MathUtils.lerp(
      material.uniforms.mouseInfluence.value,
      mouseInfluence,
      0.05
    )

    // Slowly drift particles
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array

    for (let i = 0; i < count; i++) {
      const i3 = i * 3

      // Apply velocity
      positions[i3] += particleData.velocities[i3] * delta * 30
      positions[i3 + 1] += particleData.velocities[i3 + 1] * delta * 30
      positions[i3 + 2] += particleData.velocities[i3 + 2] * delta * 30

      // Wrap around boundaries
      const halfSpread = spread
      if (positions[i3] > halfSpread) positions[i3] = -halfSpread
      if (positions[i3] < -halfSpread) positions[i3] = halfSpread
      if (positions[i3 + 1] > halfSpread / 2) positions[i3 + 1] = -halfSpread / 2
      if (positions[i3 + 1] < -halfSpread / 2) positions[i3 + 1] = halfSpread / 2
      if (positions[i3 + 2] > halfSpread) positions[i3 + 2] = -halfSpread
      if (positions[i3 + 2] < -halfSpread) positions[i3 + 2] = halfSpread
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particleData.positions}
          itemSize={3}
          args={[particleData.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={particleData.colors}
          itemSize={3}
          args={[particleData.colors, 3]}
        />
        <bufferAttribute
          attach="attributes-particleSize"
          count={count}
          array={particleData.sizes}
          itemSize={1}
          args={[particleData.sizes, 1]}
        />
        <bufferAttribute
          attach="attributes-phase"
          count={count}
          array={particleData.phases}
          itemSize={1}
          args={[particleData.phases, 1]}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          time: { value: 0 },
          mouseWorld: { value: new THREE.Vector3() },
          mouseInfluence: { value: 0 }
        }}
        transparent
        vertexColors
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
