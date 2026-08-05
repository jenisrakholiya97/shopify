import React from 'react';
import { Instagram } from 'lucide-react';

const instagramPosts = [
  { id: 1, handle: '@kendalljenner', image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=600&auto=format&fit=crop', tag: 'Airlift Legging' },
  { id: 2, handle: '@aloyoga', image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600&auto=format&fit=crop', tag: 'Accolade Hoodie' },
  { id: 3, handle: '@studio.la', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600&auto=format&fit=crop', tag: 'Renown Sweatpant' },
  { id: 4, handle: '@alo.wellness', image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=600&auto=format&fit=crop', tag: 'Warrior Pro Mat' }
];

export default function SocialGrid() {
  return (
    <section className="section-padding" style={{ backgroundColor: '#FFFFFF' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <p style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#666', marginBottom: '8px' }}>
          AS SEEN ON INSTAGRAM
        </p>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '0.05em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <Instagram size={28} /> STUDIO TO STREET @ALOYOGA
        </h2>
      </div>

      <div className="social-grid-container">
        {instagramPosts.map((post) => (
          <div key={post.id} className="social-card">
            <img src={post.image} alt={post.tag} />
            <div className="social-card-overlay">
              <span className="social-handle">{post.handle}</span>
              <span className="social-tag-btn">SHOP {post.tag.toUpperCase()}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
