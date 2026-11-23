import { useState } from 'react';
import {
  ArrowUpRight,
  Menu,
  X,
  Atom
} from 'lucide-react';

const navigation = [
  { label: 'Home', href: '#home' },
  { label: 'Training', href: '#training' },
  { label: 'Consultancy', href: '#consultancy' },
  { label: 'Research Support', href: '#research' },
  { label: 'About', href: '#about' }
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="site-header">
      <div className="container nav-container">
        <a
          href="#home"
          className="brand"
          aria-label="Just Science homepage"
          onClick={closeMenu}
        >
          <span className="brand-icon">
            <Atom size={25} strokeWidth={2.1} />
          </span>

          <span className="brand-text">
            Just<span>Science</span>
            <small>TECHNOLOGY & INNOVATION</small>
          </span>
        </a>

        <button
          type="button"
          className="mobile-menu-toggle"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav
          id="primary-navigation"
          className={`nav-links ${menuOpen ? 'nav-open' : ''}`}
          aria-label="Main navigation"
        >
          {navigation.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={item.label === 'Home' ? 'nav-active' : ''}
              onClick={closeMenu}
            >
              {item.label}
            </a>
          ))}

          <a
            href="#contact"
            className="nav-cta"
            onClick={closeMenu}
          >
            Get in touch
            <ArrowUpRight size={16} />
          </a>
        </nav>
      </div>
    </header>
  );
}
