'use client'

import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useSceneActivity } from '@/lib/hooks'
import * as THREE from 'three'

const PARTICLE_COUNT_DESKTOP = 1800
const PARTICLE_COUNT_MOBILE = 600

function getTextPositions(text: string, count: number, width: number): Float32Array {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  const fontSize = 120
  canvas.width = 1024
  canvas.height = 256

  ctx.fillStyle = '#fff'
  ctx.font = `bold ${fontSize}px Arial`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, canvas.width / 2, canvas.height / 2)

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const textPixels: [number, number][] = []

  for (let y = 0; y < canvas.height; y += 2) {
    for (let x = 0; x < canvas.width; x += 2) {
      const i = (y * canvas.width + x) * 4
      if (imageData.data[i + 3] > 128) {
        textPixels.push([x, y])
      }
    }
  }

  const positions = new Float32Array(count * 3)
  const scale = width / canvas.width

  for (let i = 0; i < count; i++) {
    if (i < textPixels.length) {
      const idx = Math.floor((i / count) * textPixels.length)
      const [px, py] = textPixels[idx]
      positions[i * 3] = (px - canvas.width / 2) * scale
      positions[i * 3 + 1] = -(py - canvas.height / 2) * scale
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.5
    } else {
      positions[i * 3] = (Math.random() - 0.5) * width
      positions[i * 3 + 1] = (Math.random() - 0.5) * width * 0.25
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2
    }
  }

  return positions
}

function ParticleField({ scrollProgress, isMobile }: { scrollProgress: React.MutableRefObject<number>; isMobile: boolean }) {
  const meshRef = useRef<THREE.Points>(null!)
  const { viewport } = useThree()
  const particleCount = isMobile ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP

  const [textPositions, setTextPositions] = useState<Float32Array | null>(null)

  const randomPositions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      const r = 3 + Math.random() * 8
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)
    }
    return pos
  }, [particleCount])

  useEffect(() => {
    const tp = getTextPositions('PORTFOLIO', particleCount, viewport.width * 0.85)
    setTextPositions(tp)
  }, [particleCount, viewport.width])

  const currentPositions = useMemo(
    () => new Float32Array(particleCount * 3),
    [particleCount]
  )

  useFrame((_, delta) => {
    if (!meshRef.current || !textPositions) return

    const geo = meshRef.current.geometry
    const posAttr = geo.getAttribute('position') as THREE.BufferAttribute | null
    if (!posAttr) return
    const scroll = scrollProgress.current
    const time = performance.now() * 0.001

    const explosionFactor = Math.min(scroll * 3, 1)
    const blend = 1 - Math.exp(-10 * Math.min(delta, 0.05))
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      const tx = textPositions[i3]
      const ty = textPositions[i3 + 1]
      const tz = textPositions[i3 + 2]
      const rx = randomPositions[i3]
      const ry = randomPositions[i3 + 1]
      const rz = randomPositions[i3 + 2]

      let targetX = tx + (rx - tx) * explosionFactor
      let targetY = ty + (ry - ty) * explosionFactor
      const targetZ = tz + (rz - tz) * explosionFactor

      // Add subtle floating
      targetX += Math.sin(time * 0.5 + i * 0.01) * 0.02 * (1 - explosionFactor)
      targetY += Math.cos(time * 0.3 + i * 0.01) * 0.02 * (1 - explosionFactor)

      // Lerp
      currentPositions[i3] += (targetX - currentPositions[i3]) * blend
      currentPositions[i3 + 1] += (targetY - currentPositions[i3 + 1]) * blend
      currentPositions[i3 + 2] += (targetZ - currentPositions[i3 + 2]) * blend
    }

    posAttr.needsUpdate = true
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[currentPositions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={isMobile ? 0.025 : 0.018}
        color="#8b8ff5"
        transparent
        opacity={0.9}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

function FloatingRings({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null!)

  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    group.current.rotation.x = t * 0.1
    group.current.rotation.y = t * 0.15
    group.current.children.forEach((child, i) => {
      child.rotation.z = t * (0.1 + i * 0.05)
      const scale = 1 - scrollProgress.current * 0.5
      child.scale.setScalar(scale)
    })
  })

  return (
    <group ref={group}>
      {[1.8, 2.4, 3.0].map((radius, i) => (
        <mesh key={i} position={[0, 0, -2]}>
          <torusGeometry args={[radius, 0.005, 4, 48]} />
          <meshBasicMaterial
            color={i === 0 ? '#6366f1' : i === 1 ? '#a855f7' : '#3b82f6'}
            transparent
            opacity={0.15}
          />
        </mesh>
      ))}
    </group>
  )
}

interface HeroSceneProps {
  scrollProgress: React.MutableRefObject<number>
  isMobile: boolean
}

export function HeroScene({ scrollProgress, isMobile }: HeroSceneProps) {
  const { ref, ready, active } = useSceneActivity()
  return (
    <div ref={ref} className="hero-art absolute inset-0 -z-10">
      {ready && (
        <Canvas
          frameloop={active ? 'always' : 'never'}
          camera={{ position: [0, 0, 5], fov: 60 }}
          dpr={1}
          gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        >
          <ParticleField scrollProgress={scrollProgress} isMobile={isMobile} />
          <FloatingRings scrollProgress={scrollProgress} />
        </Canvas>
      )}
    </div>
  )
}
