import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowDown, AudioLines, Download, Github, Linkedin, MapPin, Pause, Play } from 'lucide-react'
import { profile as p } from '../data/profile'
import ThreeAvatar from './ThreeAvatar'

export default function Hero() {
  const soundtrackRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackStatus, setPlaybackStatus] = useState('Starting soundtrack…')
  const [typedIntro, setTypedIntro] = useState('')
  const [typedHeadline, setTypedHeadline] = useState('')
  const reducedMotion = useReducedMotion()
  const greeting = "Hi, I'm"
  const fullIntro = `${greeting} ${p.name}`

  useEffect(() => {
    if (reducedMotion) {
      setTypedIntro(fullIntro)
      return
    }

    let characterIndex = 0
    let deleting = false
    let timeout = 0

    const typeNextCharacter = () => {
      if (!deleting) {
        characterIndex += 1
        setTypedIntro(fullIntro.slice(0, characterIndex))
        if (characterIndex === fullIntro.length) {
          deleting = true
          timeout = window.setTimeout(typeNextCharacter, 1600)
          return
        }
        timeout = window.setTimeout(typeNextCharacter, 95)
        return
      }

      characterIndex -= 1
      setTypedIntro(fullIntro.slice(0, characterIndex))
      if (characterIndex === 0) {
        deleting = false
        timeout = window.setTimeout(typeNextCharacter, 500)
        return
      }
      timeout = window.setTimeout(typeNextCharacter, 48)
    }

    timeout = window.setTimeout(typeNextCharacter, 350)
    return () => window.clearTimeout(timeout)
  }, [fullIntro, reducedMotion])

  useEffect(() => {
    if (reducedMotion) {
      setTypedHeadline(p.headline)
      return
    }

    let characterIndex = 0
    let deleting = false
    let timeout = 0

    const typeNextCharacter = () => {
      if (!deleting) {
        characterIndex += 1
        setTypedHeadline(p.headline.slice(0, characterIndex))
        if (characterIndex === p.headline.length) {
          deleting = true
          timeout = window.setTimeout(typeNextCharacter, 1600)
          return
        }
        timeout = window.setTimeout(typeNextCharacter, 72)
        return
      }

      characterIndex -= 1
      setTypedHeadline(p.headline.slice(0, characterIndex))
      if (characterIndex === 0) {
        deleting = false
        timeout = window.setTimeout(typeNextCharacter, 450)
        return
      }
      timeout = window.setTimeout(typeNextCharacter, 38)
    }

    timeout = window.setTimeout(typeNextCharacter, 450)
    return () => window.clearTimeout(timeout)
  }, [reducedMotion])

  useEffect(() => {
    const audio = soundtrackRef.current
    if (!audio) return

    const handlePlay = () => {
      setIsPlaying(true)
      setPlaybackStatus('Now playing')
    }
    const handlePause = () => {
      setIsPlaying(false)
      setPlaybackStatus('Paused')
    }
    const handleError = () => {
      setIsPlaying(false)
      setPlaybackStatus('Audio could not be loaded')
      console.error('Unable to load the local soundtrack.')
    }

    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('error', handleError)

    audio.play().catch((error: unknown) => {
      if (error instanceof Error && error.name === 'NotAllowedError') {
        setPlaybackStatus('Autoplay blocked · press play')
        return
      }
      setPlaybackStatus('Audio could not be started')
      console.error('Unable to start the local soundtrack:', error)
    })

    return () => {
      audio.pause()
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('error', handleError)
    }
  }, [])

  const toggleSoundtrack = async () => {
    const audio = soundtrackRef.current
    if (!audio) return
    if (!audio.paused) {
      audio.pause()
      return
    }
    try {
      await audio.play()
    } catch (error) {
      setPlaybackStatus('Playback blocked · try again')
      console.error('Unable to play the local soundtrack:', error)
    }
  }

  return (
    <section id="home" className="hero-section">
      <div className="hero-layout">
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="hero-eyebrow"><span /> {p.branding}</p>
          <h1 aria-label={fullIntro}>
            <span className="hero-greeting">
              {typedIntro.slice(0, greeting.length)}
              {!reducedMotion && typedIntro.length <= greeting.length && <i className="typing-cursor" aria-hidden="true" />}
            </span>
            <span className="hero-name">
              {typedIntro.length > greeting.length ? typedIntro.slice(greeting.length + 1) : ''}
              {!reducedMotion && typedIntro.length > greeting.length && <i className="typing-cursor" aria-hidden="true" />}
            </span>
          </h1>
          <p className="hero-headline" aria-label={p.headline}>
            <span aria-hidden="true">{typedHeadline}</span>
            {!reducedMotion && <span className="typing-cursor" aria-hidden="true" />}
          </p>
          <div className="hero-actions">
            <a href={p.cvFile} download className="hero-primary-action">
              <Download size={16} /> Download CV
            </a>
            <a href="#projects" className="hero-secondary-action">Explore Portfolio</a>
          </div>
          <div className="hero-socials">
            <span><MapPin size={14} /> {p.location}</span>
            {p.github && <a aria-label="GitHub" href={p.github} target="_blank" rel="noreferrer"><Github size={17} /></a>}
            {p.linkedin && <a aria-label="LinkedIn" href={p.linkedin} target="_blank" rel="noreferrer"><Linkedin size={17} /></a>}
          </div>
        </motion.div>

        <motion.div
          className="hero-art"
          initial={{ opacity: 0, scale: 0.88, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.12 }}
        >
          <div className="hero-glow" />
          <ThreeAvatar />
          <span className="id-card-hint">DRAG TO SWING</span>
        </motion.div>

        <motion.aside
          className="hero-note"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <p className="hero-note-label">ABOUT ME</p>
          <h2>Curious by nature.<br /><span>Building for what&apos;s next.</span></h2>
          <p>{p.heroText}</p>
          <div className="availability"><i /> {p.availability}</div>
          <div className={`soundtrack-card${isPlaying ? ' is-playing' : ''}`}>
            <div className="soundtrack-cover" aria-hidden="true">
              <span className="soundtrack-disc"><i /></span>
              <AudioLines className="soundtrack-cover-icon" size={18} />
            </div>
            <div className="soundtrack-info">
              <span className="soundtrack-kicker">PERSONAL SOUNDTRACK</span>
              <strong>My soundtrack</strong>
              <span className="soundtrack-status" role="status" aria-live="polite">{playbackStatus}</span>
            </div>
            <button
              type="button"
              className="soundtrack-play-button"
              onClick={toggleSoundtrack}
              aria-label={isPlaying ? 'Pause soundtrack' : 'Play soundtrack'}
            >
              {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
            </button>
            <audio
              ref={soundtrackRef}
              className="soundtrack-audio"
              autoPlay
              loop
              preload="auto"
              aria-label="Personal soundtrack"
            >
              <source src="./music/soundtrack.mp3" type="audio/mpeg" />
              Browser kamu tidak mendukung pemutar audio.
            </audio>
          </div>
        </motion.aside>
      </div>
      <a className="scroll-cue" href="#about"><ArrowDown size={15} /> Scroll to explore</a>
    </section>
  )
}
