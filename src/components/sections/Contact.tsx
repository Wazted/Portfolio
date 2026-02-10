'use client'

import { Suspense, useState, useEffect, useRef, FormEvent } from 'react'
import { motion } from 'framer-motion'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { ContactScene } from '@/components/3d/ContactScene'
import { useIsMobile } from '@/lib/hooks'

type FormStatus = 'idle' | 'sending' | 'success' | 'error'

export function Contact() {
  const [status, setStatus] = useState<FormStatus>('idle')
  const isMobile = useIsMobile()
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (titleRef.current) {
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 80 },
        {
          opacity: 1, y: 0,
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 90%',
            end: 'top 55%',
            scrub: true,
          },
        }
      )
    }

    if (formRef.current) {
      gsap.fromTo(formRef.current,
        { opacity: 0, y: 60, scale: 0.97 },
        {
          opacity: 1, y: 0, scale: 1,
          scrollTrigger: {
            trigger: formRef.current,
            start: 'top 85%',
            end: 'top 50%',
            scrub: true,
          },
        }
      )
    }
  }, [])

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
    <section ref={sectionRef} id="contact" className="relative py-32 tablet:py-40 overflow-hidden">
      <Suspense fallback={null}>
        <ContactScene isMobile={isMobile} />
      </Suspense>

      <div className="max-w-2xl mx-auto px-6 relative z-10">
        <div ref={titleRef} className="text-center mb-12">
          <p className="text-accent font-mono text-sm mb-3">04. Contact</p>
          <h2 className="text-3xl tablet:text-5xl laptop:text-6xl font-bold mb-6">
            Travaillons <span className="text-gradient">ensemble</span>
          </h2>
          <p className="text-text-secondary max-w-lg mx-auto">
            Un projet en tête ? N&apos;hésitez pas à me contacter,
            je vous répondrai dans les plus brefs délais.
          </p>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          <div className="grid mobile:grid-cols-2 gap-6">
            <div className="group">
              <label htmlFor="name" className="block text-sm text-text-secondary mb-2">Nom</label>
              <input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
                className="w-full px-4 py-3 bg-surface/80 border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:shadow-[0_0_15px_rgba(99,102,241,0.15)] transition-all duration-300 backdrop-blur-sm"
                placeholder="Votre nom"
              />
            </div>
            <div className="group">
              <label htmlFor="email" className="block text-sm text-text-secondary mb-2">Email</label>
              <input
                id="email"
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
            <label htmlFor="message" className="block text-sm text-text-secondary mb-2">Message</label>
            <textarea
              id="message"
              required
              rows={6}
              value={formData.message}
              onChange={(e) => setFormData((f) => ({ ...f, message: e.target.value }))}
              className="w-full px-4 py-3 bg-surface/80 border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:shadow-[0_0_15px_rgba(99,102,241,0.15)] transition-all duration-300 resize-none backdrop-blur-sm"
              placeholder="Décrivez votre projet..."
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
              {status === 'success' && 'Message envoyé !'}
              {status === 'error' && 'Erreur, réessayez'}
              {status === 'idle' && 'Envoyer le message'}
            </span>
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </motion.button>
        </form>
      </div>
    </section>
  )
}
