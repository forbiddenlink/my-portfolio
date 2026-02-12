'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { usePrefersReducedMotion } from '@/lib/store'

interface PulsarProps {
  position: [number, number, number]
  color?: string
  beamColor?: string
  scale?: number
  rotationSpeed?: number
}

/**
 * Single pulsar - rapidly rotating neutron star with sweeping light beams
 */
function SinglePulsar({
  position,
  color = '#FFFFFF',
  beamColor = '#00FFFF',
  scale = 1,
  rotationSpeed = 3
}: PulsarProps) {
  const groupRef = useRef<THREE.Group>(null)
  const beamsRef = useRef<THREE.Group>(null)
  const coreRef = useRef<THREE.Mesh>(null)

  const pulsarColor = useMemo(() => new THREE.Color(color), [color])
  const pulsarBeamColor = useMemo(() => new THREE.Color(beamColor), [beamColor])

  // Beam shader for volumetric light effect
  const beamMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: pulsarBeamColor },
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
        uniform vec3 uColor;
        varying vec2 vUv;
        varying vec3 vPosition;

        void main() {
          // Fade along beam length
          float lengthFade = 1.0 - vUv.y;
          lengthFade = pow(lengthFade, 0.5);

          // Fade at edges for cone shape
          float edgeFade = 1.0 - abs(vUv.x - 0.5) * 2.0;
          edgeFade = pow(edgeFade, 2.0);

          // Pulsing intensity
          float pulse = sin(uTime * 10.0) * 0.2 + 0.8;

          // Energy ripples along beam
          float ripple = sin(vUv.y * 20.0 - uTime * 15.0) * 0.1 + 0.9;

          float alpha = lengthFade * edgeFade * pulse * ripple * 0.6;

          // Brighter core
          float core = exp(-pow(abs(vUv.x - 0.5) * 6.0, 2.0)) * 0.5;
          alpha += core * lengthFade;

          vec3 color = uColor * (1.0 + core);

          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    })
  }, [pulsarBeamColor])

  // Core shader for the neutron star
  const coreMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: pulsarColor },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;

        void main() {
          vUv = uv;
          vNormal = normal;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor;
        varying vec2 vUv;
        varying vec3 vNormal;

        void main() {
          // Hot spots rotating on surface
          float hotspot = sin(vUv.x * 6.28 + uTime * 5.0) * sin(vUv.y * 3.14);
          hotspot = max(0.0, hotspot);
          hotspot = pow(hotspot, 3.0);

          // Base glow
          float glow = 0.8 + sin(uTime * 8.0) * 0.2;

          vec3 color = uColor * glow;
          color += vec3(1.0, 0.9, 0.8) * hotspot * 2.0;

          gl_FragColor = vec4(color, 1.0);
        }
      `,
      transparent: false,
    })
  }, [pulsarColor])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    // Rapid rotation
    if (beamsRef.current) {
      beamsRef.current.rotation.y = time * rotationSpeed
    }

    // Core pulsing
    if (coreRef.current) {
      const material = coreRef.current.material as THREE.ShaderMaterial
      material.uniforms.uTime.value = time

      // Slight scale pulsing
      const pulse = 1 + Math.sin(time * 8) * 0.05
      coreRef.current.scale.setScalar(pulse)
    }

    // Update beam material
    if (beamsRef.current) {
      beamsRef.current.children.forEach(beam => {
        if (beam instanceof THREE.Mesh) {
          const material = beam.material as THREE.ShaderMaterial
          if (material.uniforms?.uTime) {
            material.uniforms.uTime.value = time
          }
        }
      })
    }
  })

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Neutron star core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <primitive object={coreMaterial} attach="material" />
      </mesh>

      {/* Core glow */}
      <mesh scale={1.5}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial
          color={pulsarColor}
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Outer halo */}
      <mesh scale={3}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial
          color={pulsarBeamColor}
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Light beams - opposite poles */}
      <group ref={beamsRef}>
        {/* Top beam */}
        <mesh position={[0, 4, 0]} rotation={[0, 0, 0]}>
          <coneGeometry args={[1.5, 8, 16, 1, true]} />
          <primitive object={beamMaterial.clone()} attach="material" />
        </mesh>

        {/* Bottom beam */}
        <mesh position={[0, -4, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[1.5, 8, 16, 1, true]} />
          <primitive object={beamMaterial.clone()} attach="material" />
        </mesh>
      </group>

      {/* Central point light */}
      <pointLight
        color={pulsarColor}
        intensity={2}
        distance={15}
        decay={2}
      />
    </group>
  )
}

interface PulsarsProps {
  count?: number
}

/**
 * Multiple pulsars distributed through the scene
 */
export function Pulsars({ count = 3 }: PulsarsProps) {
  const prefersReducedMotion = usePrefersReducedMotion()

  // Pulsar configurations
  const pulsarConfigs = useMemo(() => {
    const colors = [
      { core: '#FFFFFF', beam: '#00FFFF' },
      { core: '#FFDDAA', beam: '#FF8844' },
      { core: '#AADDFF', beam: '#8866FF' },
    ]

    return Array.from({ length: count }, (_, i) => {
      // Place pulsars at interesting positions
      const theta = (i / count) * Math.PI * 2 + Math.random() * 0.5
      const radius = 100 + Math.random() * 60
      const height = (Math.random() - 0.5) * 60

      return {
        position: [
          Math.cos(theta) * radius,
          height,
          Math.sin(theta) * radius
        ] as [number, number, number],
        color: colors[i % colors.length].core,
        beamColor: colors[i % colors.length].beam,
        scale: 1.5 + Math.random() * 1,
        rotationSpeed: 2 + Math.random() * 2,
      }
    })
  }, [count])

  // Simplified static version for reduced motion
  if (prefersReducedMotion) {
    return (
      <group>
        {pulsarConfigs.map((config, i) => (
          <group key={i} position={config.position} scale={config.scale}>
            <mesh>
              <sphereGeometry args={[0.5, 16, 16]} />
              <meshBasicMaterial color={config.color} />
            </mesh>
            <pointLight color={config.color} intensity={1} distance={10} />
          </group>
        ))}
      </group>
    )
  }

  return (
    <group>
      {pulsarConfigs.map((config, i) => (
        <SinglePulsar
          key={i}
          position={config.position}
          color={config.color}
          beamColor={config.beamColor}
          scale={config.scale}
          rotationSpeed={config.rotationSpeed}
        />
      ))}
    </group>
  )
}
