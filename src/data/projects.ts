export interface Project {
  title: string
  description: string
  stack: string[]
  image?: string
  url?: string
  github?: string
}

export const projects: Project[] = [
  {
    title: 'Plateforme Arcade',
    description: 'Plateforme de jeux en ligne arcade multijoueur avec classements, matchmaking et expérience temps réel.',
    stack: ['Next.js', 'TypeScript', 'Socket.io', 'Node.js', 'Redis'],
  },
  {
    title: 'SaaS Gestion Client',
    description: 'Solution SaaS complète de gestion client : CRM, facturation, suivi de projets et tableaux de bord analytiques.',
    stack: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'Tailwind'],
  },
  {
    title: 'Sites Vitrines Pro',
    description: 'Sites vitrines sur-mesure avec système de prise de contact intégré et module de paiement en ligne.',
    stack: ['Next.js', 'TypeScript', 'Tailwind', 'Stripe', 'EmailJS'],
  },
  {
    title: 'Chat Bot en Ligne',
    description: 'Chatbot intelligent avec traitement du langage naturel, intégré sur sites web et messageries.',
    stack: ['React', 'Node.js', 'OpenAI', 'WebSocket', 'MongoDB'],
  },
  {
    title: 'Tracker Données Live',
    description: 'Dashboard de suivi de données en temps réel avec graphiques interactifs et alertes personnalisables.',
    stack: ['Next.js', 'D3.js', 'WebSocket', 'Node.js', 'PostgreSQL'],
  },
  {
    title: 'Savana',
    description: 'Application mobile de réseau social : partage de contenu, messagerie, notifications push et fil d\'actualité.',
    stack: ['React Native', 'Expo', 'Firebase', 'TypeScript', 'Node.js'],
  },
]

export const skills = [
  { name: 'React / Next.js', level: 95, category: 'Frontend' },
  { name: 'TypeScript', level: 90, category: 'Frontend' },
  { name: 'React Native', level: 85, category: 'Mobile' },
  { name: 'Node.js', level: 88, category: 'Backend' },
  { name: 'PostgreSQL', level: 80, category: 'Backend' },
  { name: 'Docker', level: 75, category: 'DevOps' },
  { name: 'Three.js', level: 70, category: 'Frontend' },
  { name: 'Tailwind CSS', level: 95, category: 'Frontend' },
  { name: 'Git', level: 90, category: 'DevOps' },
  { name: 'Figma', level: 75, category: 'Design' },
  { name: 'MongoDB', level: 78, category: 'Backend' },
  { name: 'Firebase', level: 80, category: 'Backend' },
]
