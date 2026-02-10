'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import { skills } from '@/data/projects'

// --- Tunnel Particles ---

function TunnelParticles({ isMobile }: { isMobile: boolean }) {
  const pointsRef = useRef<THREE.Points>(null!)
  const count = isMobile ? 600 : 1200

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const indigo = new THREE.Color('#6366f1')
    const violet = new THREE.Color('#a855f7')
    const blue = new THREE.Color('#3b82f6')

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 2 + Math.random() * 4
      const z = -(Math.random() * 80)
      pos[i * 3] = Math.cos(angle) * radius
      pos[i * 3 + 1] = Math.sin(angle) * radius
      pos[i * 3 + 2] = z

      let color: THREE.Color
      if (z > -27) color = indigo
      else if (z > -54) color = violet
      else color = blue

      col[i * 3] = color.r
      col[i * 3 + 1] = color.g
      col[i * 3 + 2] = color.b
    }
    return { positions: pos, colors: col }
  }, [count])

  useFrame((state) => {
    if (!pointsRef.current) return
    pointsRef.current.rotation.z = state.clock.elapsedTime * 0.03
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

// --- Tunnel Rings ---

function TunnelRings({ isMobile }: { isMobile: boolean }) {
  const groupRef = useRef<THREE.Group>(null!)
  const ringCount = isMobile ? 25 : 50
  const spread = 80

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    const camZ = state.camera.position.z

    groupRef.current.children.forEach((child, i) => {
      child.rotation.z = t * 0.3 + i * 0.5
      const dist = Math.abs(child.position.z - camZ)
      const opacity = Math.max(0, 1 - dist / 15)
      const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial
      if (mat) mat.opacity = opacity * 0.12
    })
  })

  return (
    <group ref={groupRef}>
      {Array.from({ length: ringCount }).map((_, i) => (
        <mesh key={i} position={[0, 0, -i * (spread / ringCount)]}>
          <torusGeometry args={[3.5, 0.01, 8, 32]} />
          <meshBasicMaterial color="#6366f1" wireframe transparent opacity={0.1} />
        </mesh>
      ))}
    </group>
  )
}

// --- Skill Tag Cloud (centered on screen) ---

const CLOUD_RADIUS = 3.5
const CLOUD_DIST_FAR = 14   // start distance (zoomed out)
const CLOUD_DIST_BEHIND = -6 // end distance (behind camera)

function SkillTag({ name, index, total, totalProgress }: {
  name: string
  index: number
  total: number
  totalProgress: React.MutableRefObject<number>
}) {
  const groupRef = useRef<THREE.Group>(null!)
  const divRef = useRef<HTMLDivElement>(null)

  // Cloud distribution: Fibonacci sphere with varying radius → fills the volume
  const basePos = useMemo(() => {
    const phi = Math.acos(-1 + (2 * index + 1) / total)
    const theta = Math.sqrt(total * Math.PI) * phi
    // Radius varies per tag: cbrt gives uniform volume distribution, biased toward center
    const r = CLOUD_RADIUS * Math.cbrt((index + 1) / total) * 0.8
    return new THREE.Vector3(
      r * Math.cos(theta) * Math.sin(phi),
      r * Math.sin(theta) * Math.sin(phi) * 0.7, // slightly flatten vertically
      r * Math.cos(phi) * 0.4, // flatten depth for wider cloud
    )
  }, [index, total])

  const staggerDelay = index / total

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    const p = totalProgress.current

    // Visibility: stagger in 0.60→0.73, fade out as tags fly past (0.73→0.80)
    const staggerStart = 0.60 + staggerDelay * 0.13
    const fadeIn = Math.min(1, Math.max(0, (p - staggerStart) / 0.03))
    const fadeOut = p > 0.73 ? Math.max(0, 1 - (p - 0.73) / 0.07) : 1
    const vis = fadeIn * fadeOut

    groupRef.current.visible = vis > 0.01
    if (!groupRef.current.visible) return

    // Zoom: cloud rushes toward and through user — p 0.58→0.80 maps far→behind
    const zoomT = Math.min(1, Math.max(0, (p - 0.58) / 0.22))
    const dist = CLOUD_DIST_FAR + (CLOUD_DIST_BEHIND - CLOUD_DIST_FAR) * zoomT

    // Slow orbit around Y axis
    const angle = t * 0.1 + index * ((Math.PI * 2) / total)
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    const rx = basePos.x * cos - basePos.z * sin
    const rz = basePos.x * sin + basePos.z * cos
    const bob = Math.sin(t * 0.4 + index * 1.3) * 0.12

    const cam = state.camera.position
    groupRef.current.position.set(
      cam.x + rx,
      cam.y + basePos.y + bob,
      cam.z - dist + rz,
    )

    if (divRef.current) {
      divRef.current.style.opacity = String(vis)
    }
  })

  return (
    <group ref={groupRef}>
      <Html center distanceFactor={6} zIndexRange={[10, 0]}>
        <div
          ref={divRef}
          className="px-3 py-1.5 rounded-lg bg-surface/90 border border-border text-text-primary text-xs font-mono whitespace-nowrap backdrop-blur-sm select-none cursor-default hover:border-accent/50 hover:text-accent transition-colors"
          style={{ opacity: 0 }}
        >
          {name}
        </div>
      </Html>
    </group>
  )
}

function SkillTagCloud({ totalProgress }: { totalProgress: React.MutableRefObject<number> }) {
  return (
    <group>
      {skills.map((skill, i) => (
        <SkillTag
          key={skill.name}
          name={skill.name}
          index={i}
          total={skills.length}
          totalProgress={totalProgress}
        />
      ))}
    </group>
  )
}

// --- Camera Rig (linear travel + mouse parallax) ---

function CameraRig({ totalProgress, isMobile, mousePos }: {
  totalProgress: React.MutableRefObject<number>
  isMobile: boolean
  mousePos: React.MutableRefObject<{ x: number; y: number }>
}) {
  const smoothX = useRef(0)
  const smoothY = useRef(0)
  const smoothZ = useRef(5)

  useFrame(({ camera }) => {
    const p = totalProgress.current
    const targetZ = 5 + p * -80
    const targetX = !isMobile ? mousePos.current.x * 0.3 : 0
    const targetY = !isMobile ? mousePos.current.y * 0.15 : 0

    smoothX.current += (targetX - smoothX.current) * 0.08
    smoothY.current += (targetY - smoothY.current) * 0.08
    smoothZ.current += (targetZ - smoothZ.current) * 0.08

    camera.position.set(smoothX.current, smoothY.current, smoothZ.current)
    camera.lookAt(smoothX.current * 0.5, smoothY.current * 0.5, smoothZ.current - 10)
  })

  return null
}

// --- Main Scene ---

interface UnifiedTunnelSceneProps {
  totalProgress: React.MutableRefObject<number>
  isMobile: boolean
  mousePos: React.MutableRefObject<{ x: number; y: number }>
}

export function UnifiedTunnelScene({ totalProgress, isMobile, mousePos }: UnifiedTunnelSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 70 }}
      dpr={isMobile ? 1 : [1, 1.5]}
      gl={{ alpha: true, antialias: !isMobile, powerPreference: 'high-performance' }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <fog attach="fog" args={['#050505', 10, 65]} />
      <ambientLight intensity={0.3} />

      <CameraRig totalProgress={totalProgress} isMobile={isMobile} mousePos={mousePos} />
      <TunnelParticles isMobile={isMobile} />
      <TunnelRings isMobile={isMobile} />
      <SkillTagCloud totalProgress={totalProgress} />

      <EffectComposer>
        <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} intensity={isMobile ? 0.3 : 0.5} />
        <Vignette darkness={0.5} offset={0.3} />
      </EffectComposer>
    </Canvas>
  )
}
