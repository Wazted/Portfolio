'use client'

import { Suspense, useRef, useEffect, useMemo } from 'react'
import { createScrollProgress } from '@/lib/scroll-progress'
import { ScrollTrigger } from '@/lib/gsap'
import { useIsMobile, useSceneActivity } from '@/lib/hooks'
import dynamic from 'next/dynamic'
const UnifiedTunnelScene = dynamic(() => import('@/components/3d/UnifiedTunnelScene').then(m => m.UnifiedTunnelScene), { ssr: false })
import { ProjectsContent } from './ProjectsContent'
import { SkillsContent } from './SkillsContent'
import { ContactContent } from './ContactContent'

export function TunnelExperience() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { ref: sceneRef, ready: sceneReady } = useSceneActivity()
  const totalProgress = useMemo(createScrollProgress, [])
  const isMobile = useIsMobile()

  useEffect(() => {
    if (!containerRef.current) return

    // Refresh after DOM updates with new height
    ScrollTrigger.refresh()

    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onRefresh: (self) => totalProgress.set(self.progress),
      onUpdate: (self) => {
        totalProgress.set(self.progress)
      },
    })

    return () => { st.kill() }
  }, [isMobile, totalProgress])

  return (
    <div
      ref={containerRef}
      id="tunnel"
      className="relative"
      style={{ height: isMobile ? '500vh' : '300vh' }}
    >
      {/* Navigation anchors — corrected for ScrollTrigger progress mapping */}
      {/* Anchor position = target progress × (container height − viewport height). */}
      <div id="projects" className="absolute" style={{ top: isMobile ? '9.6%' : '8%' }} />
      <div id="skills" className="absolute" style={{ top: isMobile ? '54.4%' : '45.333%' }} />
      <div id="contact" className="absolute" style={{ top: isMobile ? '67.2%' : '56%' }} />

      <div ref={sceneRef} className="sticky top-0 h-screen w-full overflow-hidden">
        {/* 3D Tunnel */}
        <Suspense fallback={
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          {sceneReady && <UnifiedTunnelScene
            totalProgress={totalProgress}
            isMobile={isMobile}
          />}
        </Suspense>

        {/* Content Overlays — appear/disappear in sequence */}
        <ProjectsContent totalProgress={totalProgress} />
        <SkillsContent totalProgress={totalProgress} />
        <ContactContent totalProgress={totalProgress} />
      </div>
    </div>
  )
}
