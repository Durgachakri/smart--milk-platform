import React from 'react';
import { MapPin, Phone, Mail, ShieldCheck, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{
      background: '#0a101d',
      color: '#cbd5e1',
      paddingTop: '3.75rem',
      paddingBottom: '2rem',
      borderTop: '3px solid #10b981',
      marginTop: 'auto',
      position: 'relative'
    }}>
      <div className="container" style={{
        maxWidth: '1200px',
        display: 'grid',
        gridTemplateColumns: '1.4fr 1.2fr 1fr 1fr',
        gap: '2.5rem'
      }}>
        
        {/* Brand Column */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
            <img 
              src="/images/Milkmitra_Brand_logo.png" 
              alt="MilkMitra Logo" 
              style={{ width: '56px', height: '56px', objectFit: 'contain', borderRadius: '50%', background: '#fff', padding: '2px' }} 
            />
            <div>
              <h3 style={{ color: '#fff', fontSize: '1.35rem', fontWeight: 900, margin: 0, letterSpacing: '-0.02em' }}>
                MilkMitra
              </h3>
              <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                PURITY GUARANTEED
              </span>
            </div>
          </div>
          <p style={{ fontSize: '0.86rem', lineHeight: '1.65', color: '#94a3b8', maxWidth: '300px' }}>
            Good Health is the most precious thing in this world. And Purity is the essence of good health. Farm fresh, direct to doorstep.
          </p>
        </div>

        {/* Contact Column */}
        <div>
          <h4 style={{ color: '#fff', fontSize: '0.98rem', fontWeight: 800, marginBottom: '1.25rem' }}>Contact</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
            <li style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <MapPin size={18} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>Plot No. 402, 3rd Floor, MilkMitra Central Hub, Cheedigummala, Andhra Pradesh, 518002.</span>
            </li>
            <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <Phone size={16} color="#10b981" style={{ flexShrink: 0 }} />
              <span>+91 9270000766</span>
            </li>
            <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <Mail size={16} color="#10b981" style={{ flexShrink: 0 }} />
              <span>customercare@milkmitra.com</span>
            </li>
            <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <ShieldCheck size={16} color="#10b981" style={{ flexShrink: 0 }} />
              <span>FSSAI: 11516032000273</span>
            </li>
          </ul>
        </div>

        {/* Quick Links Column */}
        <div>
          <h4 style={{ color: '#fff', fontSize: '0.98rem', fontWeight: 800, marginBottom: '1.25rem' }}>Quick Links</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
            <li><Link to="/catalog" style={{ color: '#94a3b8', textDecoration: 'none' }}>Home</Link></li>
            <li><Link to="/catalog" style={{ color: '#94a3b8', textDecoration: 'none' }}>Shop</Link></li>
            <li><Link to="/subscriptions" style={{ color: '#94a3b8', textDecoration: 'none' }}>Our Stores</Link></li>
            <li><span style={{ color: '#94a3b8' }}>Manufacture Unit</span></li>
            <li><span style={{ color: '#94a3b8' }}>Addresses Fssai License Numbers</span></li>
          </ul>
        </div>

        {/* Legal Column */}
        <div>
          <h4 style={{ color: '#fff', fontSize: '0.98rem', fontWeight: 800, marginBottom: '1.25rem' }}>Legal</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
            <li><span style={{ color: '#94a3b8', cursor: 'pointer' }}>Privacy policy</span></li>
            <li><span style={{ color: '#94a3b8', cursor: 'pointer' }}>Refund Policy</span></li>
            <li><span style={{ color: '#94a3b8', cursor: 'pointer' }}>Shipping Policy</span></li>
            <li><span style={{ color: '#94a3b8', cursor: 'pointer' }}>Terms & Conditions</span></li>
          </ul>
        </div>
      </div>

      {/* Bottom Rights Bar */}
      <div className="container" style={{
        maxWidth: '1200px',
        borderTop: '1px solid #1e293b',
        marginTop: '3rem',
        paddingTop: '1.25rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.82rem',
        color: '#64748b'
      }}>
        <div>© 2026 MilkMitra Farms. All rights reserved.</div>
        <div>Powered by <strong style={{ color: '#38bdf8' }}>MilkMitra™</strong></div>
      </div>

      {/* Floating Scroll To Top Button */}
      <button 
        onClick={scrollToTop} 
        style={{
          position: 'absolute',
          right: '2rem',
          bottom: '2rem',
          background: '#2563eb',
          color: '#fff',
          border: 'none',
          borderRadius: '50%',
          width: '42px',
          height: '42px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(37,99,235,0.35)'
        }}
        title="Scroll to top"
      >
        <ChevronUp size={22} />
      </button>
    </footer>
  );
};

export default Footer;