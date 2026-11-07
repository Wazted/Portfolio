import type { MetadataRoute } from 'next'
import { IS_PREVIEW, SITE_URL } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return IS_PREVIEW
    ? { rules: { userAgent: '*', disallow: '/' } }
    : { rules: { userAgent: '*', allow: '/' }, sitemap: `${SITE_URL}/sitemap.xml` }
}
