import React from 'react';

export default function CategoryGrid({ onSelectCategory }) {
  const collections = [
    {
      id: 'women',
      title: 'SCULPTING LEGGINGS',
      subtitle: 'Airlift, Airbrush & Seamless rib',
      image: 'https://www.aloyoga.com/cdn/shop/files/MobileCategories_04_Leggings_1200x.jpg',
    },
    {
      id: 'women',
      title: 'JACKETS & PUFFERS',
      subtitle: 'Luxury street outerwear & windbreakers',
      image: 'https://www.aloyoga.com/cdn/shop/files/MobileCategories_02_Jackets_1200x.jpg',
    },
    {
      id: 'women',
      title: 'BRAS & CROPS',
      subtitle: 'Double up tops & studio support',
      image: 'https://www.aloyoga.com/cdn/shop/files/Pink_Marshmallow_MobileCategories_01_womens_2048x2048.progressive.jpg',
    },
    {
      id: 'accessories',
      title: 'BAGS & WARRIOR MATS',
      subtitle: 'Pro studio gear, caps & accessories',
      image: 'https://www.aloyoga.com/cdn/shop/files/MobileCategories_03_Bags_1200x.jpg',
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
