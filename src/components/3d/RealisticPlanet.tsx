'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface RealisticPlanetProps {
  position: [number, number, number]
  color: string
  size: number
  isSupernova?: boolean
  planetType?: 'rocky' | 'gas' | 'ice' | 'desert'
  hasLife?: boolean  // Show city lights on night side
  isScanned?: boolean  // Only allow click interaction if scanned
  onClick?: () => void
  onHover?: (hovered: boolean) => void
}

export function RealisticPlanet({
  position,
  color,
  size,
  isSupernova = false,
  planetType = 'rocky',
  hasLife = false,
  isScanned = true,
  onClick,
  onHover
}: RealisticPlanetProps) {
  const planetRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const coronaRef = useRef<THREE.Mesh>(null)
  const cloudsRef = useRef<THREE.Mesh>(null)
  const ringsRef = useRef<THREE.Mesh>(null)

  // Procedural planet shader
  const vertexShader = `
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

  // Cloud layer shader
  const cloudFragmentShader = `
    uniform float time;
    uniform vec3 color;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;

    // Simple noise for clouds
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
      // Animated cloud patterns
      vec3 pos = vPosition * 2.0 + vec3(time * 0.3, 0.0, time * 0.1);
      float clouds = fbm(pos);

      // Make clouds wispy and transparent
      clouds = smoothstep(0.4, 0.7, clouds);

      // Fresnel for edge glow
      vec3 viewDirection = normalize(cameraPosition - vPosition);
      float fresnel = pow(1.0 - max(dot(viewDirection, vNormal), 0.0), 2.0);

      // Cloud color with slight transparency
      vec3 cloudColor = vec3(1.0) * (clouds * 0.7 + fresnel * 0.3);
      float opacity = clouds * 0.4 + fresnel * 0.2;

      gl_FragColor = vec4(cloudColor, opacity);
    }
  `

  const fragmentShader = `
    uniform vec3 color;
    uniform float time;
    uniform float brightness;
    uniform float planetType;
    uniform float hasCities; // 1.0 for inhabited planets
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

    // Enhanced noise function with more detail
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
      float frequency = 1.0;

      for(int i = 0; i < 5; i++) {
        value += amplitude * noise(p * frequency);
        frequency *= 2.17;
        amplitude *= 0.47;
      }
      return value;
    }

    // Voronoi for craters and city clusters
    vec2 voronoi(vec3 p) {
      vec3 i = floor(p);
      vec3 f = fract(p);
      float minDist = 1.0;
      float secondMin = 1.0;

      for(int x = -1; x <= 1; x++) {
        for(int y = -1; y <= 1; y++) {
          for(int z = -1; z <= 1; z++) {
            vec3 neighbor = vec3(float(x), float(y), float(z));
            vec3 point = vec3(hash(i + neighbor), hash(i + neighbor + 100.0), hash(i + neighbor + 200.0));
            vec3 diff = neighbor + point - f;
            float dist = length(diff);
            if(dist < minDist) {
              secondMin = minDist;
              minDist = dist;
            } else if(dist < secondMin) {
              secondMin = dist;
            }
          }
        }
      }
      return vec2(minDist, secondMin);
    }

    // Calculate perturbed normal for bump mapping
    vec3 perturbNormal(vec3 pos, vec3 normal, float bumpScale) {
      float eps = 0.05;
      float base = fbm(pos);
      float dx = fbm(pos + vec3(eps, 0.0, 0.0)) - base;
      float dy = fbm(pos + vec3(0.0, eps, 0.0)) - base;
      float dz = fbm(pos + vec3(0.0, 0.0, eps)) - base;

      vec3 grad = vec3(dx, dy, dz) * bumpScale;
      return normalize(normal - grad);
    }

    // City lights pattern
    float cityLights(vec3 pos, float landMask, float latitude) {
      // Cities cluster near coasts and avoid poles/equator extremes
      float coastPreference = smoothstep(0.4, 0.55, landMask) * smoothstep(0.7, 0.55, landMask);
      float latitudePreference = smoothstep(0.0, 0.3, abs(latitude)) * smoothstep(0.8, 0.5, abs(latitude));

      // High frequency noise for individual lights
      float cityNoise = fbm(pos * 30.0);
      float clusterNoise = fbm(pos * 8.0);

      // Create clustered city patterns
      float cities = smoothstep(0.55, 0.7, cityNoise) * smoothstep(0.4, 0.6, clusterNoise);
      cities *= coastPreference * latitudePreference;

      // Add bright city centers
      vec2 vor = voronoi(pos * 15.0);
      float cityCenters = smoothstep(0.15, 0.05, vor.x) * clusterNoise;

      return cities * 0.6 + cityCenters * 0.4;
    }

    // Crater generation for rocky planets
    float craters(vec3 pos) {
      float totalCraters = 0.0;

      // Large craters
      vec2 vor1 = voronoi(pos * 4.0);
      float largeCrater = smoothstep(0.3, 0.2, vor1.x) * (1.0 - smoothstep(0.1, 0.0, vor1.x));

      // Medium craters
      vec2 vor2 = voronoi(pos * 10.0);
      float medCrater = smoothstep(0.25, 0.15, vor2.x) * (1.0 - smoothstep(0.08, 0.0, vor2.x));

      // Small craters
      vec2 vor3 = voronoi(pos * 25.0);
      float smallCrater = smoothstep(0.2, 0.1, vor3.x) * (1.0 - smoothstep(0.05, 0.0, vor3.x));

      totalCraters = largeCrater * 0.4 + medCrater * 0.35 + smallCrater * 0.25;
      return totalCraters;
    }

    void main() {
      vec3 pos = vPosition * 3.0 + vec3(time * 0.1);

      // Large continents/oceans
      float continents = fbm(pos * 0.8);

      // Medium terrain features
      float terrain = fbm(pos * 2.5 + vec3(50.0));

      // Fine surface detail
      float detail = fbm(pos * 6.0 + vec3(100.0));

      // Planet type specific patterns
      float surfacePattern;
      float roughness;
      float specularity;
      vec3 atmosColor;
      float landMask = 0.0;
      float craterAmount = 0.0;

      if (planetType < 0.25) {
        // Rocky terrestrial planet
        surfacePattern = continents * 0.5 + terrain * 0.3 + detail * 0.2;
        roughness = 0.8;
        specularity = 0.3;
        atmosColor = vec3(0.4, 0.6, 1.0);
        landMask = smoothstep(0.45, 0.55, continents); // Land vs ocean
        craterAmount = craters(pos * 1.5) * (1.0 - landMask) * 0.3; // Craters more visible on barren areas
      } else if (planetType < 0.5) {
        // Gas giant - bands and storms
        float bandY = sin(vPosition.y * 12.0 + terrain * 2.0);
        float storms = fbm(pos * 4.0 + vec3(time * 0.5, 0.0, 0.0));
        surfacePattern = bandY * 0.3 + storms * 0.4 + terrain * 0.3;
        roughness = 0.1;
        specularity = 0.05;
        atmosColor = vec3(0.8, 0.7, 0.5);
      } else if (planetType < 0.75) {
        // Ice planet - crystalline
        vec2 iceVor = voronoi(pos * 6.0);
        float iceCracks = smoothstep(0.1, 0.05, iceVor.y - iceVor.x);
        surfacePattern = continents * 0.3 + iceCracks * 0.4 + detail * 0.3;
        roughness = 0.4;
        specularity = 0.8;
        atmosColor = vec3(0.6, 0.8, 1.0);
      } else {
        // Desert planet - dunes
        float dunes = sin(vPosition.x * 20.0 + terrain * 5.0) * 0.5 + 0.5;
        surfacePattern = continents * 0.3 + dunes * 0.4 + detail * 0.3;
        roughness = 0.9;
        specularity = 0.1;
        atmosColor = vec3(1.0, 0.8, 0.6);
        craterAmount = craters(pos * 2.0) * 0.2;
      }

      // Add crater depth
      surfacePattern -= craterAmount;

      // Latitude effects
      float latitude = vPosition.y;
      float absLatitude = abs(latitude);
      float bands = smoothstep(0.3, 0.7, sin(absLatitude * 8.0 + surfacePattern * 2.0) * 0.5 + 0.5);
      float poles = smoothstep(0.6, 0.95, absLatitude);

      // Light direction (sun position)
      vec3 lightDir = normalize(vec3(1.0, 0.5, 1.0));
      vec3 viewDirection = normalize(cameraPosition - vPosition);

      // Normal perturbation
      float bumpStrength = planetType < 0.25 ? 0.3 : planetType < 0.5 ? 0.1 : planetType < 0.75 ? 0.25 : 0.35;
      vec3 perturbedNormal = perturbNormal(pos * 2.0, vNormal, bumpStrength);

      // Day/night calculation
      float NdotL = dot(perturbedNormal, lightDir);
      float daylight = smoothstep(-0.1, 0.2, NdotL); // Soft terminator
      float diffuse = max(NdotL, 0.0) * 0.85 + 0.15;

      // Specular
      vec3 halfDir = normalize(lightDir + viewDirection);
      float NdotH = max(dot(perturbedNormal, halfDir), 0.0);
      float specular = pow(NdotH, 32.0 / roughness) * specularity * max(NdotL, 0.0);

      // Surface color
      vec3 surfaceColor = color * (surfacePattern * 0.7 + 0.3) * (bands * 0.3 + 0.7);
      surfaceColor = mix(surfaceColor, surfaceColor * 1.6, poles);
      surfaceColor = surfaceColor * diffuse + vec3(1.0) * specular;

      // === CITY LIGHTS ON NIGHT SIDE ===
      if (hasCities > 0.5 && planetType < 0.25) {
        float cities = cityLights(pos * 2.0, landMask, latitude);
        float nightIntensity = 1.0 - daylight;

        // City light colors (warm yellow/orange)
        vec3 cityColor = vec3(1.0, 0.85, 0.5);

        // Flickering effect
        float flicker = 0.9 + 0.1 * sin(time * 10.0 + pos.x * 50.0);

        // Add city lights only on night side
        vec3 cityGlow = cityColor * cities * nightIntensity * flicker * 2.0;
        surfaceColor += cityGlow;
      }

      // Atmospheric scattering
      float viewAngle = dot(viewDirection, vNormal);
      float rayleigh = pow(1.0 - abs(viewAngle), 3.0) * 0.6;
      float mie = pow(max(dot(viewDirection, lightDir), 0.0), 8.0) * 0.4;
      float density = smoothstep(0.0, 0.5, 1.0 - abs(viewAngle));
      vec3 atmosphere = atmosColor * color * (rayleigh + mie) * density;

      // Terminator glow (atmosphere scatters light at day/night boundary)
      float terminatorGlow = smoothstep(-0.2, 0.0, NdotL) * smoothstep(0.3, 0.0, NdotL);
      atmosphere += atmosColor * terminatorGlow * 0.3;

      // Fresnel rim
      float fresnel = pow(1.0 - max(viewAngle, 0.0), 2.5);
      vec3 rimLight = color * fresnel * 0.8;

      // Combine
      surfaceColor = surfaceColor + atmosphere + rimLight;
      float emissive = brightness * (1.0 + fresnel * 0.5);

      gl_FragColor = vec4(surfaceColor * emissive, 1.0);
    }
  `

  useFrame((state) => {
    if (planetRef.current) {
      // Slow continuous rotation
      planetRef.current.rotation.y += 0.001
      planetRef.current.rotation.x += 0.0004

      // Update shader time less frequently for better performance
      const material = planetRef.current.material as THREE.ShaderMaterial
      material.uniforms.time.value = state.clock.elapsedTime * 0.05
    }

    // Clouds rotate faster than planet for realism
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.0015
      const cloudMaterial = cloudsRef.current.material as THREE.ShaderMaterial
      cloudMaterial.uniforms.time.value = state.clock.elapsedTime * 0.08
    }

    // Rings slowly rotate
    if (ringsRef.current) {
      ringsRef.current.rotation.z += 0.0003
    }

    if (coronaRef.current && isSupernova) {
      // Gentle rotation and subtle pulse for supernova
      coronaRef.current.rotation.z += 0.001
      const pulse = Math.sin(state.clock.elapsedTime * 0.5) * 0.1 + 1.0
      coronaRef.current.scale.setScalar(1.8 * pulse)
    }

    if (glowRef.current && onHover) {
      // Subtle glow pulse when planet is hovered
      const glowPulse = Math.sin(state.clock.elapsedTime * 2) * 0.05 + 1.0
      glowRef.current.scale.setScalar(1.6 * glowPulse)
    }
  })

  return (
    <group position={position}>
      {/* Main planet with shader */}
      <mesh
        ref={planetRef}
        position={[0, 0, 0]}
        onClick={(e) => {
          e.stopPropagation()
          if (isScanned) {
            onClick?.()
          }
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          onHover?.(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={(e) => {
          e.stopPropagation()
          onHover?.(false)
          document.body.style.cursor = 'auto'
        }}
      >
        <sphereGeometry args={[size, 64, 64]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={{
            color: { value: new THREE.Color(color) },
            time: { value: 0 },
            brightness: { value: isSupernova ? 3.0 : 2.0 },
            planetType: { value: planetType === 'rocky' ? 0.1 : planetType === 'gas' ? 0.4 : planetType === 'ice' ? 0.6 : 0.9 },
            hasCities: { value: hasLife ? 1.0 : 0.0 }
          }}
        />
      </mesh>

      {/* Cloud layer - only for rocky and ice planets */}
      {(planetType === 'rocky' || planetType === 'ice') && (
        <mesh ref={cloudsRef} scale={1.02}>
          <sphereGeometry args={[size, 48, 48]} />
          <shaderMaterial
            vertexShader={vertexShader}
            fragmentShader={cloudFragmentShader}
            uniforms={{
              time: { value: 0 },
              color: { value: new THREE.Color(color) }
            }}
            transparent
            depthWrite={false}
            blending={THREE.NormalBlending}
          />
        </mesh>
      )}

      {/* Ring system - for gas giants */}
      {planetType === 'gas' && (
        <>
          {/* Main ring */}
          <mesh
            ref={ringsRef}
            rotation={[Math.PI / 2.5, 0, 0]}
          >
            <ringGeometry args={[size * 1.4, size * 2.2, 64]} />
            <meshStandardMaterial
              color={color}
              transparent
              opacity={0.5}
              side={THREE.DoubleSide}
              roughness={0.8}
              metalness={0.1}
            />
          </mesh>
          {/* Inner ring for depth */}
          <mesh rotation={[Math.PI / 2.5, 0, 0]}>
            <ringGeometry args={[size * 1.2, size * 1.35, 48]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.3}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </>
      )}

      {/* Inner glow - stronger for more visible atmosphere */}
      <mesh scale={1.28}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.6}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Outer atmosphere - more visible */}
      <mesh ref={glowRef} scale={1.65}>
        <sphereGeometry args={[size, 24, 24]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.4}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Extra atmospheric haze layer for depth */}
      <mesh scale={2.0}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.15}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Corona for supernova - enhanced with multiple rings */}
      {isSupernova && (
        <>
          {/* Main pulsing corona ring */}
          <mesh ref={coronaRef} scale={1.8}>
            <ringGeometry args={[size * 1.5, size * 2.0, 32]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.5}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          
          {/* Outer corona ring for supernova */}
          <mesh rotation={[Math.PI / 4, 0, 0]} scale={2.2}>
            <ringGeometry args={[size * 1.6, size * 2.0, 24]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.25}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>

          {/* Lens flare streaks - cross pattern */}
          <mesh rotation={[0, 0, 0]}>
            <planeGeometry args={[size * 10, size * 0.4]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.18}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <planeGeometry args={[size * 10, size * 0.4]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.18}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
          
          {/* Diagonal lens flare streaks */}
          <mesh rotation={[0, 0, Math.PI / 4]}>
            <planeGeometry args={[size * 7, size * 0.3]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.12}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
          <mesh rotation={[0, 0, -Math.PI / 4]}>
            <planeGeometry args={[size * 7, size * 0.3]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.12}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>

          {/* Hexagonal lens flare aperture effect */}
          <mesh scale={3.0}>
            <ringGeometry args={[size * 2.0, size * 2.4, 6]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.15}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        </>
      )}

      {/* Enhanced point light */}
      <pointLight
        color={color}
        intensity={isSupernova ? 15 : 5}
        distance={isSupernova ? 40 : 20}
        decay={2}
      />
      
      {/* Extra bright core light for supernova */}
      {isSupernova && (
        <pointLight
          color={color}
          intensity={8}
          distance={25}
          decay={1.5}
        />
      )}
    </group>
  )
}
