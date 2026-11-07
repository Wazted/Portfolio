import Link from 'next/link'
import type { ReactNode } from 'react'
import { Footer } from '@/components/layout/Footer'
import { StructuredData } from './StructuredData'
import { breadcrumbs } from '@/lib/seo'
import styles from './ContentPage.module.css'

export { styles as contentStyles }

export function ContentPage({ title, introduction, trail, children }: {
  title: string
  introduction: string
  trail: { name: string; path: string }[]
  children: ReactNode
}) {
  return (
    <>
      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="Matias Campos — Accueil">{'<W />'}</Link>
        <nav aria-label="Navigation principale"><Link href="/creation-site-vitrine">Sites vitrines</Link><Link href="/realisations">Réalisations</Link><a href="/#contact">Parlons de votre projet</a></nav>
      </header>
      <main id="main-content" className={styles.main}>
        <StructuredData data={breadcrumbs([{ name: 'Accueil', path: '/' }, ...trail])} />
        <nav aria-label="Fil d’Ariane" className={styles.breadcrumb}><ol><li><Link href="/">Accueil</Link></li>{trail.map((item, index) => <li key={item.path}>{index === trail.length - 1 ? <span aria-current="page">{item.name}</span> : <Link href={item.path}>{item.name}</Link>}</li>)}</ol></nav>
        <h1>{title}</h1>
        <p className={styles.lead}>{introduction}</p>
        {children}
        <aside className={styles.cta} aria-label="Discuter de votre projet"><h2>Et votre site ?</h2><p>Présentez-moi votre activité, vos attentes et les contenus dont vous disposez. Nous pourrons définir ensemble les prochaines étapes.</p><a href="/#contact">Discutons de votre projet</a></aside>
      </main>
      <Footer />
    </>
  )
}
