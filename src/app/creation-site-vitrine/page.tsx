import Link from 'next/link'
import { ContentPage, contentStyles as styles } from '@/components/seo/ContentPage'
import { StructuredData } from '@/components/seo/StructuredData'
import { pageMetadata, SITE_URL } from '@/lib/seo'

export const metadata = pageMetadata('Création de site vitrine sur mesure', 'Un site vitrine conçu pour votre activité : design, contenus, édition autonome accompagnée, référencement initial et mise en ligne avec Matias Campos.', '/creation-site-vitrine')

export default function WebsiteServicePage() {
  return (
    <ContentPage title="Création de site vitrine sur mesure" introduction="Votre site doit aider un visiteur à comprendre ce que vous faites, à vous faire confiance et à vous contacter. Je vous accompagne du premier design à la mise en ligne, avec un outil pour faire évoluer votre contenu." trail={[{ name: 'Création de site vitrine', path: '/creation-site-vitrine' }]}>
      <StructuredData data={{ '@context': 'https://schema.org', '@type': 'Service', '@id': `${SITE_URL}/creation-site-vitrine#service`, name: 'Création de site vitrine sur mesure', serviceType: 'Conception et développement de sites vitrines', url: `${SITE_URL}/creation-site-vitrine`, provider: { '@id': `${SITE_URL}/#matias` }, description: 'Design, intégration des contenus, édition autonome accompagnée, référencement initial et déploiement.' }} />
      <div className={styles.article}>
        <h2>Un site construit autour de votre activité</h2>
        <p>Un organisme de formation ne présente pas son offre comme une agence d’investigations. Les questions des visiteurs, les informations à mettre en avant et la manière de prendre contact changent. La structure et le design de votre site doivent tenir compte de ces différences.</p>
        <p>Je suis Matias Campos, développeur web et mobile freelance. Mon travail associe conception de l’interface, développement et intégration du contenu. Vous échangez avec la personne qui réalise le site, pour ajuster les choix au fil du projet.</p>
        <h2>Du premier design au site en ligne</h2>
        <ol>
          <li><strong>Définir la direction.</strong> Nous précisons votre activité, vos visiteurs et le rôle du site. Les premières propositions rendent visibles la structure, les couleurs et les typographies.</li>
          <li><strong>Concrétiser les pages.</strong> Vos textes, photos, prestations et informations pratiques prennent place dans le site. Nous vérifions le parcours sur ordinateur et sur mobile.</li>
          <li><strong>Préparer votre autonomie.</strong> Un outil intégré permet de formuler des demandes de modifications. Elles sont prises en charge automatiquement, avec mon intervention pour les ajustements qui le nécessitent.</li>
          <li><strong>Mettre en ligne.</strong> Je prépare les bases du référencement, le déploiement sur votre domaine et les vérifications du site publié.</li>
        </ol>
        <h2>Faire évoluer votre contenu après la livraison</h2>
        <p>Un horaire, une photo ou une présentation de prestation peut changer. L’outil d’édition vous permet de préciser vos demandes depuis le site, sans modifier vous-même le code. L’automatisation prend en charge les demandes ; je reste disponible pour celles qui nécessitent une intervention technique.</p>
        <p>Le périmètre de cet accompagnement et des évolutions est défini avec vous. Une modification de contenu et la création d’une nouvelle fonctionnalité ne demandent pas le même travail.</p>
        <h2>Les bases du référencement dès la conception</h2>
        <p>Des pages lisibles, des titres descriptifs et une navigation claire servent d’abord les visiteurs. Ils aident également les moteurs de recherche à comprendre le site. Le travail initial porte sur la structure des pages, les métadonnées, l’accès au contenu et les éléments nécessaires à l’exploration du site.</p>
        <p>Ce socle technique ne garantit pas une position dans Google. La visibilité dépend aussi de la pertinence de l’offre, du contenu disponible, de la concurrence et de la notoriété de votre activité.</p>
        <h2>Deux exemples de sites réalisés</h2>
        <p><Link href="/realisations/dermasana-academie">DermaSana Académie</Link> présente des formations esthétiques et leurs programmes. <Link href="/realisations/nemesis-investigations">Némésis Investigations</Link> organise ses prestations autour des besoins de ses visiteurs. Ces deux réalisations montrent comment un même accompagnement peut aboutir à des identités et des parcours différents.</p>
        <h2>Avant de commencer</h2>
        <details><summary>De quoi avez-vous besoin pour préparer le projet ?</summary><p>D’une présentation de votre activité, de vos prestations et des objectifs du site. Votre logo, vos photos, vos textes existants et quelques exemples de sites que vous appréciez permettent de préciser la direction.</p></details>
        <details><summary>Quel est le prix d’un site vitrine ?</summary><p>Le prix dépend du nombre de pages, du contenu à intégrer, des fonctionnalités et du niveau d’accompagnement. Nous définissons le périmètre avant de chiffrer le projet ; il n’y a pas de tarif unique affiché pour toutes les situations.</p></details>
        <details><summary>Le site sera-t-il adapté aux téléphones ?</summary><p>Oui. La lecture, la navigation et les éléments de contact sont pensés pour l’ordinateur et le mobile, puis vérifiés sur plusieurs tailles d’écran.</p></details>
        <details><summary>Puis-je demander des changements moi-même ?</summary><p>Oui. L’outil intégré sert à transmettre vos demandes de modifications depuis le site. Leur traitement est automatisé ; j’interviens ponctuellement lorsque le changement demande un travail particulier.</p></details>
        <details><summary>Le référencement est-il inclus dans la mise en ligne ?</summary><p>Les bases techniques du référencement font partie du processus présenté ici. Une stratégie éditoriale suivie, la création régulière de contenus ou une campagne de notoriété constituent des travaux complémentaires à définir ensemble.</p></details>
      </div>
    </ContentPage>
  )
}
