import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowRight } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const { showToast } = useApp();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      showToast(`Thank you! ${email} has been subscribed to our wellness newsletter.`, 'success');
      setEmail('');
    }
  };

  return (
    <footer className="footer">
      <div className="container footer-grid">
        {/* Brand Col */}
        <div className="footer-brand">
          <Link to="/" className="logo">
            <div className="logo-icon">LN</div>
            <div className="logo-text">Laxmi <span>Narsimha</span></div>
          </Link>
          <p>
            A trusted neighborhood pharmacy dedicated to providing authentic medicines, quality personal care items, and friendly guidance.
          </p>
        </div>

        {/* Links Col 1 */}
        <div className="footer-col">
          <h4>Browse Shop</h4>
          <ul className="footer-links">
            <li><Link to="/shop?category=medicines">OTC Medicines</Link></li>
            <li><Link to="/shop?category=baby-care">Baby Care Products</Link></li>
            <li><Link to="/shop?category=personal-care">Personal Hygiene</Link></li>
            <li><Link to="/shop?category=wellness">Wellness Supplements</Link></li>
          </ul>
        </div>

        {/* Links Col 2 */}
        <div className="footer-col">
          <h4>Health Resources</h4>
          <ul className="footer-links">
            <li><a href="/#wellness-tools">BMI Calculator</a></li>
            <li><a href="/#wellness-tools">Water Intake Tracker</a></li>
            <li><Link to="/contact">Find Store Location</Link></li>
          </ul>
        </div>

        {/* Newsletter Col */}
        <div className="footer-col">
          <h4>Health Newsletter</h4>
          <p style={{ fontSize: '0.85rem', marginTop: '0', marginBottom: '14px' }}>
            Subscribe to receive weekly wellness advice, dosage reminders, and catalog updates.
          </p>
          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <input 
              type="email" 
              placeholder="Your email address" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Newsletter email" 
            />
            <button type="submit" aria-label="Subscribe">
              <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>&copy; 2026 Laxmi Narsimha Medical & General Store. All rights reserved.</p>
        <div className="footer-legal">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Use</a>
          <a href="#">Sitemap</a>
          <a href="https://github.com/uppunutulaharshith/Medical-Website" target="_blank" rel="noopener noreferrer">GitHub Project</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
