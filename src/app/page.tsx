'use client'
import { RefObject, useRef, useState } from 'react'
import { WebDevelopment } from '@/components/slides/WebDevelopment'
import { MobileDevelopment } from '@/components/slides/MobileDevelopment'

export default function App() {
  const [refs] = useState<RefObject<HTMLDivElement>[]>(Array.from({ length: 4 }).map(() => useRef(null)))
  const slides = [
    <WebDevelopment />,
    <MobileDevelopment />,
    <div className="h-[calc(100vh-40px)] w-full bg-green-200">csdasd</div>,
    <div className="h-[calc(100vh-40px)] w-full bg-yellow-200">deerererer</div>
  ]

  return (
    <main className="h-screen flex flex-col items-center justify-between snap-y snap-mandatory scroll-pt-10 overflow-auto">
      {slides.map((slide, index) => (
        <div className="w-full snap-center" ref={refs[index]} key={'pres-slide-' + index}>
          {slides[index]}
        </div>
      ))}
    </main>
  )
}
