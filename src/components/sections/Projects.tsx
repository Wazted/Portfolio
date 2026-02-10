'use client'

import { Suspense, useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { ProjectsScene } from '@/components/3d/ProjectsScene'
import { ProjectCard } from '@/components/ui/ProjectCard'
import { projects } from '@/data/projects'
import { useIsMobile } from '@/lib/hooks'

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null)
  const scrollProgress = useRef(0)
  const isMobile = useIsMobile()
  const titleRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

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

    // Title reveal
    if (titleRef.current) {
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 80, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1,
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 90%',
            end: 'top 50%',
            scrub: true,
          },
        }
      )
    }

    // Stagger cards from bottom
    if (gridRef.current) {
      const cards = gridRef.current.children
      gsap.fromTo(cards,
        { opacity: 0, y: 100, rotateX: 15 },
        {
          opacity: 1, y: 0, rotateX: 0,
          stagger: 0.08,
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 80%',
            end: 'top 30%',
            scrub: true,
          },
        }
      )
    }

    return () => st.kill()
  }, [])

  return (
    <section ref={sectionRef} id="projects" className="relative py-32 tablet:py-40 overflow-hidden">
      <Suspense fallback={null}>
        <ProjectsScene scrollProgress={scrollProgress} isMobile={isMobile} />
      </Suspense>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div ref={titleRef}>
          <p className="text-accent font-mono text-sm mb-3">02. Projets</p>
          <h2 className="text-3xl tablet:text-5xl laptop:text-6xl font-bold mb-16">
            Ce que j&apos;ai <span className="text-gradient">construit</span>
          </h2>
        </div>

        <div ref={gridRef} className="grid tablet:grid-cols-2 laptop:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
