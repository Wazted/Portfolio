import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-border py-8">
      <div className="max-w-6xl mx-auto px-6 flex flex-col tablet:flex-row items-center justify-between gap-4">
        <p className="text-text-muted text-sm">
          &copy; {new Date().getFullYear()} — Built with Next.js & Three.js
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3 text-sm">
          <Link href="/creation-site-vitrine" className="text-text-secondary hover:text-text-primary">Création de site vitrine</Link>
          <Link href="/realisations" className="text-text-secondary hover:text-text-primary">Réalisations</Link>
          <a
            href="https://github.com/Wazted"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted hover:text-text-primary transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://fr.linkedin.com/in/matias-campos-0b0779174"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted hover:text-text-primary transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  )
}
