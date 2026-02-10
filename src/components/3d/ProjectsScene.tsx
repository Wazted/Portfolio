'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function TunnelParticles({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  const pointsRef = useRef<THREE.Points>(null!)
  const count = 800

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 2 + Math.random() * 3
      pos[i * 3] = Math.cos(angle) * radius
      pos[i * 3 + 1] = Math.sin(angle) * radius
      pos[i * 3 + 2] = -(Math.random() * 30)
    }
    return pos
  }, [count])

  useFrame((state) => {
    if (!pointsRef.current) return
    const t = state.clock.elapsedTime
    const scroll = scrollProgress.current

    // Camera moves forward through tunnel based on scroll
    pointsRef.current.position.z = scroll * 20

    // Rotate tunnel slowly
    pointsRef.current.rotation.z = t * 0.05 + scroll * 2
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#6366f1"
        transparent
        opacity={0.5}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

function TunnelRings({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null!)
  const ringCount = 20

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    const scroll = scrollProgress.current

    groupRef.current.children.forEach((child, i) => {
      const z = -i * 1.5 + scroll * 20
      child.position.z = ((z % 30) + 30) % 30 - 30
      child.rotation.z = t * 0.3 + i * 0.5
      const dist = Math.abs(child.position.z)
      const opacity = Math.max(0, 1 - dist / 15)
      const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial
      if (mat) mat.opacity = opacity * 0.15
    })
  })

  return (
    <group ref={groupRef}>
      {Array.from({ length: ringCount }).map((_, i) => (
        <mesh key={i} position={[0, 0, -i * 1.5]}>
          <torusGeometry args={[3, 0.01, 8, 32]} />
          <meshBasicMaterial color="#6366f1" wireframe transparent opacity={0.1} />
        </mesh>
      ))}
    </group>
  )
}

interface ProjectsSceneProps {
  scrollProgress: React.MutableRefObject<number>
  isMobile: boolean
}

export function ProjectsScene({ scrollProgress, isMobile }: ProjectsSceneProps) {
  return (
    <div className="absolute inset-0 -z-10 opacity-60">
      <Canvas
        camera={{ position: [0, 0, 2], fov: 70 }}
        dpr={isMobile ? 1 : [1, 1.5]}
        gl={{ alpha: true, antialias: false }}
      >
        <TunnelParticles scrollProgress={scrollProgress} />
        <TunnelRings scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  )
}
