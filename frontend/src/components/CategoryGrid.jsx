import React from 'react';

export default function CategoryGrid({ onSelectCategory }) {
  const collections = [
    {
      id: 'women',
      title: 'AIRLIFT LEGGINGS',
      subtitle: 'Sleek, sculpting double-knit sheen',
      image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 'women',
      title: 'ALOSOFT LOUNGE',
      subtitle: 'Velvety ultra-soft studio layers',
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 'men',
      title: 'ACCOLADE FLEECE',
      subtitle: 'Heavyweight street hoodies & joggers',
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 'accessories',
      title: 'WARRIOR STUDIO GEAR',
      subtitle: 'Pro mats, caps & lifestyle essentials',
      image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?q=80&w=800&auto=format&fit=crop',
    }
  ];

  return (
    <section className="section-padding">
      <div className="section-header">
        <p className="section-tag">SIGNATURE FABRICS</p>
        <h2 className="section-title">CRAFTED FOR MOVEMENT</h2>
      </div>

      <div className="category-grid">
        {collections.map((col, idx) => (
          <div
            key={idx}
            className="category-card"
            onClick={() => onSelectCategory(col.id)}
          >
            <img src={col.image} alt={col.title} loading="lazy" />
            <div className="category-card-overlay">
              <h3 className="category-card-title">{col.title}</h3>
              <p className="font-serif" style={{ color: '#DDD', marginBottom: '12px', fontSize: '0.9rem' }}>
                {col.subtitle}
              </p>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'underline' }}>
                EXPLORE COLLECTION &rarr;
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
