'use client'

import { useRef, useEffect } from 'react'

interface SkillsContentProps {
  totalProgress: React.MutableRefObject<number>
}

// Title: fade-in 0.33→0.38, hold until 0.58, fade-out 0.58→0.64
function getStyle(p: number) {
  if (p < 0.33) return { opacity: 0, y: 30 }
  if (p <= 0.38) {
    const t = (p - 0.33) / 0.05
    return { opacity: t, y: 30 * (1 - t) }
  }
  if (p <= 0.58) return { opacity: 1, y: 0 }
  if (p <= 0.64) {
    const t = (p - 0.58) / 0.06
    return { opacity: 1 - t, y: 0 }
  }
  return { opacity: 0, y: 0 }
}

export function SkillsContent({ totalProgress }: SkillsContentProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let raf: number
    const update = () => {
      if (ref.current) {
        const p = totalProgress.current
        const { opacity, y } = getStyle(p)
        ref.current.style.opacity = String(opacity)
        ref.current.style.transform = `translateY(${y}px)`
        ref.current.style.pointerEvents = opacity > 0.1 ? 'auto' : 'none'
      }
      raf = requestAnimationFrame(update)
    }
    raf = requestAnimationFrame(update)
    return () => cancelAnimationFrame(raf)
  }, [totalProgress])

  return (
    <div className="absolute inset-0 flex items-start justify-center pt-[12vh] pointer-events-none z-10">
      <div
        ref={ref}
        className="text-center"
        style={{ opacity: 0, willChange: 'opacity, transform' }}
      >
        <p className="text-accent font-mono text-sm mb-3">03. Competences</p>
        <h2 className="text-3xl tablet:text-5xl laptop:text-6xl font-bold">
          Ma stack <span className="text-gradient">technique</span>
        </h2>
        <p className="text-text-secondary mt-4 text-sm">
          Scrollez pour explorer
        </p>
      </div>
    </div>
  )
}
