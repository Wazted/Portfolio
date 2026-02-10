'use client'

import { Suspense, useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { AboutScene } from '@/components/3d/AboutScene'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import { useIsMobile } from '@/lib/hooks'

const highlights = [
  { number: 7, suffix: '+', label: "Années d'expérience" },
  { number: 20, suffix: '+', label: 'Projets réalisés' },
  { number: 100, suffix: '%', label: 'Clients satisfaits' },
]

export function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const scrollProgress = useRef(0)
  const isMobile = useIsMobile()
  const leftColRef = useRef<HTMLDivElement>(null)
  const rightColRef = useRef<HTMLDivElement>(null)
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

    // Title reveal
    if (titleRef.current) {
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1, y: 0, duration: 1,
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 85%',
            end: 'top 50%',
            scrub: true,
          },
        }
      )
    }

    // Parallax: left content slides from left
    if (leftColRef.current) {
      gsap.fromTo(leftColRef.current,
        { x: -120, opacity: 0 },
        {
          x: 0, opacity: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            end: 'top 20%',
            scrub: true,
          },
        }
      )
    }

    // Parallax: right content slides from right
    if (rightColRef.current) {
      gsap.fromTo(rightColRef.current,
        { x: 120, opacity: 0 },
        {
          x: 0, opacity: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            end: 'top 20%',
            scrub: true,
          },
        }
      )
    }

    return () => st.kill()
  }, [])

  return (
    <section ref={sectionRef} id="about" className="relative py-32 tablet:py-40 overflow-hidden">
      <Suspense fallback={null}>
        <AboutScene scrollProgress={scrollProgress} isMobile={isMobile} />
      </Suspense>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div ref={titleRef}>
          <p className="text-accent font-mono text-sm mb-3">01. À propos</p>
          <h2 className="text-3xl tablet:text-5xl laptop:text-6xl font-bold mb-20">
            Qui suis-je<span className="text-accent">?</span>
          </h2>
        </div>

        <div className="grid tablet:grid-cols-2 gap-12 tablet:gap-20 items-start">
          {/* Text — slides from left */}
          <div ref={leftColRef} className="space-y-6">
            <p className="text-text-secondary text-lg leading-relaxed">
              Passionné par le développement depuis plusieurs années, je conçois
              des applications <span className="text-text-primary font-medium">web et mobile</span> qui
              allient performance, design moderne et expérience utilisateur fluide.
            </p>
            <p className="text-text-secondary text-lg leading-relaxed">
              Mon approche : écrire du code <span className="text-text-primary font-medium">propre et maintenable</span>,
              en utilisant les meilleures technologies du moment. Je m&apos;investis dans chaque projet
              comme si c&apos;était le mien.
            </p>
            <p className="text-text-secondary text-lg leading-relaxed">
              Toujours en veille techno, je suis convaincu que les meilleurs produits naissent
              de la rencontre entre un <span className="text-text-primary font-medium">design soigné</span> et
              une <span className="text-text-primary font-medium">architecture solide</span>.
            </p>
          </div>

          {/* Stats — slides from right */}
          <div ref={rightColRef} className="flex flex-wrap gap-4 justify-center">
            {highlights.map((item) => (
              <div
                key={item.label}
                className="glass rounded-xl p-6 text-center hover:border-accent/30 transition-all duration-300 flex-1 min-w-[140px]"
              >
                <p className="text-3xl tablet:text-4xl font-bold text-gradient mb-2">
                  <AnimatedCounter end={item.number} suffix={item.suffix} />
                </p>
                <p className="text-text-muted text-xs tablet:text-sm">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
