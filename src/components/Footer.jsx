import { Atom, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div className="footer-brand">
          <a href="#home" className="brand footer-logo">
            <span className="brand-icon">
              <Atom size={24} />
            </span>
            <span className="brand-text">
              Just<span>Science</span>
              <small>TECHNOLOGY & INNOVATION</small>
            </span>
          </a>

          <p>
            Building skills, solving technology challenges and
            supporting research through practical expertise.
          </p>
        </div>

        <div className="footer-column">
          <h3>Explore</h3>
          <a href="#training">Training programmes</a>
          <a href="#consultancy">IT consultancy</a>
          <a href="#research">Research support</a>
          <a href="#about">About us</a>
        </div>

        <div className="footer-column">
          <h3>Get started</h3>
          <a href="#contact">
            Make an enquiry <ArrowUpRight size={14} />
          </a>
          <a href="#training">Explore training</a>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>
          © {new Date().getFullYear()} Just Science. All rights reserved.
        </p>
        <p>Technology. Knowledge. Possibility.</p>
      </div>
    </footer>
  );
}
