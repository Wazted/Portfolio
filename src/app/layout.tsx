import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { HOME_DESCRIPTION, IS_PREVIEW, SITE_NAME, SITE_URL, pageMetadata } from '@/lib/seo'
import { StructuredData } from '@/components/seo/StructuredData'

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
  ...pageMetadata('Matias Campos — Développeur web & mobile freelance', HOME_DESCRIPTION, '/'),
  metadataBase: new URL(SITE_URL),
  title: { default: 'Matias Campos — Développeur web & mobile freelance', template: '%s | Matias Campos' },
  applicationName: SITE_NAME,
  authors: [{ name: 'Matias Campos', url: SITE_URL }],
  creator: 'Matias Campos',
  robots: IS_PREVIEW ? { index: false, follow: false } : {
    index: true, follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="font-sans">
        <a className="skip-link" href="#main-content">Aller au contenu</a>
        <StructuredData data={{
          '@context': 'https://schema.org',
          '@graph': [
            { '@type': 'Person', '@id': `${SITE_URL}/#matias`, name: 'Matias Campos', alternateName: 'Wazted', url: SITE_URL,
              jobTitle: 'Développeur web et mobile freelance', sameAs: ['https://github.com/Wazted', 'https://fr.linkedin.com/in/matias-campos-0b0779174'],
              knowsAbout: ['Développement web', 'Développement mobile', 'Création de sites vitrines', 'React', 'Next.js', 'TypeScript'] },
            { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, name: SITE_NAME, alternateName: 'Wazted', url: SITE_URL, inLanguage: 'fr-FR', publisher: { '@id': `${SITE_URL}/#matias` } },
          ],
        }} />
        {children}
      </body>
    </html>
  )
}
