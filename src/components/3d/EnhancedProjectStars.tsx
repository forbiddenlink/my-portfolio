'use client'

import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { galaxies } from '@/lib/galaxyData'
import { generateProjectPosition, getSizeMultiplier } from '@/lib/utils'
import { useViewStore } from '@/lib/store'
import * as THREE from 'three'
import { SupernovaEffect } from './SupernovaEffect'
import { AnimatedConstellation } from './AnimatedConstellation'

export function EnhancedProjectStars() {
  return (
    <group>
      {galaxies.map((galaxy, galaxyIndex) => (
        <GalaxyCluster
          key={galaxy.id}
          galaxy={galaxy}
          galaxyIndex={galaxyIndex}
        />
      ))}
    </group>
  )
}

function GalaxyCluster({ galaxy, galaxyIndex }: { galaxy: any; galaxyIndex: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const zoomToProject = useViewStore((state) => state.zoomToProject)

  return (
    <group ref={groupRef}>
      {galaxy.projects.map((project: any, projectIndex: number) => {
        const position = generateProjectPosition(
          project.id,
          galaxy.id,
          galaxyIndex,
          projectIndex,
          galaxy.projects.length
        )

        const sizeMultiplier = getSizeMultiplier(project.size)
        const isSupernova = project.id === 'coulson-one'

        return (
          <RealisticPlanet
            key={project.id}
            project={project}
            position={position}
            sizeMultiplier={sizeMultiplier}
            isSupernova={isSupernova}
            onPlanetClick={() => zoomToProject(project.id)}
          />
        )
      })}

      {/* Animated Constellation for Flo Labs */}
      {galaxy.id === 'enterprise' && <AnimatedConstellation />}
    </group>
  )
}

// Procedural planet shader
const planetVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const planetFragmentShader = `
  uniform vec3 baseColor;
  uniform vec3 secondaryColor;
  uniform float time;
  uniform float seed;
  uniform int planetType; // 0=rocky, 1=gas, 2=ice, 3=lava
  
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  // Noise functions
  float hash(vec3 p) {
    p = fract(p * vec3(443.8975, 397.2973, 491.1871));
    p += dot(p, p.yxz + 19.19);
    return fract((p.x + p.y) * p.z);
  }
  
  float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    
    return mix(
      mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
          mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
          mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
      f.z
    );
  }
  
  float fbm(vec3 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for(int i = 0; i < 5; i++) {
      value += amplitude * noise(p);
      p *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }
  
  void main() {
    vec3 pos = vPosition * 3.0 + seed;
    
    // Base terrain noise
    float terrain = fbm(pos * 2.0);
    float detail = fbm(pos * 8.0) * 0.3;
    float pattern = terrain + detail;
    
    vec3 color;
    
    if (planetType == 0) {
      // Rocky planet - continents and oceans feel
      float continents = smoothstep(0.4, 0.6, pattern);
      vec3 landColor = baseColor * 1.2;
      vec3 lowlandColor = baseColor * 0.7;
      color = mix(lowlandColor, landColor, continents);
      
      // Add some variation
      float mountains = smoothstep(0.65, 0.8, pattern);
      color = mix(color, secondaryColor, mountains * 0.5);
      
    } else if (planetType == 1) {
      // Gas giant - swirling bands
      float bands = sin(vPosition.y * 15.0 + fbm(pos * 3.0) * 2.0) * 0.5 + 0.5;
      float storms = fbm(pos * 4.0 + vec3(time * 0.1, 0.0, 0.0));
      
      color = mix(baseColor, secondaryColor, bands);
      color = mix(color, baseColor * 1.5, storms * 0.3);
      
      // Great spot
      float spot = 1.0 - smoothstep(0.0, 0.3, length(vPosition.xy - vec2(0.3, 0.1)));
      color = mix(color, secondaryColor * 1.3, spot * 0.4);
      
    } else if (planetType == 2) {
      // Ice planet - frozen surface
      float ice = fbm(pos * 6.0);
      float cracks = smoothstep(0.48, 0.52, fbm(pos * 12.0));
      
      color = mix(baseColor, secondaryColor, ice * 0.6);
      color = mix(color, vec3(0.9, 0.95, 1.0), cracks * 0.3);
      
    } else {
      // Lava planet - molten surface
      float lava = fbm(pos * 4.0 + vec3(time * 0.05, 0.0, 0.0));
      float crust = smoothstep(0.4, 0.6, lava);
      
      vec3 hotColor = vec3(1.0, 0.3, 0.0);
      vec3 crustColor = baseColor * 0.3;
      color = mix(hotColor, crustColor, crust);
      
      // Glowing cracks
      float cracks = 1.0 - smoothstep(0.0, 0.1, abs(lava - 0.5));
      color += vec3(1.0, 0.5, 0.0) * cracks * 0.5;
    }
    
    // Lighting
    vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
    float diff = max(dot(vNormal, lightDir), 0.0);
    float ambient = 0.3;
    
    color *= (ambient + diff * 0.7);
    
    // Fresnel rim lighting
    vec3 viewDir = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 3.0);
    color += baseColor * fresnel * 0.3;
    
    gl_FragColor = vec4(color, 1.0);
  }
`

function RealisticPlanet({
  project,
  position,
  sizeMultiplier,
  isSupernova,
  onPlanetClick
}: {
  project: any
  position: [number, number, number]
  sizeMultiplier: number
  isSupernova: boolean
  onPlanetClick: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const planetRef = useRef<THREE.Mesh>(null)
  const atmosphereRef = useRef<THREE.Mesh>(null)
  const ringsRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)
  
  // Determine planet characteristics
  const hasRings = ['coulson-one', 'portfolio-pro', 'quantum-forge', 'flo-labs'].includes(project.id)
  const planetType = useMemo(() => {
    if (project.color.includes('00D9FF') || project.color.includes('06FFA5') || project.color.includes('00ffff')) return 2 // Ice
    if (project.color.includes('FF6B6B') || project.color.includes('ff4444')) return 3 // Lava
    if (sizeMultiplier > 1.8) return 1 // Gas giant
    return 0 // Rocky
  }, [project.color, sizeMultiplier])
  
  // Generate secondary color
  const secondaryColor = useMemo(() => {
    const color = new THREE.Color(project.color)
    const hsl = { h: 0, s: 0, l: 0 }
    color.getHSL(hsl)
    return new THREE.Color().setHSL((hsl.h + 0.1) % 1, hsl.s * 0.8, hsl.l * 0.7)
  }, [project.color])
  
  // Unique seed per planet
  const seed = useMemo(() => {
    let hash = 0
    for (let i = 0; i < project.id.length; i++) {
      hash = ((hash << 5) - hash) + project.id.charCodeAt(i)
      hash |= 0
    }
    return Math.abs(hash) % 1000
  }, [project.id])
  
  const rotationSpeed = useMemo(() => 0.001 + (seed % 100) * 0.00002, [seed])
  
  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    if (planetRef.current) {
      planetRef.current.rotation.y += rotationSpeed
      const material = planetRef.current.material as THREE.ShaderMaterial
      if (material.uniforms) {
        material.uniforms.time.value = time
      }
    }
    
    if (ringsRef.current) {
      ringsRef.current.rotation.z += 0.0003
    }
    
    if (groupRef.current && hovered) {
      const scale = 1.1 + Math.sin(time * 3) * 0.02
      groupRef.current.scale.setScalar(scale)
    } else if (groupRef.current) {
      groupRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1)
    }
  })
  
  // For supernova, render the special effect
  if (isSupernova) {
    return (
      <group position={position}>
        <SupernovaEffect position={[0, 0, 0]} color={project.color} size={sizeMultiplier} />
        <Text
          position={[0, -sizeMultiplier * 5, 0]}
          fontSize={0.6}
          color="#ffffff"
          anchorX="center"
          anchorY="top"
          outlineWidth={0.05}
          outlineColor="#000000"
        >
          {project.metrics?.files || '64,806 files'}
        </Text>
        <Text
          position={[0, -sizeMultiplier * 5 - 0.8, 0]}
          fontSize={0.35}
          color="#aaaaaa"
          anchorX="center"
          anchorY="top"
        >
          SUPERMASSIVE
        </Text>
      </group>
    )
  }

  return (
    <group position={position} ref={groupRef}>
      {/* Main planet with procedural surface */}
      <mesh
        ref={planetRef}
        onClick={onPlanetClick}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <sphereGeometry args={[sizeMultiplier, 64, 64]} />
        <shaderMaterial
          vertexShader={planetVertexShader}
          fragmentShader={planetFragmentShader}
          uniforms={{
            baseColor: { value: new THREE.Color(project.color) },
            secondaryColor: { value: secondaryColor },
            time: { value: 0 },
            seed: { value: seed },
            planetType: { value: planetType }
          }}
        />
      </mesh>
      
      {/* Atmosphere glow */}
      <mesh ref={atmosphereRef} scale={1.15}>
        <sphereGeometry args={[sizeMultiplier, 32, 32]} />
        <meshBasicMaterial
          color={project.color}
          transparent
          opacity={hovered ? 0.35 : 0.2}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      
      {/* Outer atmosphere haze */}
      <mesh scale={1.25}>
        <sphereGeometry args={[sizeMultiplier, 24, 24]} />
        <meshBasicMaterial
          color={project.color}
          transparent
          opacity={hovered ? 0.2 : 0.1}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      
      {/* Saturn-like rings */}
      {hasRings && (
        <mesh ref={ringsRef} rotation={[Math.PI / 2.5, 0, Math.PI / 8]}>
          <ringGeometry args={[sizeMultiplier * 1.4, sizeMultiplier * 2.2, 64]} />
          <meshBasicMaterial
            color={project.color}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
            blending={THREE.NormalBlending}
            depthWrite={false}
          />
        </mesh>
      )}
      
      {/* Hover indicator ring */}
      {hovered && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[sizeMultiplier * 1.3, sizeMultiplier * 1.35, 48]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
    </group>
  )
}
