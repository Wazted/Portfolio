import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'
import { caseStudies } from '@/data/case-studies'

export default function sitemap(): MetadataRoute.Sitemap {
  return ['/', '/creation-site-vitrine', '/realisations', ...caseStudies.map(project => `/realisations/${project.slug}`)]
    .map(path => ({ url: `${SITE_URL}${path}` }))
}
