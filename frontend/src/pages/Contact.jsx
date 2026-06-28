import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { API_URL } from '../config';
import { MapPin, Clock, Phone, Share2, Facebook, Twitter, Instagram, Github, Send, Map } from 'lucide-react';

const Contact = () => {
  const { showToast } = useApp();

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('General Query');
  const [message, setMessage] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim() || !message.trim()) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }

    setLoading(true);

    try {
      // 1. Submit to Web3Forms directly from the browser (bypasses CORS & server-side blocks)
      const web3FormsKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || 'e81ea809-55c7-4791-a7c3-d3e662f0edd7';
      const web3Response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: web3FormsKey,
          name: name,
          email: email, // reply_to is automatically set by Web3Forms based on this email field
          phone: phone || 'N/A',
          subject: `Laxmi Narsimha Contact Form: ${subject}`,
          message: message,
          from_name: 'Laxmi Narsimha Medical Store Website'
        })
      });

      const web3Data = await web3Response.json();

      if (!web3Response.ok || !web3Data.success) {
        throw new Error(web3Data.message || 'Failed to send email via Web3Forms.');
      }

      // 2. Submit to backend to save inquiry to database
      const res = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, subject, message })
      });

      const data = await res.json();
      setLoading(false);

      if (data.success) {
        showToast('Thank you! Your message has been sent successfully.', 'success');
        // Reset form
        setName('');
        setEmail('');
        setPhone('');
        setSubject('General Query');
        setMessage('');
      } else {
        showToast('Message sent, but database record failed.', 'warning');
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      showToast(err.message || 'Failed to send message.', 'error');
    }
  };

  return (
    <div className="section">
      <div className="container">
        <div className="section-header">
          <h2>Contact & Store Location</h2>
          <p>Get in touch with our pharmacists or visit us directly for immediate health counter services.</p>
        </div>

        <div className="contact-grid" style={{ textAlign: 'left' }}>
          {/* Left: Info details */}
          <div className="contact-info-list">
            <div className="glass-card contact-item">
              <div className="contact-icon">
                <MapPin size={24} />
              </div>
              <div className="contact-text">
                <h4>Store Location</h4>
                <p>
                  Laxmi Narsimha Medical & General Store,<br />
                  Main Road Circle, Colony Chowk,<br />
                  Hyderabad, Telangana, 500001
                </p>
              </div>
            </div>

            <div className="glass-card contact-item">
              <div className="contact-icon">
                <Clock size={24} />
              </div>
              <div className="contact-text">
                <h4>Working Hours</h4>
                <p>
                  Monday - Saturday: 8:00 AM - 10:30 PM<br />
                  Sunday: 9:00 AM - 9:00 PM
                </p>
              </div>
            </div>

            <div className="glass-card contact-item">
              <div className="contact-icon">
                <Phone size={24} />
              </div>
              <div className="contact-text">
                <h4>Call Pharmacy Counter</h4>
                <p>
                  <a href="tel:+917569796263" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                    +91 75697 96263
                  </a> (Guidance & Enquiries)
                </p>
              </div>
            </div>

            <div className="glass-card contact-item">
              <div className="contact-icon">
                <Share2 size={24} />
              </div>
              <div className="contact-text">
                <h4>Connect with Us</h4>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <a href="#" className="social-btn" aria-label="Facebook"><Facebook size={16} /></a>
                  <a href="#" className="social-btn" aria-label="Twitter"><Twitter size={16} /></a>
                  <a href="#" className="social-btn" aria-label="Instagram"><Instagram size={16} /></a>
                  <a href="https://github.com/uppunutulaharshith/Medical-Website" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="GitHub"><Github size={16} /></a>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Map Integration and Contact Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {/* Interactive Mock Map */}
            <div className="map-container">
              <div className="mock-map">
                <div className="mock-map-visual">
                  <div className="map-pin"></div>
                  <div className="map-overlay-details">
                    <h5>Laxmi Narsimha Medical</h5>
                    <p>Near Neighborhood circle entrance</p>
                  </div>
                </div>
                <div className="mock-map-bottom">
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Google Maps Navigation</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: '4px 0 16px 0' }}>
                    Open GPS directions immediately on your mobile device.
                  </p>
                  <a 
                    href="https://maps.google.com" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="btn btn-primary"
                    style={{ gap: '6px', padding: '10px 20px', fontSize: '0.9rem' }}
                  >
                    <Map size={16} /> Open in Google Maps
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="glass-card" style={{ marginTop: '50px', textAlign: 'left' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
            Send Us a Message
          </h3>
          
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label htmlFor="c-name">Your Full Name *</label>
                <input 
                  type="text" 
                  id="c-name" 
                  required 
                  placeholder="Enter your name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="c-email">Your Email Address *</label>
                <input 
                  type="email" 
                  id="c-email" 
                  required 
                  placeholder="name@email.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label htmlFor="c-phone">Contact Phone Number</label>
                <input 
                  type="tel" 
                  id="c-phone" 
                  placeholder="e.g. 9876543210" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="c-subject">Subject</label>
                <select 
                  id="c-subject" 
                  value={subject} 
                  onChange={(e) => setSubject(e.target.value)}
                >
                  <option value="General Query">General Enquiries</option>
                  <option value="Medicine Availability">Medicine Availability Check</option>
                  <option value="Bulk Order Request">Bulk Orders Request</option>
                  <option value="Complaint / Feedback">Store Feedback</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="c-message">Your Message *</label>
              <textarea 
                id="c-message" 
                rows="5" 
                required 
                placeholder="Describe your health support questions or order enquiries details..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ gap: '8px' }}
              disabled={loading}
            >
              {loading ? (
                <div style={{ 
                  border: '2px solid rgba(255,255,255,0.3)', 
                  borderTop: '2px solid white', 
                  borderRadius: '50%', 
                  width: '16px', 
                  height: '16px', 
                  animation: 'spin 0.6s linear infinite' 
                }}></div>
              ) : (
                <>
                  <Send size={16} /> Send Message Inquiry
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
