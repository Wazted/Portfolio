import { useEffect } from 'react'

/** Scroll-driven DOM updates, without independent perpetual animation loops. */
export function createScrollProgress() {
  const listeners = new Set<() => void>()
  return {
    current: 0,
    set(value: number) {
      if (this.current === value) return
      this.current = value
      listeners.forEach(listener => listener())
    },
    subscribe(listener: () => void) {
      listeners.add(listener)
      listener()
      return () => { listeners.delete(listener) }
    },
  }
}

export type ScrollProgress = ReturnType<typeof createScrollProgress>

export function useProgressEffect(progress: ScrollProgress, update: () => void) {
  useEffect(() => progress.subscribe(update), [progress, update])
}
