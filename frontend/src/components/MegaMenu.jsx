import React from 'react';

export default function MegaMenu({ category, isOpen, onSelectCategory }) {
  const menus = {
    women: {
      columns: [
        {
          title: 'Clothing',
          links: [
            'Shop All',
            'Leggings',
            'Sweatshirts & Hoodies',
            'Matching Sets',
            'Tops & Tanks',
            'Pants & Trousers',
            'Jackets & Coats',
            'Sweatpants',
            'Shorts',
            'Sports Bras',
            'Skirts',
            'Dresses',
            'Sweaters & Knitwear',
            'Intimates',
            'Onesies'
          ]
        },
        {
          title: 'New & Trending',
          links: [
            'New Arrivals',
            'Best Sellers',
            'Last Few Pieces',
            'Leggings 101',
            "Fall '26",
            'Light Layers',
            'Travel in ALO',
            'New to ALO? Start Here'
          ]
        },
        {
          title: 'Shop By Color',
          links: [
            'Rich Bordeaux',
            'Bamboo Green',
            'Java Brown',
            'Warm Butter',
            'California Blue',
            'Navy',
            'Espresso'
          ]
        },
        {
          title: 'Shop by Activity',
          links: [
            'Yoga',
            'Pilates',
            'Run',
            'Lounge',
            'Court Sports',
            'Train'
          ]
        },
        {
          title: 'Accessories',
          links: [
            'Shop All',
            'Bags',
            'Small Leather Goods',
            'Hats',
            'Hair Accessories',
            'Sunglasses',
            'Socks',
            'Shoes',
            'Yoga Mats & Equipment',
            'Gift Cards'
          ]
        }
      ],
      feature: {
        tag: 'NEW IN',
        title: 'RICH BORDEAUX',
        description: 'Deep, dimensional, and undeniably decadent.',
        cta: 'SHOP NEW IN →',
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop',
        categoryTarget: 'women'
      }
    },
    men: {
      columns: [
        {
          title: 'Clothing',
          links: [
            'Shop All',
            'Shorts & 2-in-1s',
            'Hoodies & Sweatshirts',
            'T-Shirts & Tanks',
            'Pants & Sweatpants',
            'Jackets & Outerwear',
            'Matching Sets',
            'Underwear'
          ]
        },
        {
          title: 'New & Trending',
          links: [
            "Men's New Arrivals",
            'Best Sellers',
            'Streetwear Icons',
            'Recovery Collection',
            'The Match Set Edit'
          ]
        },
        {
          title: 'Shop By Color',
          links: [
            'Rich Bordeaux',
            'Espresso',
            'Black',
            'Anthracite',
            'Olive Tree',
            'White'
          ]
        },
        {
          title: 'Shop by Activity',
          links: [
            'Training & HIIT',
            'Running',
            'Yoga & Mobility',
            'Travel & Commute'
          ]
        },
        {
          title: 'Men’s Accessories',
          links: [
            'Men’s Bags & Hats',
            'Recovery Mode Sneakers',
            'Performance Socks',
            'Duffle Bags'
          ]
        }
      ],
      feature: {
        tag: 'PERFORMANCE MEETS STREET',
        title: "MEN'S RECOVERY & STUDIO",
        description: 'Engineered for relentless focus, maximum mobility, and all-day comfort.',
        cta: 'SHOP MEN →',
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600&auto=format&fit=crop',
        categoryTarget: 'men'
      }
    },
    shoes: {
      columns: [
        {
          title: 'Footwear Collection',
          links: [
            'All Footwear',
            'ALO Recovery Mode Sneaker (Unisex)',
            'Sunset Sneaker',
            'Recovery Slides & Slip-ons',
            'High-Top Studio Trainers'
          ]
        },
        {
          title: 'Performance Socks',
          links: [
            'Performance Crew Socks',
            'Everyday Low Tab Socks',
            'Grip Studio Socks',
            'Compression Socks'
          ]
        },
        {
          title: 'Shoe Care & Lifestyle',
          links: [
            'Sneaker Cleaner Kit',
            'Travel Shoe Bags',
            'Athletic Insoles'
          ]
        }
      ],
      feature: {
        tag: 'INNOVATION IN MOTION',
        title: 'RECOVERY MODE SNEAKER',
        description: 'Clean streetwear silhouette with patented high-rebound recovery foam.',
        cta: 'EXPLORE SHOES →',
        image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600&auto=format&fit=crop',
        categoryTarget: 'shoes'
      }
    },
    atelier: {
      columns: [
        {
          title: 'Haute Luxury',
          links: [
            'Atelier Runway Collection',
            'Limited Edition Cashmere',
            'Silk Loungewear',
            'Sculpted Trench Coats & Outerwear'
          ]
        },
        {
          title: 'The Atelier Vision',
          links: [
            'Bespoke Craftsmanship',
            'Sustainable Luxury Textiles',
            'Private VIP Styling Sessions'
          ]
        }
      ],
      feature: {
        tag: 'EXCLUSIVE DROP',
        title: 'ALO ATELIER',
        description: 'Where high fashion converges with movement and transcendent minimalism.',
        cta: 'DISCOVER ATELIER →',
        image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&auto=format&fit=crop',
        categoryTarget: 'women'
      }
    }
  };

  const menuData = menus[category];
  if (!menuData || !isOpen) return null;

  return (
    <div
      className={`alo-megamenu-dropdown ${isOpen ? 'is-open' : ''}`}
      role="region"
      aria-label={`${category} navigation`}
    >
      <div className="alo-megamenu-container">
        <div className="alo-megamenu-columns">
          {menuData.columns.map((col, idx) => (
            <div key={idx} className="alo-megamenu-col">
              <h3 className="alo-megamenu-heading">{col.title}</h3>
              <ul className="alo-megamenu-list">
                {col.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <button
                      type="button"
                      className="alo-megamenu-link"
                      onClick={() => onSelectCategory(category === 'atelier' ? 'women' : category)}
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {menuData.feature && (
          <div className="alo-megamenu-feature">
            <div
              className="alo-feature-card"
              onClick={() => onSelectCategory(menuData.feature.categoryTarget)}
            >
              <div className="alo-feature-img-box">
                <img
                  src={menuData.feature.image}
                  alt={menuData.feature.title}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop';
                  }}
                />
                <span className="alo-feature-badge">{menuData.feature.tag}</span>
              </div>
              <div className="alo-feature-info">
                <h4 className="alo-feature-title">{menuData.feature.title}</h4>
                <p className="alo-feature-desc">{menuData.feature.description}</p>
                <span className="alo-feature-cta">{menuData.feature.cta}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
