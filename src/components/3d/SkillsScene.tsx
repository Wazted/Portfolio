'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { skills } from '@/data/projects'

function SkillTag({ name, index, total, scrollProgress }: {
  name: string
  index: number
  total: number
  scrollProgress: React.MutableRefObject<number>
}) {
  const ref = useRef<THREE.Group>(null!)

  const spherePos = useMemo(() => {
    const phi = Math.acos(-1 + (2 * index) / total)
    const theta = Math.sqrt(total * Math.PI) * phi
    return new THREE.Vector3(
      2 * Math.cos(theta) * Math.sin(phi),
      2 * Math.sin(theta) * Math.sin(phi),
      2 * Math.cos(phi),
    )
  }, [index, total])

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    const scroll = scrollProgress.current

    // Sphere rotation
    const angle = t * 0.2
    const rotatedX = spherePos.x * Math.cos(angle) - spherePos.z * Math.sin(angle)
    const rotatedZ = spherePos.x * Math.sin(angle) + spherePos.z * Math.cos(angle)

    // Deploy to grid on scroll (from sphere to flat layout)
    const cols = 4
    const row = Math.floor(index / cols)
    const col = index % cols
    const gridX = (col - cols / 2 + 0.5) * 1.2
    const gridY = -(row - Math.floor(total / cols) / 2 + 0.5) * 0.8

    const deploy = Math.min(scroll * 2, 1)
    ref.current.position.x = rotatedX + (gridX - rotatedX) * deploy
    ref.current.position.y = spherePos.y + (gridY - spherePos.y) * deploy
    ref.current.position.z = rotatedZ + (0 - rotatedZ) * deploy
  })

  return (
    <group ref={ref}>
      <Html center distanceFactor={6} zIndexRange={[10, 0]}>
        <div className="px-3 py-1.5 rounded-lg bg-surface/90 border border-border text-text-primary text-xs font-mono whitespace-nowrap hover:border-accent/50 hover:text-accent transition-all cursor-default select-none backdrop-blur-sm">
          {name}
        </div>
      </Html>
    </group>
  )
}

function ConnectionLines({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  const linesRef = useRef<THREE.LineSegments>(null!)
  const total = skills.length

  const positions = useMemo(() => {
    const points: number[] = []
    for (let i = 0; i < total; i++) {
      for (let j = i + 1; j < total; j++) {
        if (skills[i].category === skills[j].category) {
          // Will be updated in useFrame
          points.push(0, 0, 0, 0, 0, 0)
        }
      }
    }
    return new Float32Array(points)
  }, [total])

  useFrame(() => {
    if (!linesRef.current) return
    const material = linesRef.current.material as THREE.LineBasicMaterial
    material.opacity = Math.max(0, 0.1 - scrollProgress.current * 0.2)
  })

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#6366f1" transparent opacity={0.1} />
    </lineSegments>
  )
}

interface SkillsSceneProps {
  scrollProgress: React.MutableRefObject<number>
  isMobile: boolean
}

export function SkillsScene({ scrollProgress, isMobile }: SkillsSceneProps) {
  return (
    <div className="w-full h-[500px] tablet:h-[600px]">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={isMobile ? 1 : [1, 1.5]}
        gl={{ alpha: true }}
      >
        <ambientLight intensity={0.5} />
        {skills.map((skill, i) => (
          <SkillTag
            key={skill.name}
            name={skill.name}
            index={i}
            total={skills.length}
            scrollProgress={scrollProgress}
          />
        ))}
        <ConnectionLines scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  )
}
