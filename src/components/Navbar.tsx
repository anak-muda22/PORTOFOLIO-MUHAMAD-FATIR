import { useState } from 'react'
import { ChevronDown, Menu, Moon, Sun, X } from 'lucide-react'

const primaryLinks = [['Home', 'home'], ['About', 'about'], ['Portfolio', 'projects'], ['Contact', 'contact']]
const extraLinks = [
  ['Career Interests', 'interests'],
  ['Skills', 'skills'],
  ['Experience', 'experience'],
  ['Certificates', 'certificates'],
  ['Education', 'education'],
]

export default function Navbar({ dark, toggle }: { dark: boolean; toggle: () => void }) {
  const [open, setOpen] = useState(false)

  const closeMenu = () => setOpen(false)

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <a href="#home" className="brand-mark" aria-label="Muhamad Fatir - home">
          <img src="./favicon.png" alt="" />
        </a>
        <nav aria-label="Main" className="nav-capsule">
          <ul className="nav-primary">
            {primaryLinks.map(([label, id]) => (
              <li key={id}><a href={`#${id}`} onClick={closeMenu}>{label}</a></li>
            ))}
          </ul>
          <button
            type="button"
            className="nav-more-button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label={open ? 'Close more navigation links' : 'Open more navigation links'}
          >
            <span className="nav-more-desktop">More</span>
            <span className="nav-more-mobile">{open ? <X size={17} /> : <Menu size={17} />}</span>
            <ChevronDown className="nav-chevron" size={14} />
          </button>
          {open && (
            <ul className="nav-more-menu">
              {extraLinks.map(([label, id]) => (
                <li key={id}><a href={`#${id}`} onClick={closeMenu}>{label}</a></li>
              ))}
            </ul>
          )}
        </nav>
        <button type="button" aria-label="Toggle theme" onClick={toggle} className="theme-toggle">
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  )
}
