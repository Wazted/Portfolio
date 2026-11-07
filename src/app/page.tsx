'use client'

import dynamic from 'next/dynamic'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ClientWork } from '@/components/sections/ClientWork'

const Hero = dynamic(
  () => import('@/components/sections/Hero').then(m => m.Hero)
)
const About = dynamic(
  () => import('@/components/sections/About').then(m => m.About)
)
const TunnelExperience = dynamic(
  () => import('@/components/sections/TunnelExperience').then(m => m.TunnelExperience),
  { ssr: false }
)

export default function Home() {
  return (
    <>
      <Header />
      <main id="main-content">
        <Hero />
        <ClientWork />
        <About />
        <TunnelExperience />
      </main>
      <Footer />
    </>
  )
}
