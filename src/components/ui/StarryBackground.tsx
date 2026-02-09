'use client'

import { Canvas } from '@react-three/fiber'
import { TwinklingStarfield } from '@/components/3d/TwinklingStarfield'
import { Suspense } from 'react'
import { PerspectiveCamera } from '@react-three/drei'

export function StarryBackground() {
    return (
        <div className="fixed inset-0 z-[-1] pointer-events-none bg-black">
            <Canvas
                gl={{ antialias: false, alpha: false }}
                camera={{ position: [0, 0, 100], fov: 60 }}
            >
                <color attach="background" args={['#000000']} />
                <fog attach="fog" args={['#000000', 50, 150]} />

                <Suspense fallback={null}>
                    <TwinklingStarfield count={3000} />
                    <ambientLight intensity={0.5} />
                </Suspense>
            </Canvas>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80" />
        </div>
    )
}
