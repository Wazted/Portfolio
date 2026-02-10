'use client'

import { useEffect, useRef, useState } from 'react'

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'

interface TextScrambleProps {
  text: string
  className?: string
  delay?: number
  speed?: number
}

export function TextScramble({ text, className = '', delay = 0, speed = 30 }: TextScrambleProps) {
  const [displayed, setDisplayed] = useState('')
  const [started, setStarted] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(timeout)
  }, [delay])

  useEffect(() => {
    if (!started) return

    let iteration = 0
    if (intervalRef.current) clearInterval(intervalRef.current)

    intervalRef.current = setInterval(() => {
      setDisplayed(
        text
          .split('')
          .map((char, i) => {
            if (char === ' ') return ' '
            if (i < iteration) return text[i]
            return chars[Math.floor(Math.random() * chars.length)]
          })
          .join('')
      )

      iteration += 1 / 3

      if (iteration >= text.length) {
        if (intervalRef.current) clearInterval(intervalRef.current)
        setDisplayed(text)
      }
    }, speed)

    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [started, text, speed])

  return (
    <span className={`font-mono ${className}`}>
      {started ? displayed : '\u00A0'.repeat(text.length)}
    </span>
  )
}
