'use client'

import { Suspense, useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { SkillsScene } from '@/components/3d/SkillsScene'
import { useIsMobile } from '@/lib/hooks'

export function Skills() {
  const sectionRef = useRef<HTMLElement>(null)
  const scrollProgress = useRef(0)
  const isMobile = useIsMobile()
  const titleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        scrollProgress.current = self.progress
      },
    })

    if (titleRef.current) {
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 80 },
        {
          opacity: 1, y: 0,
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 90%',
            end: 'top 55%',
            scrub: true,
          },
        }
      )
    }

    return () => st.kill()
  }, [])

  return (
    <section ref={sectionRef} id="skills" className="relative py-32 tablet:py-40 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div ref={titleRef}>
          <p className="text-accent font-mono text-sm mb-3">03. Compétences</p>
          <h2 className="text-3xl tablet:text-5xl laptop:text-6xl font-bold mb-8">
            Ma stack <span className="text-gradient">technique</span>
          </h2>
          <p className="text-text-secondary max-w-xl mb-12">
            Survolez la sphère pour explorer mes compétences. Scrollez pour voir le déploiement.
          </p>
        </div>

        <Suspense fallback={
          <div className="w-full h-[500px] flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          <SkillsScene scrollProgress={scrollProgress} isMobile={isMobile} />
        </Suspense>
      </div>
    </section>
  )
}
