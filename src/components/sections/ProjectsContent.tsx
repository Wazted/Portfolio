'use client'

import { useRef, useEffect } from 'react'
import { ProjectCard } from '@/components/ui/ProjectCard'
import { projects } from '@/data/projects'
import { useIsMobile } from '@/lib/hooks'

interface ProjectsContentProps {
  totalProgress: React.MutableRefObject<number>
}

// Projects: fade-in 0.05→0.10, hold 0.10→0.44, fade-out 0.44→0.50
function getStyle(p: number) {
  if (p < 0.05) return { opacity: 0, scale: 0.9 }
  if (p <= 0.10) {
    const t = (p - 0.05) / 0.05
    return { opacity: t, scale: 0.9 + t * 0.1 }
  }
  if (p <= 0.44) return { opacity: 1, scale: 1 }
  if (p <= 0.50) {
    const t = (p - 0.44) / 0.06
    return { opacity: 1 - t, scale: 1 + t * 0.3 }
  }
  return { opacity: 0, scale: 1.3 }
}

const TOTAL = projects.length

export function ProjectsContent({ totalProgress }: ProjectsContentProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])
  const dotsRef = useRef<(HTMLDivElement | null)[]>([])
  const isMobile = useIsMobile()

  useEffect(() => {
    let raf: number
    const update = () => {
      const p = totalProgress.current

      if (overlayRef.current) {
        const { opacity, scale } = getStyle(p)
        overlayRef.current.style.opacity = String(opacity)
        overlayRef.current.style.transform = `scale(${scale})`
        overlayRef.current.style.pointerEvents = opacity > 0.1 ? 'auto' : 'none'
      }

      // Mobile: one card at a time based on scroll progress
      if (isMobile) {
        // p 0.10→0.48 maps to card index 0→(TOTAL-1) — starts after fade-in
        const t = Math.max(0, Math.min(1, (p - 0.10) / 0.38))
        const activeIndex = Math.min(TOTAL - 1, Math.floor(t * TOTAL))

        cardsRef.current.forEach((card, i) => {
          if (!card) return
          if (i === activeIndex) {
            card.style.opacity = '1'
            card.style.transform = 'scale(1)'
          } else {
            card.style.opacity = '0'
            card.style.transform = 'scale(0.92)'
          }
        })

        dotsRef.current.forEach((dot, i) => {
          if (!dot) return
          dot.style.opacity = i === activeIndex ? '1' : '0.3'
          dot.style.transform = i === activeIndex ? 'scale(1.3)' : 'scale(1)'
        })
      }

      raf = requestAnimationFrame(update)
    }
    raf = requestAnimationFrame(update)
    return () => cancelAnimationFrame(raf)
  }, [totalProgress, isMobile])

  return (
    <div
      ref={overlayRef}
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
      style={{ opacity: 0, willChange: 'opacity, transform' }}
    >
      <div className="max-w-5xl w-full mx-auto px-6">
        <div className="mb-6">
          <p className="text-accent font-mono text-sm mb-2">02. Projets</p>
          <h2 className="text-2xl tablet:text-4xl laptop:text-5xl font-bold">
            Ce que j&apos;ai <span className="text-gradient">construit</span>
          </h2>
        </div>

        {/* Desktop: grid */}
        <div className="hidden tablet:grid tablet:grid-cols-2 laptop:grid-cols-3 gap-3">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>

        {/* Mobile: one card at a time */}
        <div className="tablet:hidden relative h-[280px]">
          {projects.map((project, i) => (
            <div
              key={project.title}
              ref={(el) => { cardsRef.current[i] = el }}
              className="absolute inset-0 transition-all duration-500 ease-out"
              style={{ opacity: i === 0 ? 1 : 0, transform: i === 0 ? 'scale(1)' : 'scale(0.92)' }}
            >
              <ProjectCard project={project} index={i} />
            </div>
          ))}
        </div>

        {/* Dots indicator — mobile only */}
        <div className="tablet:hidden flex justify-center gap-2 mt-5">
          {projects.map((_, i) => (
            <div
              key={i}
              ref={(el) => { dotsRef.current[i] = el }}
              className="w-2 h-2 rounded-full bg-accent transition-all duration-300"
              style={{ opacity: i === 0 ? 1 : 0.3 }}
            />
          ))}
        </div>

        <p className="tablet:hidden text-center text-text-muted/60 text-xs mt-3 animate-pulse">
          Scrollez pour voir les projets
        </p>
      </div>
    </div>
  )
}
