import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Sequence } from 'remotion'
import { ThreeCanvas } from '@remotion/three'
import * as THREE from 'three'

// Project data for the tour
const projects = [
  { id: 'coulson-one', title: 'Coulson One', color: '#FF6B35', subtitle: '64,806 files' },
  { id: 'stancestream', title: 'StanceStream', color: '#00D9FF', subtitle: 'Multi-agent AI' },
  { id: 'portfolio-pro', title: 'Portfolio-Pro', color: '#9D4EDD', subtitle: '198 lessons' },
  { id: 'accessibility-checker', title: 'Accessibility Checker', color: '#06FFA5', subtitle: 'WCAG 2.1' },
  { id: 'codecraft', title: 'CodeCraft', color: '#FF006E', subtitle: 'Space game' },
]

// Mini planet for tour
function TourPlanet({ color, size, rotation }: { color: string; size: number; rotation: number }) {
  return (
    <group>
      <mesh rotation={[0.2, rotation, 0]}>
        <sphereGeometry args={[size, 48, 48]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          metalness={0.4}
          roughness={0.5}
        />
      </mesh>
      <mesh scale={1.2}>
        <sphereGeometry args={[size, 24, 24]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.3}
          side={THREE.BackSide}
        />
      </mesh>
      <pointLight color={color} intensity={3} distance={15} />
    </group>
  )
}

// Starfield background
function Stars({ frame }: { frame: number }) {
  const positions = Array.from({ length: 100 }, (_, i) => ({
    x: (Math.sin(i * 0.3) * 60) + Math.cos(i * 0.5) * 40,
    y: (Math.cos(i * 0.4) * 40) + Math.sin(i * 0.6) * 30,
    z: -80 + (i % 80) * 2,
  }))

  return (
    <group rotation={[0, frame * 0.0005, 0]}>
      {positions.map((pos, i) => (
        <mesh key={i} position={[pos.x, pos.y, pos.z]}>
          <sphereGeometry args={[0.15, 6, 6]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}
    </group>
  )
}

// Single project segment
function ProjectSegment({ project, segmentFrame }: { project: typeof projects[0]; segmentFrame: number }) {
  const { width, height } = useVideoConfig()

  const planetRotation = segmentFrame * 0.015

  // Animate in/out
  const opacity = interpolate(
    segmentFrame,
    [0, 30, 300, 330],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  )

  const scale = interpolate(
    segmentFrame,
    [0, 45],
    [0.5, 1],
    { extrapolateRight: 'clamp' }
  )

  return (
    <AbsoluteFill style={{ opacity }}>
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ position: [0, 0, 12], fov: 50 }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />

        <Stars frame={segmentFrame} />

        <group scale={scale}>
          <TourPlanet color={project.color} size={2.5} rotation={planetRotation} />
        </group>
      </ThreeCanvas>

      {/* Project info overlay */}
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'flex-start',
          paddingLeft: 100,
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div>
          <h2
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: 'white',
              margin: 0,
              textShadow: '0 4px 30px rgba(0,0,0,0.9)',
            }}
          >
            {project.title}
          </h2>
          <p
            style={{
              fontSize: 24,
              color: project.color,
              margin: '12px 0 0 0',
              textShadow: '0 2px 15px rgba(0,0,0,0.8)',
            }}
          >
            {project.subtitle}
          </p>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}

export const PortfolioTour: React.FC = () => {
  const frame = useCurrentFrame()
  const segmentDuration = 360 // 12 seconds per project at 30fps

  return (
    <AbsoluteFill style={{ backgroundColor: '#000010' }}>
      {projects.map((project, index) => (
        <Sequence
          key={project.id}
          from={index * segmentDuration}
          durationInFrames={segmentDuration}
        >
          <ProjectSegment
            project={project}
            segmentFrame={frame - index * segmentDuration}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  )
}
