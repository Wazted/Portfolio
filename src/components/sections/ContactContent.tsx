'use client'

import { useRef, useEffect, useState, FormEvent } from 'react'
import { motion } from 'framer-motion'

type FormStatus = 'idle' | 'sending' | 'success' | 'error'

interface ContactContentProps {
  totalProgress: React.MutableRefObject<number>
}

// Contact: fade-in 0.66→0.73, hold 0.73→1.0 (no fade-out)
function getStyle(p: number) {
  if (p < 0.66) return { opacity: 0, scale: 0.9 }
  if (p <= 0.73) {
    const t = (p - 0.66) / 0.07
    return { opacity: t, scale: 0.9 + t * 0.1 }
  }
  return { opacity: 1, scale: 1 }
}

export function ContactContent({ totalProgress }: ContactContentProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<FormStatus>('idle')
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })

  useEffect(() => {
    let raf: number
    const update = () => {
      if (overlayRef.current) {
        const p = totalProgress.current
        const { opacity, scale } = getStyle(p)
        overlayRef.current.style.opacity = String(opacity)
        overlayRef.current.style.transform = `scale(${scale})`
        overlayRef.current.style.pointerEvents = opacity > 0.1 ? 'auto' : 'none'
      }
      raf = requestAnimationFrame(update)
    }
    raf = requestAnimationFrame(update)
    return () => cancelAnimationFrame(raf)
  }, [totalProgress])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('sending')

    try {
      const emailjs = await import('@emailjs/browser')
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID',
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID',
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY'
      )
      setStatus('success')
      setFormData({ name: '', email: '', message: '' })
      setTimeout(() => setStatus('idle'), 5000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 5000)
    }
  }

  return (
    <div
      ref={overlayRef}
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
      style={{ opacity: 0, willChange: 'opacity, transform' }}
    >
      <div className="max-w-2xl w-full mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-accent font-mono text-sm mb-3">04. Contact</p>
          <h2 className="text-3xl tablet:text-5xl laptop:text-6xl font-bold mb-6">
            Travaillons <span className="text-gradient">ensemble</span>
          </h2>
          <p className="text-text-secondary max-w-lg mx-auto">
            Un projet en tete ? N&apos;hesitez pas a me contacter,
            je vous repondrai dans les plus brefs delais.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid mobile:grid-cols-2 gap-6">
            <div>
              <label htmlFor="tunnel-name" className="block text-sm text-text-secondary mb-2">Nom</label>
              <input
                id="tunnel-name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
                className="w-full px-4 py-3 bg-surface/80 border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:shadow-[0_0_15px_rgba(99,102,241,0.15)] transition-all duration-300 backdrop-blur-sm"
                placeholder="Votre nom"
              />
            </div>
            <div>
              <label htmlFor="tunnel-email" className="block text-sm text-text-secondary mb-2">Email</label>
              <input
                id="tunnel-email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData((f) => ({ ...f, email: e.target.value }))}
                className="w-full px-4 py-3 bg-surface/80 border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:shadow-[0_0_15px_rgba(99,102,241,0.15)] transition-all duration-300 backdrop-blur-sm"
                placeholder="votre@email.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="tunnel-message" className="block text-sm text-text-secondary mb-2">Message</label>
            <textarea
              id="tunnel-message"
              required
              rows={6}
              value={formData.message}
              onChange={(e) => setFormData((f) => ({ ...f, message: e.target.value }))}
              className="w-full px-4 py-3 bg-surface/80 border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:shadow-[0_0_15px_rgba(99,102,241,0.15)] transition-all duration-300 resize-none backdrop-blur-sm"
              placeholder="Decrivez votre projet..."
            />
          </div>

          <motion.button
            type="submit"
            disabled={status === 'sending'}
            whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(99, 102, 241, 0.3)' }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3.5 bg-accent hover:bg-accent-light disabled:opacity-50 text-white rounded-lg font-medium transition-all duration-300 relative overflow-hidden group"
          >
            <span className="relative z-10">
              {status === 'sending' && 'Envoi en cours...'}
              {status === 'success' && 'Message envoye !'}
              {status === 'error' && 'Erreur, reessayez'}
              {status === 'idle' && 'Envoyer le message'}
            </span>
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </motion.button>
        </form>
      </div>
    </div>
  )
}
