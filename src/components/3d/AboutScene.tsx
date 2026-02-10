'use client'

import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

function MorphingShape({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  const meshRef = useRef<THREE.Mesh>(null!)

  const basePositions = useMemo(() => {
    const sphere = new THREE.IcosahedronGeometry(1.5, 4)
    const box = new THREE.BoxGeometry(2.2, 2.2, 2.2, 4, 4, 4)
    const torus = new THREE.TorusGeometry(1.2, 0.5, 8, 24)

    return {
      sphere: Float32Array.from(sphere.getAttribute('position').array),
      box: Float32Array.from(box.getAttribute('position').array),
      torus: Float32Array.from(torus.getAttribute('position').array),
      sphereCount: sphere.getAttribute('position').count,
    }
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
      <icosahedronGeometry args={[1.5, 4]} />
      <meshStandardMaterial color="#6366f1" wireframe transparent opacity={0.6} />
    </mesh>
  )
}

function WaveGrid({ isMobile }: { isMobile: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const mouseRef = useRef({ x: 0, y: 0 })
  const { viewport } = useThree()
  const segments = isMobile ? 30 : 60

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
    const geo = meshRef.current.geometry
    const posAttr = geo.getAttribute('position')
    if (!posAttr) return

    const t = state.clock.elapsedTime
    const mx = mouseRef.current.x * viewport.width * 0.5
    const my = mouseRef.current.y * viewport.height * 0.5

    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i)
      const y = posAttr.getY(i)

      let z = Math.sin(x * 0.8 + t) * 0.15 + Math.cos(y * 0.8 + t * 0.7) * 0.15

      if (!isMobile) {
        const dx = x - mx
        const dy = y - my
        const dist = Math.sqrt(dx * dx + dy * dy)
        z += Math.sin(dist * 3 - t * 3) * Math.max(0, 0.3 - dist * 0.1)
      }

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
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={isMobile ? 1 : [1, 1.5]}
        gl={{ alpha: true, antialias: !isMobile }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={0.6} color="#6366f1" />
        <MorphingShape scrollProgress={scrollProgress} />
        <WaveGrid isMobile={isMobile} />
      </Canvas>
    </div>
  )
}
