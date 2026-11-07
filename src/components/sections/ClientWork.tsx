import Image from 'next/image'
import styles from './ClientWork.module.css'

const clients = [
  {
    name: 'DermaSana Académie',
    category: 'Formation & esthétique',
    url: 'https://academie.dermasana.fr/',
    image: '/images/clients/dermasana.webp',
    description: 'Donner envie de se former. Présenter les programmes, valoriser le savoir-faire et faciliter la prise de contact.',
    detail: 'Catalogue de formations · Pages dédiées · Édition accompagnée',
  },
  {
    name: 'Némésis Investigations',
    category: 'Investigation privée',
    url: 'https://nemesis-investigations.fr/',
    image: '/images/clients/nemesis.webp',
    description: 'Inspirer confiance dès le premier regard. Clarifier les prestations et guider chaque visiteur vers le bon interlocuteur.',
    detail: 'Parcours par besoin · Référencement local · Édition accompagnée',
  },
]

const phases = [
  {
    title: 'On donne forme à votre idée.',
    description: 'On échange sur votre activité et vos clients. Je propose les premières pistes de design : ambiance, typographies et structure. Vous voyez la direction et nous l’affinons ensemble.',
    deliverable: 'Une direction visuelle validée ensemble',
  },
  {
    title: 'Votre contenu prend sa place.',
    description: 'Textes, photos, offres et informations pratiques : je les intègre dans un site pensé pour vos visiteurs, sur ordinateur comme sur mobile. Le projet devient concret, page après page.',
    deliverable: 'Un site à parcourir et à ajuster',
  },
  {
    title: 'Vous gardez la main.',
    description: 'Un outil d’édition intégré vous permet de demander vos changements directement sur le site. Les demandes sont prises en charge automatiquement. Je reste dans la boucle pour les ajustements qui nécessitent mon intervention.',
    deliverable: 'Vos évolutions courantes, en autonomie',
  },
  {
    title: 'On prépare la mise en ligne.',
    description: 'Je pose les bases du référencement : titres, descriptions, structure des pages et indexation. Puis je m’occupe du déploiement et des vérifications sur votre domaine.',
    deliverable: 'Un site en ligne, avec les bases SEO en place',
  },
]

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d={diagonal ? 'M6 18 18 6M6 6h12v12' : 'M4 12h16m-6-6 6 6-6 6'} />
    </svg>
  )
}

export function ClientWork() {
  return (
    <section id="sites" className={styles.section} aria-labelledby="client-work-title">
      <div className={styles.intro}>
        <h2 id="client-work-title" className={styles.title}>
          Votre savoir-faire.<br />
          <span>Un site à sa hauteur.</span>
        </h2>
        <div className={styles.pitch}>
          <p>Je suis Matias. Je crée des sites qui présentent votre activité, donnent confiance et facilitent le premier contact. Du premier design à la mise en ligne, avec vous.</p>
          <a className={styles.primaryLink} href="#contact">Parlons de votre site <Arrow /></a>
          <a className={styles.methodLink} href="#methode">Comment se passe un projet <Arrow /></a>
        </div>
      </div>

      <div className={styles.workHeading}>
        <h2>Deux activités. Deux univers.</h2>
        <p>Des sites conçus autour de ceux qui les font vivre.</p>
      </div>
      <div className={styles.workGrid}>
        {clients.map((client) => (
          <article key={client.name} className={styles.project}>
            <a className={styles.preview} href={client.url} target="_blank" rel="noopener noreferrer" aria-label={`Visiter ${client.name} (nouvel onglet)`}>
              <Image src={client.image} alt={`Aperçu de la page d’accueil de ${client.name}`} width={1440} height={1000} sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1200px) 46vw, 540px" loading="lazy" />
              <span className={styles.visit}>Visiter le site <Arrow diagonal /></span>
            </a>
            <div className={styles.projectTitle}>
              <h3><a href={client.url} target="_blank" rel="noopener noreferrer">{client.name}<span className="sr-only"> (nouvel onglet)</span></a></h3>
              <span>{client.category}</span>
            </div>
            <p className={styles.projectDescription}>{client.description}</p>
            <p className={styles.projectDetail}>{client.detail}</p>
          </article>
        ))}
      </div>

      <div id="methode" className={styles.method}>
        <div className={styles.methodIntro}>
          <h2>On le construit ensemble.<br /><span>Vous le faites vivre.</span></h2>
          <p>Un interlocuteur, des étapes claires et votre mot à dire tout au long du projet.</p>
          <a href="#contact" className={styles.methodLink}>Discutons de votre projet <Arrow /></a>
        </div>
        <ol className={styles.phases}>
          {phases.map((phase, index) => (
            <li key={phase.title}>
              <span className={styles.phaseNumber} aria-hidden="true">0{index + 1}</span>
              <div>
                <h3>{phase.title}</h3>
                <p>{phase.description}</p>
                <span className={styles.deliverable}>{phase.deliverable}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <div className={styles.closing}>
        <p>Votre activité mérite d’être vue.<br /><strong>Commençons par en parler.</strong></p>
        <a href="#contact" className={styles.primaryLink}>Présentez-moi votre projet <Arrow /></a>
      </div>
    </section>
  )
}
