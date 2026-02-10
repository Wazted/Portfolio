'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const trailRefs = useRef<HTMLDivElement[]>([])
  const [isHovering, setIsHovering] = useState(false)
  const [isMobile, setIsMobile] = useState(true)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window)
    checkMobile()
    window.addEventListener('resize', checkMobile, { passive: true })
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (isMobile) return

    const cursor = cursorRef.current
    const dot = dotRef.current
    if (!cursor || !dot) return

    const pos = { x: 0, y: 0 }

    const onMouseMove = (e: MouseEvent) => {
      pos.x = e.clientX
      pos.y = e.clientY

      gsap.to(dot, {
        x: pos.x,
        y: pos.y,
        duration: 0.1,
        ease: 'power2.out',
      })

      gsap.to(cursor, {
        x: pos.x,
        y: pos.y,
        duration: 0.35,
        ease: 'power2.out',
      })

      trailRefs.current.forEach((trail, i) => {
        gsap.to(trail, {
          x: pos.x,
          y: pos.y,
          duration: 0.4 + i * 0.12,
          ease: 'power2.out',
        })
      })
    }

    const onEnterInteractive = () => setIsHovering(true)
    const onLeaveInteractive = () => setIsHovering(false)

    window.addEventListener('mousemove', onMouseMove, { passive: true })

    const interactiveElements = document.querySelectorAll('a, button, [data-cursor-hover]')
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', onEnterInteractive)
      el.addEventListener('mouseleave', onLeaveInteractive)
    })

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', onEnterInteractive)
        el.removeEventListener('mouseleave', onLeaveInteractive)
      })
    }
  }, [isMobile])

  if (isMobile) return null

  return (
    <>
      {/* Trail circles */}
      {[0.15, 0.1, 0.06].map((opacity, i) => (
        <div
          key={i}
          ref={(el) => { if (el) trailRefs.current[i] = el }}
          className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
          style={{
            width: 30 + i * 10,
            height: 30 + i * 10,
            borderRadius: '50%',
            backgroundColor: `rgba(99, 102, 241, ${opacity})`,
          }}
        />
      ))}
      {/* Main ring */}
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full border transition-all duration-200 mix-blend-difference ${
          isHovering
            ? 'w-14 h-14 border-accent bg-accent/10'
            : 'w-8 h-8 border-white/40'
        }`}
      />
      {/* Center dot */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-150 ${
          isHovering ? 'w-2 h-2 bg-accent' : 'w-1 h-1 bg-white'
        }`}
      />
    </>
  )
}
