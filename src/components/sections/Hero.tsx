'use client'

import { Suspense, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { HeroScene } from '@/components/3d/HeroScene'
import { TextScramble } from '@/components/ui/TextScramble'
import { useIsMobile } from '@/lib/hooks'

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const scrollProgress = useRef(0)
  const isMobile = useIsMobile()
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current || !contentRef.current) return

    // Scroll-driven particle explosion
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: 'bottom top',
      onUpdate: (self) => {
        scrollProgress.current = self.progress
      },
    })

    // Fade out content on scroll
    gsap.to(contentRef.current, {
      opacity: 0,
      y: -60,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: '40% top',
        scrub: true,
      },
    })

    return () => {
      st.kill()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-[120vh] flex items-center justify-center overflow-hidden"
    >
      <Suspense fallback={null}>
        <HeroScene scrollProgress={scrollProgress} isMobile={isMobile} />
      </Suspense>

      <div ref={contentRef} className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <p className="text-accent font-mono text-sm tablet:text-base mb-4 tracking-widest uppercase">
            <TextScramble text="Bonjour, je suis Matias" delay={500} speed={25} />
          </p>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-5xl tablet:text-7xl laptop:text-8xl font-bold mb-6 leading-tight"
        >
          Développeur{' '}
          <span className="text-gradient">Web & Mobile</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="glass rounded-xl px-6 py-4 max-w-2xl mx-auto mb-10"
        >
          <p className="text-text-secondary text-lg tablet:text-xl leading-relaxed">
            Du pixel au serveur, je transforme vos idées en apps qui claquent — sans bug, promis (enfin presque).
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="flex flex-col mobile:flex-row gap-4 justify-center"
        >
          <a
            href="#projects"
            className="px-8 py-3.5 bg-accent hover:bg-accent-light text-white rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-accent/25"
          >
            Voir mes projets
          </a>
          <a
            href="#contact"
            className="px-8 py-3.5 border border-border hover:border-accent text-text-primary rounded-lg font-medium transition-all duration-200 hover:bg-accent/5"
          >
            Me contacter
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-text-muted/50 rounded-full flex items-start justify-center p-1.5"
        >
          <motion.div className="w-1 h-2 bg-accent rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  )
}
