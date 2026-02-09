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
  
  // Turbulence for gas giant band edges
  float turbulence(vec3 p) {
    float value = 0.0;
    float amplitude = 1.0;
    for(int i = 0; i < 4; i++) {
      value += amplitude * abs(noise(p) - 0.5);
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
      // Rocky planet with polar ice caps
      float continents = smoothstep(0.4, 0.6, pattern);
      vec3 landColor = baseColor * 1.2;
      vec3 lowlandColor = baseColor * 0.7;
      color = mix(lowlandColor, landColor, continents);
      
      // Mountains
      float mountains = smoothstep(0.65, 0.8, pattern);
      color = mix(color, secondaryColor, mountains * 0.5);
      
      // Polar ice caps - white/blue at poles
      float polarY = abs(vPosition.y);
      float iceCap = smoothstep(0.7, 0.9, polarY + fbm(pos * 4.0) * 0.15);
      vec3 iceColor = vec3(0.9, 0.95, 1.0);
      color = mix(color, iceColor, iceCap * 0.8);
      
    } else if (planetType == 1) {
      // Gas giant - Jupiter-like swirling bands with turbulence
      
      // Create more realistic banded structure
      float y = vPosition.y;
      float bandFreq = 12.0;
      float bandNoise = fbm(vec3(pos.x * 2.0, y * 0.5, pos.z * 2.0)) * 0.3;
      float bands = sin(y * bandFreq + bandNoise * 3.0) * 0.5 + 0.5;
      
      // Add turbulence at band edges for more realistic look
      float bandEdge = abs(fract(y * bandFreq / 6.28318) - 0.5) * 2.0;
      float edgeTurbulence = turbulence(pos * 3.0 + vec3(time * 0.05, 0.0, 0.0));
      bands = mix(bands, bands + edgeTurbulence * 0.2, smoothstep(0.3, 0.5, bandEdge));
      
      // Color variation in bands
      vec3 bandColor1 = baseColor;
      vec3 bandColor2 = secondaryColor;
      vec3 bandColor3 = mix(baseColor, secondaryColor, 0.5) * 1.2;
      
      float bandSelect = sin(y * bandFreq * 0.5) * 0.5 + 0.5;
      vec3 currentBandColor = mix(bandColor1, bandColor2, bandSelect);
      currentBandColor = mix(currentBandColor, bandColor3, smoothstep(0.4, 0.6, bands));
      
      color = currentBandColor;
      
      // Swirling storms
      float storms = fbm(pos * 5.0 + vec3(time * 0.08, 0.0, time * 0.03));
      color = mix(color, baseColor * 1.4, storms * 0.25);
      
      // Great Red Spot style feature
      vec2 spotCenter = vec2(0.25, 0.15);
      float spotDist = length(vPosition.xy - spotCenter);
      float spot = 1.0 - smoothstep(0.0, 0.25, spotDist);
      float spotSwirl = fbm(vec3(vPosition.xy * 10.0 + time * 0.1, seed));
      vec3 spotColor = mix(secondaryColor * 1.3, baseColor * 0.8, spotSwirl);
      color = mix(color, spotColor, spot * 0.5);
      
    } else if (planetType == 2) {
      // Ice planet - frozen surface with cracks
      float ice = fbm(pos * 6.0);
      float cracks = smoothstep(0.48, 0.52, fbm(pos * 12.0));
      
      color = mix(baseColor, secondaryColor, ice * 0.6);
      color = mix(color, vec3(0.9, 0.95, 1.0), cracks * 0.3);
      
      // Subtle aurora glow at poles
      float polarGlow = pow(abs(vPosition.y), 3.0) * 0.3;
      color += vec3(0.2, 0.5, 0.8) * polarGlow;
      
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
      
      // Lava rivers
      float rivers = smoothstep(0.45, 0.55, fbm(pos * 8.0 + vec3(time * 0.02, 0.0, 0.0)));
      color += vec3(1.0, 0.2, 0.0) * rivers * 0.3;
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

// Cloud layer shader for gas giants
const cloudVertexShader = `
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

const cloudFragmentShader = `
  uniform vec3 cloudColor;
  uniform float time;
  uniform float seed;
  
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  
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
    for(int i = 0; i < 4; i++) {
      value += amplitude * noise(p);
      p *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }
  
  void main() {
    vec3 pos = vPosition * 4.0 + seed + vec3(time * 0.1, 0.0, time * 0.05);
    
    // Wispy cloud pattern
    float clouds = fbm(pos * 2.0);
    clouds = smoothstep(0.3, 0.7, clouds);
    
    // Band-following clouds
    float bandInfluence = sin(vPosition.y * 10.0) * 0.5 + 0.5;
    clouds *= bandInfluence;
    
    // Swirl effect
    float swirl = fbm(pos * 3.0 + vec3(time * 0.15, 0.0, 0.0));
    clouds = mix(clouds, swirl, 0.3);
    
    // Lighting
    vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
    float diff = max(dot(vNormal, lightDir), 0.0);
    
    vec3 color = cloudColor * (0.5 + diff * 0.5);
    float alpha = clouds * 0.4;
    
    gl_FragColor = vec4(color, alpha);
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
  const cloudRef = useRef<THREE.Mesh>(null)
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
    
    // Rotate cloud layer at different speed
    if (cloudRef.current) {
      cloudRef.current.rotation.y += rotationSpeed * 1.5
      const material = cloudRef.current.material as THREE.ShaderMaterial
      if (material.uniforms) {
        material.uniforms.time.value = time
      }
    }
    
    
    if (groupRef.current && hovered) {
      const scale = 1.1 + Math.sin(time * 3) * 0.02
      groupRef.current.scale.setScalar(scale)
    } else if (groupRef.current) {
      groupRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1)
    }
  })
  
  // For supernova, render the special effect with clickable area
  if (isSupernova) {
    return (
      <group position={position}>
        <SupernovaEffect position={[0, 0, 0]} color={project.color} size={sizeMultiplier} />
        {/* Invisible clickable sphere for the supernova */}
        <mesh
          onClick={onPlanetClick}
          onPointerEnter={() => {
            document.body.style.cursor = 'pointer'
          }}
          onPointerLeave={() => {
            document.body.style.cursor = 'auto'
          }}
        >
          <sphereGeometry args={[sizeMultiplier * 2.5, 32, 32]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
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
      

      {/* Cloud layer for gas giants */}
      {planetType === 1 && (
        <mesh ref={cloudRef} scale={1.03}>
          <sphereGeometry args={[sizeMultiplier, 48, 48]} />
          <shaderMaterial
            vertexShader={cloudVertexShader}
            fragmentShader={cloudFragmentShader}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            uniforms={{
              cloudColor: { value: new THREE.Color(project.color).multiplyScalar(1.3) },
              time: { value: 0 },
              seed: { value: seed }
            }}
          />
        </mesh>
      )}
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
