'use client'

import { useRef, useEffect } from 'react'
import { ProjectCard } from '@/components/ui/ProjectCard'
import { projects } from '@/data/projects'
import { useIsMobile } from '@/lib/hooks'

interface ProjectsContentProps {
  totalProgress: React.MutableRefObject<number>
}

// Projects: fade-in 0.00→0.05, hold 0.05→0.27, fade-out 0.27→0.33
function getStyle(p: number) {
  if (p < 0) return { opacity: 0, scale: 0.9 }
  if (p <= 0.05) {
    const t = p / 0.05
    return { opacity: t, scale: 0.9 + t * 0.1 }
  }
  if (p <= 0.27) return { opacity: 1, scale: 1 }
  if (p <= 0.33) {
    const t = (p - 0.27) / 0.06
    return { opacity: 1 - t, scale: 1 + t * 0.3 }
  }
  return { opacity: 0, scale: 1.3 }
}

export function ProjectsContent({ totalProgress }: ProjectsContentProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()

  useEffect(() => {
    let raf: number
    const update = () => {
      if (overlayRef.current) {
        const p = totalProgress.current
        const { opacity, scale } = getStyle(p)
        overlayRef.current.style.opacity = String(opacity)
        overlayRef.current.style.transform = `scale(${scale})`
        overlayRef.current.style.pointerEvents = opacity > 0.1 ? 'auto' : 'none'
      }

      if (isMobile && trackRef.current) {
        const p = totalProgress.current
        const t = Math.max(0, Math.min(1, (p - 0.02) / 0.28))
        const cardWidth = window.innerWidth * 0.80 + 12
        const maxShift = cardWidth * (projects.length - 1)
        trackRef.current.style.transform = `translateX(${-t * maxShift}px)`
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

        <div className="overflow-hidden tablet:overflow-visible">
          <div
            ref={trackRef}
            className="flex gap-3 tablet:grid tablet:grid-cols-2 laptop:grid-cols-3"
            style={{ willChange: 'transform' }}
          >
            {projects.map((project, i) => (
              <div key={project.title} className="min-w-[80vw] tablet:min-w-0">
                <ProjectCard project={project} index={i} />
              </div>
            ))}
          </div>
        </div>

        <p className="tablet:hidden text-center text-text-muted/60 text-xs mt-4 animate-pulse">
          Scrollez pour voir plus
        </p>
      </div>
    </div>
  )
}
