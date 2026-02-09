'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface VolumetricAtmosphereProps {
  position: [number, number, number]
  radius: number
  color: string
  intensity?: number
}

export function VolumetricAtmosphere({
  position,
  radius,
  color,
  intensity = 1.0
}: VolumetricAtmosphereProps) {
  const atmosphereRef = useRef<THREE.Mesh>(null)

  const vertexShader = `
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `

  const fragmentShader = `
    uniform vec3 glowColor;
    uniform float intensity;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      // View direction
      vec3 viewDirection = normalize(cameraPosition - vPosition);

      // Fresnel effect for atmosphere glow
      float fresnel = pow(1.0 - max(dot(viewDirection, vNormal), 0.0), 3.0);

      // Atmospheric scattering intensity
      float scatter = fresnel * intensity;

      // Add subtle pulsing
      float pulse = sin(vPosition.x * 2.0 + vPosition.y * 2.0) * 0.1 + 0.9;

      vec3 finalColor = glowColor * scatter * pulse;
      float alpha = scatter * 0.6;

      gl_FragColor = vec4(finalColor, alpha);
    }
  `

  useFrame((state) => {
    if (!atmosphereRef.current) return
    const material = atmosphereRef.current.material as THREE.ShaderMaterial
    // Subtle rotation for atmospheric movement
    atmosphereRef.current.rotation.y += 0.0002
  })

  return (
    <mesh ref={atmosphereRef} position={position}>
      <sphereGeometry args={[radius * 1.15, 64, 64]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          glowColor: { value: new THREE.Color(color) },
          intensity: { value: intensity }
        }}
        transparent
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  )
}
