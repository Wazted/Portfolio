'use client'

import dynamic from 'next/dynamic'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const SmoothScroll = dynamic(
  () => import('@/components/providers/SmoothScroll').then(m => m.SmoothScroll),
  { ssr: false }
)
const CustomCursor = dynamic(
  () => import('@/components/ui/CustomCursor').then(m => m.CustomCursor),
  { ssr: false }
)
const NoiseOverlay = dynamic(
  () => import('@/components/ui/NoiseOverlay').then(m => m.NoiseOverlay),
  { ssr: false }
)
const Hero = dynamic(
  () => import('@/components/sections/Hero').then(m => m.Hero),
  { ssr: false }
)
const About = dynamic(
  () => import('@/components/sections/About').then(m => m.About),
  { ssr: false }
)
const TunnelExperience = dynamic(
  () => import('@/components/sections/TunnelExperience').then(m => m.TunnelExperience),
  { ssr: false }
)

export default function Home() {
  return (
    <SmoothScroll>
      <CustomCursor />
      <NoiseOverlay />
      <Header />
      <main>
        <Hero />
        <About />
        <TunnelExperience />
      </main>
      <Footer />
    </SmoothScroll>
  )
}
