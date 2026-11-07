import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ContentPage, contentStyles as styles } from '@/components/seo/ContentPage'
import { StructuredData } from '@/components/seo/StructuredData'
import { caseStudies } from '@/data/case-studies'
import { pageMetadata, SITE_URL } from '@/lib/seo'

export const dynamicParams = false
export function generateStaticParams() { return caseStudies.map(project => ({ slug: project.slug })) }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = caseStudies.find(item => item.slug === slug)
  if (!project) notFound()
  return pageMetadata(project.title, project.description, `/realisations/${project.slug}`)
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = caseStudies.find(item => item.slug === slug)
  if (!project) notFound()
  const other = caseStudies.find(item => item.slug !== slug)!
  return <ContentPage title={project.title} introduction={project.introduction} trail={[{ name: 'Réalisations', path: '/realisations' }, { name: project.name, path: `/realisations/${project.slug}` }]}>
    <StructuredData data={{ '@context': 'https://schema.org', '@type': 'CreativeWork', '@id': `${SITE_URL}/realisations/${project.slug}#realisation`, name: project.title, url: `${SITE_URL}/realisations/${project.slug}`, description: project.description, image: `${SITE_URL}${project.image}`, author: { '@id': `${SITE_URL}/#matias` }, inLanguage: 'fr-FR', about: { '@type': 'WebSite', name: project.name, url: project.url } }} />
    <Image className={styles.heroImage} src={project.image} alt={`Design de la page d’accueil de ${project.name}`} width={1440} height={1000} sizes="(max-width: 1104px) calc(100vw - 48px), 1056px" priority />
    <div className={styles.caption}><span>{project.category}</span><a className={styles.textLink} href={project.url} target="_blank" rel="noopener noreferrer">Visiter {project.name}<span className="sr-only"> (nouvel onglet)</span></a></div>
    <div className={styles.article}>
      <h2>Le besoin</h2><p>{project.need}</p>
      <h2>Une direction visuelle adaptée</h2><p>{project.design}</p>
      <h2>Du contenu organisé pour les visiteurs</h2><p>{project.content}</p><ul>{project.features.map(feature => <li key={feature}>{feature}</li>)}</ul>
      <h2>Le propriétaire garde la main</h2><p>{project.autonomy}</p>
      <h2>Référencement initial et mise en ligne</h2><p>{project.launch}</p>
      <h2>Un projet similaire en tête ?</h2><p>Retrouvez les étapes de mon <Link href="/creation-site-vitrine">accompagnement à la création d’un site vitrine</Link>, ou découvrez aussi la réalisation <Link href={`/realisations/${other.slug}`}>{other.name}</Link>.</p>
    </div>
  </ContentPage>
}
