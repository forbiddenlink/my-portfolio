'use client'

import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { usePrefersReducedMotion } from '@/lib/store'

interface BlackHoleProps {
  position: [number, number, number]
  scale?: number
}

/**
 * Massive black hole with gravitational lensing effect and accretion disk
 * Positioned dramatically between galaxies
 */
function SingleBlackHole({ position, scale = 1 }: BlackHoleProps) {
  const groupRef = useRef<THREE.Group>(null)
  const accretionRef = useRef<THREE.Mesh>(null)
  const lensingRef = useRef<THREE.Mesh>(null)
  const particlesRef = useRef<THREE.Points>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  // Accretion disk shader - hot matter spiraling in
  const accretionMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        uniform float uTime;

        void main() {
          vUv = uv;
          vPosition = position;

          vec3 pos = position;

          // Spiral deformation
          float angle = atan(pos.z, pos.x);
          float dist = length(pos.xz);
          float spiral = sin(angle * 3.0 - dist * 0.5 + uTime * 1.5) * 0.3;
          pos.y += spiral * (1.0 - smoothstep(2.0, 8.0, dist));

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec2 vUv;
        varying vec3 vPosition;

        void main() {
          float dist = length(vPosition.xz);

          // Temperature gradient - hotter near center
          float temp = 1.0 - smoothstep(2.0, 8.0, dist);

          // Hot inner edge (yellow/white) to cooler outer (orange/red/purple)
          vec3 hotColor = vec3(1.0, 0.95, 0.8);
          vec3 warmColor = vec3(1.0, 0.6, 0.2);
          vec3 coolColor = vec3(0.8, 0.2, 0.4);
          vec3 coldColor = vec3(0.4, 0.1, 0.5);

          vec3 color;
          if (temp > 0.7) {
            color = mix(warmColor, hotColor, (temp - 0.7) / 0.3);
          } else if (temp > 0.4) {
            color = mix(coolColor, warmColor, (temp - 0.4) / 0.3);
          } else {
            color = mix(coldColor, coolColor, temp / 0.4);
          }

          // Spiral arms pattern
          float angle = atan(vPosition.z, vPosition.x);
          float spiral = sin(angle * 5.0 - dist * 0.8 + uTime * 0.8) * 0.5 + 0.5;
          spiral = pow(spiral, 2.0);

          // Turbulence
          float turb1 = sin(dist * 3.0 + uTime * 2.0) * 0.1 + 0.9;
          float turb2 = cos(angle * 8.0 - uTime * 1.5) * 0.1 + 0.9;

          // Fade at edges
          float innerFade = smoothstep(1.5, 2.5, dist);
          float outerFade = 1.0 - smoothstep(6.0, 9.0, dist);

          float alpha = innerFade * outerFade * (0.5 + spiral * 0.5) * turb1 * turb2 * 0.85;

          // Brighten based on temperature
          color *= 1.0 + temp * 0.5;

          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    })
  }, [])

  // Gravitational lensing shader - distorts background
  const lensingMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;

        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec2 vUv;
        varying vec3 vPosition;

        void main() {
          vec2 center = vec2(0.5, 0.5);
          float dist = distance(vUv, center);

          // Einstein ring effect
          float ring = 1.0 - abs(dist - 0.35) * 5.0;
          ring = max(0.0, ring);
          ring = pow(ring, 3.0);

          // Photon sphere glow
          float photonSphere = 1.0 - abs(dist - 0.25) * 8.0;
          photonSphere = max(0.0, photonSphere);
          photonSphere = pow(photonSphere, 2.0);

          // Subtle shimmer
          float shimmer = sin(uTime * 3.0 + dist * 20.0) * 0.1 + 0.9;

          // Combined effect
          vec3 ringColor = vec3(0.6, 0.8, 1.0);
          vec3 photonColor = vec3(0.9, 0.95, 1.0);

          vec3 color = ringColor * ring + photonColor * photonSphere * 0.5;
          float alpha = (ring * 0.4 + photonSphere * 0.3) * shimmer;

          // Fade near center (event horizon)
          float eventHorizon = smoothstep(0.0, 0.15, dist);
          alpha *= eventHorizon;

          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    })
  }, [])

  // Particles for matter streams being pulled in
  const particleData = useMemo(() => {
    const count = 200
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    const lifetimes = new Float32Array(count)
    const colors = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      // Start particles at random angles around the disk
      const angle = Math.random() * Math.PI * 2
      const radius = 8 + Math.random() * 6

      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2
      positions[i * 3 + 2] = Math.sin(angle) * radius

      // Velocity toward center with spiral
      const speed = 0.02 + Math.random() * 0.03
      velocities[i * 3] = -Math.cos(angle) * speed + Math.sin(angle) * speed * 0.5
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.01
      velocities[i * 3 + 2] = -Math.sin(angle) * speed - Math.cos(angle) * speed * 0.5

      lifetimes[i] = Math.random()

      // Hot colors
      const temp = Math.random()
      colors[i * 3] = 1.0
      colors[i * 3 + 1] = 0.5 + temp * 0.4
      colors[i * 3 + 2] = 0.2 + temp * 0.3
    }

    return { positions, velocities, lifetimes, colors, count }
  }, [])

  const particleGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(particleData.positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(particleData.colors, 3))
    return geometry
  }, [particleData])

  useFrame((state) => {
    if (prefersReducedMotion) return

    const time = state.clock.getElapsedTime()

    // Rotate accretion disk
    if (accretionRef.current) {
      accretionRef.current.rotation.y = time * 0.3
      const material = accretionRef.current.material as THREE.ShaderMaterial
      material.uniforms.uTime.value = time
    }

    // Update lensing effect
    if (lensingRef.current) {
      const material = lensingRef.current.material as THREE.ShaderMaterial
      material.uniforms.uTime.value = time
    }

    // Animate particles spiraling in
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array

      for (let i = 0; i < particleData.count; i++) {
        const idx = i * 3

        // Get current position
        let x = positions[idx]
        let y = positions[idx + 1]
        let z = positions[idx + 2]

        // Calculate distance from center
        const dist = Math.sqrt(x * x + z * z)

        // Spiral inward
        const angle = Math.atan2(z, x)
        const spiralSpeed = 0.02 + (1.0 / dist) * 0.05
        const newAngle = angle + spiralSpeed
        const newDist = dist * 0.998 // Slowly shrink orbit

        // Update position
        x = Math.cos(newAngle) * newDist
        z = Math.sin(newAngle) * newDist
        y *= 0.99 // Flatten toward disk

        // Reset if too close to center
        if (newDist < 2.0) {
          const resetAngle = Math.random() * Math.PI * 2
          const resetRadius = 8 + Math.random() * 6
          x = Math.cos(resetAngle) * resetRadius
          y = (Math.random() - 0.5) * 2
          z = Math.sin(resetAngle) * resetRadius
        }

        positions[idx] = x
        positions[idx + 1] = y
        positions[idx + 2] = z
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  // Static version for reduced motion
  if (prefersReducedMotion) {
    return (
      <group position={position} scale={scale}>
        {/* Event horizon */}
        <mesh>
          <sphereGeometry args={[1.5, 32, 32]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
        {/* Static glow */}
        <mesh scale={2}>
          <sphereGeometry args={[1.5, 16, 16]} />
          <meshBasicMaterial
            color="#4444ff"
            transparent
            opacity={0.2}
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
          />
        </mesh>
      </group>
    )
  }

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Event horizon - the black sphere */}
      <mesh>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Gravitational lensing ring */}
      <mesh ref={lensingRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2, 6, 64]} />
        <primitive object={lensingMaterial} attach="material" />
      </mesh>

      {/* Accretion disk - tilted for dramatic effect */}
      <mesh ref={accretionRef} rotation={[Math.PI / 2 + 0.3, 0, 0.1]}>
        <ringGeometry args={[2, 9, 128, 1]} />
        <primitive object={accretionMaterial} attach="material" />
      </mesh>

      {/* Second accretion disk layer for depth */}
      <mesh rotation={[Math.PI / 2 + 0.3, 0.2, 0.1]}>
        <ringGeometry args={[2.5, 7, 64, 1]} />
        <meshBasicMaterial
          color="#FF6633"
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Matter stream particles */}
      <points ref={particlesRef}>
        <primitive object={particleGeometry} attach="geometry" />
        <pointsMaterial
          size={0.15}
          vertexColors
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Inner glow from heated matter */}
      <mesh scale={1.2}>
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshBasicMaterial
          color="#FF4400"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Outer distortion glow */}
      <mesh scale={4}>
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshBasicMaterial
          color="#6644FF"
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  )
}

/**
 * Black hole positioned dramatically in the scene
 */
export function BlackHole() {
  const prefersReducedMotion = usePrefersReducedMotion()

  // Position between galaxies for dramatic effect
  // Place it roughly in the center-ish area, elevated
  const position: [number, number, number] = [0, 15, -20]

  return (
    <SingleBlackHole
      position={position}
      scale={prefersReducedMotion ? 1.5 : 2}
    />
  )
}
