import { useEffect, useState, type KeyboardEvent } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Award, Download, FileText, RotateCcw } from 'lucide-react'
import { Section } from './Sections'

type Cert = {
  file: string
  url: string
  type: 'image' | 'pdf'
  title: string
  issuer: string
  date: string
  year: string
  credentialId: string
  verifyUrl: string
  category: string
}

export default function Certificates() {
  const [all, setAll] = useState<Cert[]>([])
  const [flipped, setFlipped] = useState<string[]>([])
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    fetch('./certificates.json')
      .then(response => response.json())
      .then(setAll)
      .catch(() => setAll([]))
  }, [])

  const toggleCard = (file: string) => {
    setFlipped(current =>
      current.includes(file) ? current.filter(item => item !== file) : [...current, file],
    )
  }

  const handleCardKeyDown = (event: KeyboardEvent<HTMLDivElement>, file: string) => {
    if (event.target !== event.currentTarget || (event.key !== 'Enter' && event.key !== ' ')) return
    event.preventDefault()
    toggleCard(file)
  }

  return (
    <Section id="certificates" title="Certificates & Achievements">
      <p className="mb-7 text-sm text-mute">Click a card to reveal a certificate.</p>
      {all.length === 0 && (
        <p className="text-mute">
          No certificates yet. Upload files to public/certificates/ on GitHub and this gallery
          updates automatically.
        </p>
      )}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {all.map((certificate, index) => {
          const isFlipped = flipped.includes(certificate.file)

          return (
            <motion.div
              key={certificate.file}
              initial={reducedMotion ? false : { opacity: 0, y: -72, rotate: -7, scale: 0.94 }}
              whileInView={reducedMotion ? undefined : { opacity: 1, y: 0, rotate: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{
                type: 'spring',
                stiffness: 95,
                damping: 16,
                delay: reducedMotion ? 0 : Math.min(index * 0.08, 0.48),
              }}
              whileHover={reducedMotion ? undefined : { y: -5, scale: 1.02 }}
              className="certificate-perspective"
            >
              <div
                role="button"
                tabIndex={0}
                aria-label={`${isFlipped ? 'Hide' : 'Show'} certificate: ${certificate.title}`}
                aria-pressed={isFlipped}
                onClick={() => toggleCard(certificate.file)}
                onKeyDown={event => handleCardKeyDown(event, certificate.file)}
                className="certificate-flipper"
                style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
              >
                <div className="certificate-face certificate-front">
                  <div className="certificate-cover">
                    <div className="certificate-cover-top"><span>MF / CERTIFICATE</span><span>0{index+1}</span></div>
                    <span className="certificate-cover-icon"><Award size={24} aria-hidden="true" /></span>
                    <span className="certificate-cover-category">{certificate.category}</span>
                    <h3>{certificate.title}</h3>
                    <p>{[certificate.issuer, certificate.date].filter(Boolean).join(' · ')}</p>
                    <span className="certificate-cover-hint"><RotateCcw size={13} aria-hidden="true" /> Click to reveal</span>
                    <i className="certificate-cover-orbit"/>
                  </div>
                </div>

                <div className="certificate-face certificate-back">
                  {certificate.type === 'image' ? (
                    <img
                      src={certificate.url}
                      alt={certificate.title}
                      loading="lazy"
                      className="min-h-0 flex-1 w-full object-contain"
                    />
                  ) : (
                    <div className="grid min-h-0 flex-1 place-items-center text-accent">
                      <FileText size={44} aria-hidden="true" />
                    </div>
                  )}
                  <div className="flex items-center justify-between gap-2 border-t border-line px-3 py-2">
                    <span className="line-clamp-1 text-xs text-mute">{certificate.title}</span>
                    <a
                      href={certificate.url}
                      download
                      aria-label={`Download ${certificate.title}`}
                      onClick={event => event.stopPropagation()}
                      onKeyDown={event => event.stopPropagation()}
                      className="shrink-0 rounded-md p-1.5 text-accent hover:bg-accent/10"
                    >
                      <Download size={16} aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </Section>
  )
}
