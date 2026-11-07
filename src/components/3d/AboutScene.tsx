'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useSceneActivity } from '@/lib/hooks'
import * as THREE from 'three'

function MorphingShape({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  const meshRef = useRef<THREE.Mesh>(null!)

  const basePositions = useMemo(() => {
    const sphere = new THREE.IcosahedronGeometry(1.5, 2)
    const box = new THREE.BoxGeometry(2.2, 2.2, 2.2, 4, 4, 4)
    const torus = new THREE.TorusGeometry(1.2, 0.5, 8, 24)

    const positions = {
      sphere: Float32Array.from(sphere.getAttribute('position').array),
      box: Float32Array.from(box.getAttribute('position').array),
      torus: Float32Array.from(torus.getAttribute('position').array),
    }
    sphere.dispose()
    box.dispose()
    torus.dispose()
    return positions
  }, [])

  useFrame((state) => {
    if (!meshRef.current) return
    const geo = meshRef.current.geometry
    const posAttr = geo.getAttribute('position')
    if (!posAttr) return

    const t = state.clock.elapsedTime
    const scroll = scrollProgress.current
    const count = posAttr.count
    const sp = basePositions.sphere
    const bp = basePositions.box
    const tp = basePositions.torus

    meshRef.current.rotation.x = t * 0.15 + scroll * 2
    meshRef.current.rotation.y = t * 0.2 + scroll * 1.5

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const si = sp.length > 0 ? i3 % sp.length : 0
      const bi = bp.length > 0 ? i3 % bp.length : 0
      const ti = tp.length > 0 ? i3 % tp.length : 0

      let x: number, y: number, z: number

      if (scroll < 0.4) {
        const f = scroll / 0.4
        x = (sp[si] || 0) + ((bp[bi] || 0) - (sp[si] || 0)) * f
        y = (sp[si + 1] || 0) + ((bp[bi + 1] || 0) - (sp[si + 1] || 0)) * f
        z = (sp[si + 2] || 0) + ((bp[bi + 2] || 0) - (sp[si + 2] || 0)) * f
      } else {
        const f = (scroll - 0.4) / 0.6
        x = (bp[bi] || 0) + ((tp[ti] || 0) - (bp[bi] || 0)) * f
        y = (bp[bi + 1] || 0) + ((tp[ti + 1] || 0) - (bp[bi + 1] || 0)) * f
        z = (bp[bi + 2] || 0) + ((tp[ti + 2] || 0) - (bp[bi + 2] || 0)) * f
      }

      const noise = Math.sin(t * 2 + i * 0.1) * 0.03
      posAttr.setXYZ(i, x + noise, y + noise, z + noise)
    }
    posAttr.needsUpdate = true
  })

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.5, 2]} />
      <meshStandardMaterial color="#6366f1" wireframe transparent opacity={0.6} />
    </mesh>
  )
}

function WaveGrid({ isMobile }: { isMobile: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const segments = isMobile ? 14 : 24

  useFrame((state) => {
    if (!meshRef.current) return
    const geo = meshRef.current.geometry
    const posAttr = geo.getAttribute('position')
    if (!posAttr) return

    const t = state.clock.elapsedTime

    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i)
      const y = posAttr.getY(i)

      let z = Math.sin(x * 0.8 + t) * 0.15 + Math.cos(y * 0.8 + t * 0.7) * 0.15

      posAttr.setZ(i, z)
    }
    posAttr.needsUpdate = true
  })

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 4, 0, 0]} position={[0, -1, -3]}>
      <planeGeometry args={[20, 20, segments, segments]} />
      <meshBasicMaterial color="#6366f1" wireframe transparent opacity={0.06} />
    </mesh>
  )
}

interface AboutSceneProps {
  scrollProgress: React.MutableRefObject<number>
  isMobile: boolean
}

export function AboutScene({ scrollProgress, isMobile }: AboutSceneProps) {
  const { ref, ready, active } = useSceneActivity()
  return (
    <div ref={ref} className="absolute inset-0 -z-10">
      {ready && (
        <Canvas
          frameloop={active ? 'always' : 'never'}
          camera={{ position: [0, 0, 5], fov: 50 }}
          dpr={1}
          gl={{ alpha: true, antialias: false }}
        >
          <ambientLight intensity={0.3} />
          <pointLight position={[5, 5, 5]} intensity={0.6} color="#6366f1" />
          <MorphingShape scrollProgress={scrollProgress} />
          <WaveGrid isMobile={isMobile} />
        </Canvas>
      )}
    </div>
  )
}
