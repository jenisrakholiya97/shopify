import React from 'react';
import { ArrowRight, Instagram, Youtube, Facebook, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        {/* Newsletter Column */}
        <div style={{ paddingRight: '20px' }}>
          <h4 style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '0.12em', marginBottom: '8px' }}>
            GET 15% OFF YOUR FIRST ORDER
          </h4>
          <p style={{ fontSize: '0.85rem', color: '#AAA', marginBottom: '20px', lineHeight: 1.6 }}>
            Sign up for VIP access to weekly drops, exclusive studio events, and wellness tips.
          </p>

          <form onSubmit={(e) => { e.preventDefault(); alert('Thank you for subscribing to Alo Yoga updates!'); }} className="newsletter-form">
            <input
              type="email"
              placeholder="Enter your email address"
              className="newsletter-input"
              required
            />
            <button type="submit" className="newsletter-btn">
              JOIN <ArrowRight size={14} />
            </button>
          </form>

          <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" style={{ color: '#FFF' }}><Instagram size={20} /></a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" style={{ color: '#FFF' }}><Youtube size={20} /></a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" style={{ color: '#FFF' }}><Facebook size={20} /></a>
          </div>
        </div>

        {/* Customer Care */}
        <div className="footer-col">
          <h4>CUSTOMER CARE</h4>
          <ul>
            <li><a href="#help">Help & FAQ</a></li>
            <li><a href="#shipping">Track International Order</a></li>
            <li><a href="#returns">Returns & Exchanges</a></li>
            <li><a href="#size-guide">Size & Fit Guide</a></li>
            <li><a href="#contact">Contact Support</a></li>
          </ul>
        </div>

        {/* About Alo */}
        <div className="footer-col">
          <h4>ABOUT ALO</h4>
          <ul>
            <li><a href="#our-story">Our Story & Mission</a></li>
            <li><a href="#alo-moves">Alo Moves App</a></li>
            <li><a href="#sustainability">Consciousness & Fabric</a></li>
            <li><a href="#careers">Careers</a></li>
            <li><a href="#press">Press & Media</a></li>
          </ul>
        </div>

        {/* Sanctuary Locations */}
        <div className="footer-col">
          <h4>ALO SANCTUARIES</h4>
          <ul>
            <li style={{ color: '#AAA', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={16} /> Beverly Hills Flagship
            </li>
            <li style={{ color: '#AAA', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={16} /> Soho New York
            </li>
            <li style={{ color: '#AAA', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={16} /> London Regent St.
            </li>
            <li style={{ marginTop: '8px' }}>
              <a href="#stores" style={{ textDecoration: 'underline', color: '#FFF', fontWeight: 600 }}>Find a Store Near You</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div>&copy; {new Date().getFullYear()} ALO YOGA INDIA CUSTOM STORE. ALL RIGHTS RESERVED.</div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
          <a href="#accessibility">Accessibility</a>
        </div>
      </div>
    </footer>
  );
}
