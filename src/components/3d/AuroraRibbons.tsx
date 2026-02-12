'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { usePrefersReducedMotion } from '@/lib/store'

interface AuroraRibbonsProps {
  count?: number
  spread?: number
}

/**
 * Ethereal aurora ribbons that flow and dance through space
 * creating beautiful, ever-changing patterns of light
 */
export function AuroraRibbons({ count = 4, spread = 120 }: AuroraRibbonsProps) {
  const ribbonsRef = useRef<THREE.Group>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  // Ribbon configurations
  const ribbonConfigs = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2
      const radius = spread * 0.6 + Math.random() * spread * 0.4
      const height = 30 + Math.random() * 40

      return {
        basePosition: new THREE.Vector3(
          Math.cos(angle) * radius,
          height,
          Math.sin(angle) * radius
        ),
        length: 40 + Math.random() * 30,
        width: 8 + Math.random() * 6,
        speed: 0.3 + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2,
        colorHue: 0.5 + Math.random() * 0.3, // Cyan to purple range
      }
    })
  }, [count, spread])

  // Aurora shader material
  const auroraMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColorA: { value: new THREE.Color('#00FFAA') },
        uColorB: { value: new THREE.Color('#8855FF') },
        uColorC: { value: new THREE.Color('#00AAFF') },
      },
      vertexShader: `
        uniform float uTime;
        varying vec2 vUv;
        varying float vWave;

        void main() {
          vUv = uv;

          vec3 pos = position;

          // Multiple wave frequencies for organic movement
          float wave1 = sin(pos.x * 0.1 + uTime * 0.5) * 3.0;
          float wave2 = sin(pos.x * 0.2 + uTime * 0.8 + 1.0) * 2.0;
          float wave3 = cos(pos.x * 0.15 + uTime * 0.3) * 2.5;

          pos.y += wave1 + wave2;
          pos.z += wave3;

          // Undulation along the ribbon
          float undulation = sin(uv.x * 6.28 + uTime * 2.0) * 0.5;
          pos.y += undulation * (1.0 - abs(uv.y - 0.5) * 2.0);

          vWave = (wave1 + wave2 + wave3) / 7.5 + 0.5;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        uniform vec3 uColorC;
        varying vec2 vUv;
        varying float vWave;

        void main() {
          // Edge fade for ribbon shape
          float edgeFade = smoothstep(0.0, 0.15, vUv.y) * smoothstep(1.0, 0.85, vUv.y);

          // Length fade (stronger at ends)
          float lengthFade = smoothstep(0.0, 0.1, vUv.x) * smoothstep(1.0, 0.9, vUv.x);

          // Color cycling based on position and time
          float colorMix = sin(vUv.x * 3.14159 + uTime * 0.5) * 0.5 + 0.5;
          float colorMix2 = cos(vUv.x * 2.0 - uTime * 0.3) * 0.5 + 0.5;

          vec3 color = mix(uColorA, uColorB, colorMix);
          color = mix(color, uColorC, colorMix2 * vWave);

          // Shimmer effect
          float shimmer = sin(vUv.x * 30.0 + uTime * 3.0) * 0.15 + 0.85;

          // Brightness variation along ribbon
          float brightness = 0.7 + sin(vUv.x * 6.28 + uTime) * 0.3;

          float alpha = edgeFade * lengthFade * shimmer * brightness * 0.6;

          // Add glow in center
          float centerGlow = exp(-pow(abs(vUv.y - 0.5) * 4.0, 2.0)) * 0.3;
          alpha += centerGlow * lengthFade;

          gl_FragColor = vec4(color * (1.0 + centerGlow), alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    })
  }, [])

  // Create ribbon geometries
  const ribbonGeometries = useMemo(() => {
    return ribbonConfigs.map(config => {
      const segments = 64
      const geometry = new THREE.PlaneGeometry(config.length, config.width, segments, 4)
      return geometry
    })
  }, [ribbonConfigs])

  // Reduced motion - show static ribbons
  const animationSpeed = prefersReducedMotion ? 0.1 : 1.0

  useFrame((state) => {
    const time = state.clock.getElapsedTime() * animationSpeed

    if (ribbonsRef.current) {
      ribbonsRef.current.children.forEach((ribbon, i) => {
        if (ribbon instanceof THREE.Mesh) {
          const config = ribbonConfigs[i]
          const material = ribbon.material as THREE.ShaderMaterial
          material.uniforms.uTime.value = time + config.phase

          // Gentle overall drift
          ribbon.position.x = config.basePosition.x + Math.sin(time * config.speed + config.phase) * 10
          ribbon.position.z = config.basePosition.z + Math.cos(time * config.speed * 0.7 + config.phase) * 8
          ribbon.position.y = config.basePosition.y + Math.sin(time * config.speed * 0.5) * 5

          // Slow rotation
          ribbon.rotation.y = Math.sin(time * 0.2 + config.phase) * 0.3
          ribbon.rotation.z = Math.cos(time * 0.15 + config.phase) * 0.1
        }
      })
    }
  })

  return (
    <group ref={ribbonsRef}>
      {ribbonConfigs.map((config, i) => {
        // Clone material for independent uniforms
        const material = auroraMaterial.clone()

        // Assign unique colors based on config
        const hue = config.colorHue
        material.uniforms.uColorA.value = new THREE.Color().setHSL(hue, 0.8, 0.6)
        material.uniforms.uColorB.value = new THREE.Color().setHSL(hue + 0.2, 0.9, 0.5)
        material.uniforms.uColorC.value = new THREE.Color().setHSL(hue - 0.1, 0.7, 0.7)

        return (
          <mesh
            key={i}
            geometry={ribbonGeometries[i]}
            position={config.basePosition}
            rotation={[Math.PI * 0.3, 0, 0]}
          >
            <primitive object={material} attach="material" />
          </mesh>
        )
      })}
    </group>
  )
}
