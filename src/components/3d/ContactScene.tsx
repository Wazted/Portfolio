'use client'

import { useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

function WaveTerrain({ isMobile }: { isMobile: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const mouseRef = useRef({ x: 0, y: 0 })
  const { viewport } = useThree()
  const segments = isMobile ? 40 : 80

  useEffect(() => {
    if (isMobile) return
    const handler = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', handler, { passive: true })
    return () => window.removeEventListener('mousemove', handler)
  }, [isMobile])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    const geo = meshRef.current.geometry
    const posAttr = geo.getAttribute('position')
    if (!posAttr) return

    const mx = mouseRef.current.x * viewport.width * 0.4
    const my = mouseRef.current.y * viewport.height * 0.4

    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i)
      const y = posAttr.getY(i)

      // Base waves
      let z = Math.sin(x * 0.4 + t * 0.8) * 0.3
      z += Math.cos(y * 0.3 + t * 0.5) * 0.2
      z += Math.sin((x + y) * 0.2 + t * 0.3) * 0.15

      // Mouse ripple
      if (!isMobile) {
        const dx = x - mx
        const dy = y - my
        const dist = Math.sqrt(dx * dx + dy * dy)
        const ripple = Math.sin(dist * 2 - t * 4) * Math.max(0, 0.5 - dist * 0.08)
        z += ripple
      }

      posAttr.setZ(i, z)
    }
    posAttr.needsUpdate = true
  })

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 3, 0, 0]} position={[0, -2, -3]}>
      <planeGeometry args={[25, 25, segments, segments]} />
      <meshStandardMaterial
        color="#6366f1"
        wireframe
        transparent
        opacity={0.08}
      />
    </mesh>
  )
}

function FloatingOrbs() {
  const groupRef = useRef<THREE.Group>(null!)

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.children.forEach((child, i) => {
      child.position.y = Math.sin(t * 0.5 + i * 2) * 0.5 + (i - 1) * 1.5
      child.position.x = Math.cos(t * 0.3 + i * 1.5) * 2
      child.position.z = Math.sin(t * 0.4 + i) * 1 - 3
    })
  })

  return (
    <group ref={groupRef}>
      {[0.1, 0.15, 0.08].map((size, i) => (
        <mesh key={i}>
          <sphereGeometry args={[size, 16, 16]} />
          <meshBasicMaterial
            color={i === 0 ? '#6366f1' : i === 1 ? '#a855f7' : '#3b82f6'}
            transparent
            opacity={0.4}
          />
        </mesh>
      ))}
    </group>
  )
}

interface ContactSceneProps {
  isMobile: boolean
}

export function ContactScene({ isMobile }: ContactSceneProps) {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 2, 5], fov: 50 }}
        dpr={isMobile ? 1 : [1, 1.5]}
        gl={{ alpha: true, antialias: !isMobile }}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[0, 5, 5]} intensity={0.4} color="#6366f1" />
        <WaveTerrain isMobile={isMobile} />
        <FloatingOrbs />
      </Canvas>
    </div>
  )
}
