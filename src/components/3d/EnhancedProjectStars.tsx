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

  // 2D hash for Voronoi
  vec2 hash2(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return fract(sin(p) * 43758.5453);
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

  // Domain warping for organic gas giant patterns (Inigo Quilez technique)
  float domainWarp(vec3 p) {
    vec3 q = vec3(
      fbm(p + vec3(0.0, 0.0, 0.0)),
      fbm(p + vec3(5.2, 1.3, 2.8)),
      fbm(p + vec3(2.1, 7.3, 4.2))
    );
    vec3 r = vec3(
      fbm(p + 4.0 * q + vec3(1.7, 9.2, 3.4)),
      fbm(p + 4.0 * q + vec3(8.3, 2.8, 5.1)),
      fbm(p + 4.0 * q + vec3(3.9, 6.1, 1.8))
    );
    return fbm(p + 4.0 * r);
  }

  // Voronoi for ice cracks
  vec2 voronoi(vec2 p) {
    vec2 n = floor(p);
    vec2 f = fract(p);
    float minDist = 1.0;
    float secondDist = 1.0;
    for(int j = -1; j <= 1; j++) {
      for(int i = -1; i <= 1; i++) {
        vec2 neighbor = vec2(float(i), float(j));
        vec2 point = hash2(n + neighbor);
        vec2 diff = neighbor + point - f;
        float dist = length(diff);
        if(dist < minDist) {
          secondDist = minDist;
          minDist = dist;
        } else if(dist < secondDist) {
          secondDist = dist;
        }
      }
    }
    return vec2(minDist, secondDist - minDist);
  }

  // Vortex storm for gas giants
  float vortexStorm(vec3 pos, vec2 center, float radius, float t) {
    vec2 toCenter = pos.xy - center;
    float dist = length(toCenter);
    float angle = atan(toCenter.y, toCenter.x);
    float swirl = (1.0 - smoothstep(0.0, radius, dist)) * 8.0;
    float swirlAngle = angle + swirl + t * 0.3;
    vec2 swirlPos = center + vec2(cos(swirlAngle), sin(swirlAngle)) * dist;
    float stormClouds = fbm(vec3(swirlPos * 12.0, t * 0.1));
    float stormMask = 1.0 - smoothstep(0.0, radius, dist);
    return stormClouds * stormMask;
  }

  // Aurora effect for ice planets
  vec3 aurora(vec3 pos, float t) {
    float polarFactor = pow(abs(pos.y), 4.0);
    if(polarFactor < 0.1) return vec3(0.0);
    float longitude = atan(pos.z, pos.x);
    float curtain1 = sin(longitude * 5.0 + t * 0.5) * 0.5 + 0.5;
    float curtain2 = sin(longitude * 3.0 - t * 0.3 + 1.0) * 0.5 + 0.5;
    float curtain3 = sin(longitude * 7.0 + t * 0.7 + 2.0) * 0.5 + 0.5;
    float shimmer = fbm(vec3(longitude * 10.0, pos.y * 5.0, t * 2.0));
    vec3 green = vec3(0.2, 1.0, 0.4);
    vec3 blue = vec3(0.3, 0.5, 1.0);
    vec3 purple = vec3(0.6, 0.2, 0.8);
    vec3 auroraColor = green * curtain1 + blue * curtain2 + purple * curtain3;
    auroraColor *= shimmer;
    float auroraIntensity = smoothstep(0.5, 0.85, polarFactor);
    return auroraColor * auroraIntensity * 0.6;
  }

  void main() {
    vec3 pos = vPosition * 3.0 + seed;

    // Base terrain noise
    float terrain = fbm(pos * 2.0);
    float detail = fbm(pos * 8.0) * 0.3;
    float pattern = terrain + detail;

    vec3 color;

    if (planetType == 0) {
      // Rocky planet with polar ice caps and oceans
      float continentHeight = fbm(pos * 1.5) + fbm(pos * 4.0) * 0.3;
      float seaLevel = 0.45;
      float isLand = step(seaLevel, continentHeight);

      // Ocean colors with depth
      vec3 deepOcean = vec3(0.02, 0.08, 0.18);
      vec3 shallowOcean = vec3(0.1, 0.25, 0.4);
      float oceanDepth = smoothstep(0.0, seaLevel, continentHeight);
      vec3 oceanColor = mix(deepOcean, shallowOcean, oceanDepth);

      // Land colors by elevation
      float landHeight = (continentHeight - seaLevel) / (1.0 - seaLevel);
      vec3 lowland = baseColor * 0.8;
      vec3 highland = baseColor * 1.1;
      vec3 mountain = secondaryColor * 0.9;
      vec3 landColor = mix(lowland, highland, smoothstep(0.0, 0.4, landHeight));
      landColor = mix(landColor, mountain, smoothstep(0.4, 0.7, landHeight));

      color = mix(oceanColor, landColor, isLand);

      // Polar ice caps
      float polarY = abs(vPosition.y);
      float polarNoise = fbm(pos * 4.0) * 0.15;
      float iceCap = smoothstep(0.65, 0.85, polarY + polarNoise);
      vec3 iceColor = vec3(0.92, 0.96, 1.0);
      color = mix(color, iceColor, iceCap * 0.9);

    } else if (planetType == 1) {
      // Gas giant with domain warping for organic Jupiter-like bands
      float y = vPosition.y;
      vec3 stretchedPos = pos * vec3(1.0, 0.2, 1.0);

      // Domain warping for organic flow
      float warp = domainWarp(stretchedPos * 0.5 + vec3(time * 0.02, 0.0, 0.0));
      vec3 warpedPos = stretchedPos + vec3(warp * 0.4, 0.0, warp * 0.3);

      // Banded structure with warping
      float bandFreq = 15.0;
      float bands = sin(warpedPos.y * bandFreq) * 0.5 + 0.5;

      // Turbulence at band edges
      float bandEdge = 1.0 - abs(fract(warpedPos.y * bandFreq / 6.28318) - 0.5) * 2.0;
      float edgeTurbulence = turbulence(pos * 3.0 + vec3(time * 0.03, 0.0, 0.0));
      bands = mix(bands, bands + edgeTurbulence * 0.15, bandEdge);

      // Multiple band colors
      vec3 bandColor1 = baseColor;
      vec3 bandColor2 = secondaryColor;
      vec3 bandColor3 = mix(baseColor, secondaryColor, 0.5) * 1.15;
      vec3 bandColor4 = baseColor * 0.7;

      float bandSelect = sin(y * bandFreq * 0.4 + warp) * 0.5 + 0.5;
      float bandSelect2 = sin(y * bandFreq * 0.2) * 0.5 + 0.5;
      vec3 currentBandColor = mix(bandColor1, bandColor2, bandSelect);
      currentBandColor = mix(currentBandColor, bandColor3, smoothstep(0.3, 0.7, bands));
      currentBandColor = mix(currentBandColor, bandColor4, bandSelect2 * 0.3);

      color = currentBandColor;

      // Swirling storm clouds
      float storms = domainWarp(pos * 2.0 + vec3(time * 0.05, 0.0, time * 0.02));
      color = mix(color, baseColor * 1.3, storms * 0.2);

      // Great Red Spot with vortex swirl
      vec2 spotCenter = vec2(0.25, 0.12);
      float stormPattern = vortexStorm(vPosition, spotCenter, 0.28, time);
      vec3 spotColor = mix(secondaryColor * 1.4, baseColor * 0.9, stormPattern);
      float spotMask = 1.0 - smoothstep(0.0, 0.28, length(vPosition.xy - spotCenter));
      color = mix(color, spotColor, spotMask * 0.6);

    } else if (planetType == 2) {
      // Ice planet with Voronoi cracks and aurora
      vec3 p = pos * 4.0;

      // Base ice with subtle variation
      float iceNoise = fbm(p * 2.0);
      vec3 baseIce = mix(vec3(0.75, 0.88, 0.98), vec3(0.55, 0.75, 0.92), iceNoise);

      // Voronoi cracks
      vec2 vor = voronoi(p.xy * 2.5 + p.z * 0.5);
      float cracks = smoothstep(0.0, 0.06, vor.y);
      vec3 crackColor = vec3(0.25, 0.45, 0.65);

      color = mix(crackColor, baseIce, cracks);

      // Frozen ocean regions
      float oceanRegion = smoothstep(0.35, 0.55, fbm(p * 0.4));
      vec3 frozenOcean = vec3(0.18, 0.32, 0.48);
      color = mix(color, frozenOcean, oceanRegion * 0.4);

      // Subsurface glow
      float subsurface = pow(iceNoise, 2.0) * 0.25;
      color += vec3(0.15, 0.35, 0.55) * subsurface;

      // Animated aurora at poles
      color += aurora(vPosition, time);

    } else {
      // Lava planet - molten surface with flowing rivers
      float lava = fbm(pos * 4.0 + vec3(time * 0.04, 0.0, 0.0));
      float crust = smoothstep(0.35, 0.65, lava);

      vec3 hotColor = vec3(1.0, 0.35, 0.0);
      vec3 veryHot = vec3(1.0, 0.7, 0.2);
      vec3 crustColor = baseColor * 0.25;

      color = mix(hotColor, crustColor, crust);

      // Glowing cracks
      float cracks = 1.0 - smoothstep(0.0, 0.12, abs(lava - 0.5));
      color = mix(color, veryHot, cracks * 0.7);

      // Lava rivers with flow
      float rivers = smoothstep(0.42, 0.58, fbm(pos * 6.0 + vec3(time * 0.03, time * 0.01, 0.0)));
      color += vec3(1.0, 0.25, 0.0) * rivers * 0.4;

      // Heat shimmer
      float shimmer = fbm(pos * 12.0 + vec3(0.0, time * 0.2, 0.0));
      color += vec3(0.3, 0.1, 0.0) * shimmer * (1.0 - crust) * 0.3;
    }

    // Enhanced lighting with terminator
    vec3 lightDir = normalize(vec3(1.0, 0.5, 0.8));
    float diff = max(dot(vNormal, lightDir), 0.0);
    float ambient = 0.25;

    // Day/night terminator coloring
    float sunDot = dot(vNormal, lightDir);
    float dayAmount = smoothstep(-0.1, 0.3, sunDot);
    vec3 terminatorGlow = vec3(1.0, 0.4, 0.15) * smoothstep(-0.15, 0.05, sunDot) * (1.0 - smoothstep(0.05, 0.25, sunDot)) * 0.3;

    color *= (ambient + diff * 0.75);
    color += terminatorGlow;

    // Fresnel rim lighting with atmospheric tint
    vec3 viewDir = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 2.5);
    vec3 rimColor = mix(baseColor, vec3(0.6, 0.8, 1.0), 0.3);
    color += rimColor * fresnel * 0.35;

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
