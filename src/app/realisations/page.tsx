import Image from 'next/image'
import Link from 'next/link'
import { ContentPage, contentStyles as styles } from '@/components/seo/ContentPage'
import { caseStudies } from '@/data/case-studies'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata('Réalisations de sites vitrines', 'Découvrez les sites DermaSana Académie et Némésis Investigations : besoins, choix de design, contenus, autonomie des propriétaires et mise en ligne.', '/realisations')

export default function WorkPage() {
  return <ContentPage title="Des sites pensés pour leur activité" introduction="Formation, esthétique, investigation privée : chaque projet a ses visiteurs, ses contenus et sa manière de créer la confiance. Voici deux réalisations et les choix qui les structurent." trail={[{ name: 'Réalisations', path: '/realisations' }]}>
    <div className={styles.projects}>{caseStudies.map(project => <article key={project.slug}>
      <Link href={`/realisations/${project.slug}`} className={styles.imageLink}><Image src={project.image} alt={`Page d’accueil du site ${project.name}`} width={1440} height={1000} sizes="(max-width: 767px) calc(100vw - 40px), 508px" /></Link>
      <h2><Link href={`/realisations/${project.slug}`}>{project.name}</Link></h2><p>{project.introduction}</p><Link className={styles.textLink} href={`/realisations/${project.slug}`}>Découvrir la réalisation {project.name}</Link>
    </article>)}</div>
    <div className={styles.article}><h2>Un accompagnement du design à la publication</h2><p>Ces sites partagent une démarche : poser une direction visuelle, intégrer le contenu, préparer l’autonomie du propriétaire et mettre le site en ligne avec les bases du référencement. <Link href="/creation-site-vitrine">Découvrez mon accompagnement pour la création de votre site vitrine.</Link></p></div>
  </ContentPage>
}
