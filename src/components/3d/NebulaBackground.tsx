'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Nebula background with animated gradient colors for deep space atmosphere
 */
export function NebulaBackground() {
  const meshRef = useRef<THREE.Mesh>(null)

  // Animate the nebula subtly
  useFrame(({ clock }) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial
      material.uniforms.time.value = clock.getElapsedTime() * 0.05
    }
  })

  // Create a custom shader material for the nebula effect
  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `

  const fragmentShader = `
    uniform float time;
    varying vec2 vUv;

    // Improved noise function for smoother patterns
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);

      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));

      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    // Fractional Brownian motion for realistic nebula structure
    float fbm(vec2 p) {
      float value = 0.0;
      float amplitude = 0.5;
      float frequency = 1.0;

      for(int i = 0; i < 6; i++) {
        value += amplitude * noise(p * frequency);
        frequency *= 2.0;
        amplitude *= 0.5;
      }
      return value;
    }

    // Voronoi for star cluster regions
    float voronoi(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);

      float minDist = 1.0;
      for(int x = -1; x <= 1; x++) {
        for(int y = -1; y <= 1; y++) {
          vec2 neighbor = vec2(float(x), float(y));
          vec2 point = hash(i + neighbor) * vec2(hash(i + neighbor + vec2(1.0, 0.0)));
          point = 0.5 + 0.5 * sin(time * 0.1 + 6.28 * point);
          vec2 diff = neighbor + point - f;
          float dist = length(diff);
          minDist = min(minDist, dist);
        }
      }
      return minDist;
    }

    void main() {
      vec2 uv = vUv;

      // Multi-layer nebula colors (realistic astronomical nebulae)
      vec3 deepPurple = vec3(0.12, 0.02, 0.35);   // Deep purple core
      vec3 cosmicBlue = vec3(0.02, 0.1, 0.4);     // Dark blue
      vec3 nebulaPink = vec3(0.3, 0.05, 0.25);    // Magenta emission
      vec3 electricCyan = vec3(0.05, 0.2, 0.35);  // Cyan glow
      vec3 royalPurple = vec3(0.15, 0.08, 0.4);   // Purple-blue mix
      vec3 deepSpace = vec3(0.02, 0.02, 0.08);    // Near black void

      // Large-scale nebula structure with swirling motion
      vec2 swirl = uv - 0.5;
      float angle = atan(swirl.y, swirl.x);
      float radius = length(swirl);
      float spiral = angle + radius * 3.0 + time * 0.05;

      float layer1 = fbm(uv * 2.0 + vec2(cos(spiral) * 0.2, sin(spiral) * 0.2) + time * 0.015);

      // Medium nebula filaments with directional flow
      float layer2 = fbm(uv * 4.5 - vec2(time * 0.04, time * 0.025));

      // Small-scale detail and glowing wisps
      float layer3 = fbm(uv * 8.0 + vec2(time * 0.06, -time * 0.05));

      // Micro detail for depth perception
      float layer4 = fbm(uv * 14.0 - vec2(time * 0.08, time * 0.1));

      // Volumetric dust lanes
      float dustLanes = fbm(uv * 3.0 + vec2(time * 0.02, 0.0));
      dustLanes = smoothstep(0.3, 0.7, dustLanes);

      // Star cluster regions using voronoi
      float clusters = voronoi(uv * 6.0);
      clusters = smoothstep(0.0, 0.4, clusters);

      // Build color with depth layers
      vec3 color = mix(deepSpace, deepPurple, layer1 * 1.2);
      color = mix(color, cosmicBlue, layer2 * 0.8);
      color = mix(color, nebulaPink, pow(layer3, 1.5) * 0.6);
      color = mix(color, electricCyan, layer4 * 0.5);
      color = mix(color, royalPurple, (1.0 - dustLanes) * 0.4);

      // Radial density with asymmetry
      vec2 center = vec2(0.5 + sin(time * 0.02) * 0.05, 0.5 + cos(time * 0.03) * 0.05);
      float dist = distance(uv, center);
      float radialDensity = 1.0 - smoothstep(0.0, 0.75, dist);

      // Add emission glow in dense regions
      float emission = pow(layer2 * layer3, 0.5) * radialDensity;
      color += nebulaPink * emission * 0.4;
      color += electricCyan * (1.0 - emission) * radialDensity * 0.3;

      // Volumetric light scattering effect
      float scattering = pow(radialDensity, 2.0) * 0.5;
      color += vec3(0.1, 0.05, 0.2) * scattering;

      // Apply dust lane darkening
      color *= 0.7 + dustLanes * 0.5;

      // Add star cluster brightness
      color += vec3(0.15, 0.1, 0.2) * (1.0 - clusters) * 0.5;

      // Bright emission spots (protostars)
      float spots = smoothstep(0.94, 1.0, fbm(uv * 18.0 + time * 0.015));
      color += vec3(1.0, 0.9, 0.95) * spots * 0.5;

      // Add subtle color variation based on position
      color.r += sin(uv.x * 3.14159 + time * 0.1) * 0.02;
      color.b += cos(uv.y * 3.14159 + time * 0.08) * 0.02;

      // Overall brightness and contrast adjustment
      color = pow(color, vec3(0.95)); // Slight gamma for richer darks
      color *= 1.4; // Boost overall brightness

      gl_FragColor = vec4(color, 1.0);
    }
  `

  return (
    <mesh ref={meshRef} position={[0, 0, -200]} scale={[500, 500, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          time: { value: 0.0 }
        }}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  )
}
