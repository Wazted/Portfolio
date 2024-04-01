import type { Metadata } from 'next'
import { VT323 } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'

const roboto = VT323({ subsets: ['latin'], weight: '400' })

export const metadata: Metadata = {
  title: 'Matias Portfolio',
  description: 'Apprenez en plus sur moi, sur ce que je sais faire et aime faire ! ☺️'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <Header />
        {children}
      </body>
    </html>
  )
}
