'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'

interface AnimatedCounterProps {
  end: number
  suffix?: string
  duration?: number
  className?: string
}

export function AnimatedCounter({
  end,
  suffix = '',
  duration = 2,
  className = '',
}: AnimatedCounterProps) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const triggered = useRef(false)

  useEffect(() => {
    if (!ref.current) return

    const st = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 95%',
      onEnter: () => {
        if (triggered.current) return
        triggered.current = true

        const obj = { val: 0 }
        gsap.to(obj, {
          val: end,
          duration,
          ease: 'power2.out',
          onUpdate: () => setValue(Math.floor(obj.val)),
        })
      },
    })

    return () => st.kill()
  }, [end, duration])

  return (
    <span ref={ref} className={className}>
      {value}{suffix}
    </span>
  )
}
