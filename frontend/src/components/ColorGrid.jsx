import React from 'react';

const colors = [
  { name: 'Steel Grey', hex: '#636B73', image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=600&auto=format&fit=crop' },
  { name: 'Espresso', hex: '#3B2F2F', image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=600&auto=format&fit=crop' },
  { name: 'Toasted Almond', hex: '#D2B48C', image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600&auto=format&fit=crop' },
  { name: 'Eclipse Blue', hex: '#1B263B', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600&auto=format&fit=crop' },
  { name: 'Black', hex: '#000000', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600&auto=format&fit=crop' },
  { name: 'Chalk White', hex: '#F9F8F6', image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=600&auto=format&fit=crop' }
];

export default function ColorGrid({ onSelectColor }) {
  return (
    <section className="section-padding" style={{ backgroundColor: '#F8F8F6' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <p style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#666', marginBottom: '8px' }}>
          CURATED PALETTES
        </p>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '0.05em' }}>
          SHOP BY SIGNATURE COLOR
        </h2>
      </div>

      <div className="color-grid-container">
        {colors.map((c, idx) => (
          <div
            key={idx}
            className="color-card"
            onClick={() => onSelectColor && onSelectColor(c.name)}
          >
            <div className="color-card-img-wrap">
              <img src={c.image} alt={c.name} />
              <div className="color-card-overlay" />
              <div className="color-dot-badge" style={{ backgroundColor: c.hex }} />
            </div>
            <h4 className="color-card-title">{c.name}</h4>
          </div>
        ))}
      </div>
    </section>
  );
}
