'use client'

import { useState, useEffect, useRef } from 'react'

/**
 * Mobile detection via matchMedia — only fires when the breakpoint
 * threshold is actually crossed, not on every resize pixel.
 */
export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.innerWidth < breakpoint
  })

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
    setIsMobile(mql.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [breakpoint])

  return isMobile
}

/**
 * Shared mouse position ref — avoids N separate mousemove listeners
 * for the same data. Returns a stable ref (no re-renders).
 */
export function useMousePosition() {
  const pos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      pos.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pos.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', handler, { passive: true })
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  return pos
}
