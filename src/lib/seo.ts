import type { Metadata } from 'next'

export const SITE_URL = 'https://www.wazted.fr'
export const SITE_NAME = 'Matias Campos — Wazted'
export const IS_PREVIEW = process.env.VERCEL_ENV === 'preview'
export const HOME_DESCRIPTION = 'Matias Campos, développeur web et mobile freelance. Sites vitrines sur mesure, design, édition autonome accompagnée et référencement initial.'

export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website', locale: 'fr_FR', siteName: SITE_NAME,
      url: path, title, description,
      images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Matias Campos — Développement web et mobile, sites vitrines sur mesure' }],
    },
    twitter: { card: 'summary_large_image', title, description, images: ['/opengraph-image'] },
  }
}

export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem', position: index + 1, name: item.name, item: `${SITE_URL}${item.path}`,
    })),
  }
}
