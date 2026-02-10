import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Matias Campos | Développeur Web & Mobile',
  description: 'Matias Campos — Développeur Web & Mobile. Découvrez mes projets et contactez-moi.',
  keywords: ['matias campos', 'développeur', 'web', 'mobile', 'react', 'next.js', 'portfolio'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="font-sans">
        {children}
      </body>
    </html>
  )
}
