'use client'

import { Suspense, useRef, useEffect } from 'react'
import { ScrollTrigger } from '@/lib/gsap'
import { useIsMobile, useMousePosition } from '@/lib/hooks'
import { UnifiedTunnelScene } from '@/components/3d/UnifiedTunnelScene'
import { ProjectsContent } from './ProjectsContent'
import { SkillsContent } from './SkillsContent'
import { ContactContent } from './ContactContent'

export function TunnelExperience() {
  const containerRef = useRef<HTMLDivElement>(null)
  const totalProgress = useRef(0)
  const isMobile = useIsMobile()
  const mousePos = useMousePosition()

  useEffect(() => {
    if (!containerRef.current) return

    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        totalProgress.current = self.progress
      },
    })

    return () => { st.kill() }
  }, [])

  return (
    <div
      ref={containerRef}
      id="tunnel"
      className="relative"
      style={{ height: '300vh' }}
    >
      {/* Navigation anchors — 3 equal sections */}
      <div id="projects" className="absolute top-0" />
      <div id="skills" className="absolute" style={{ top: '33%' }} />
      <div id="contact" className="absolute" style={{ top: '66%' }} />

      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* 3D Tunnel */}
        <Suspense fallback={
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          <UnifiedTunnelScene
            totalProgress={totalProgress}
            isMobile={isMobile}
            mousePos={mousePos}
          />
        </Suspense>

        {/* Content Overlays — appear/disappear in sequence */}
        <ProjectsContent totalProgress={totalProgress} />
        <SkillsContent totalProgress={totalProgress} />
        <ContactContent totalProgress={totalProgress} />
      </div>
    </div>
  )
}
