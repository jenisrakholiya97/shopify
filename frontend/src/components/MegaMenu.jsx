import React from 'react';

export default function MegaMenu({ category, onSelectCategory }) {
  const menus = {
    women: {
      columns: [
        {
          title: 'SHOP BY CATEGORY',
          links: ['All Women', 'Airlift Leggings', 'Sports Bras', 'Hoodies & Sweatshirts', 'Tops & Tanks', 'Jackets & Outerwear', 'Shorts', 'Skirts & Dresses']
        },
        {
          title: 'SIGNATURE FABRICS',
          links: ['Airlift Compression', 'Alosoft Ultra-Soft', 'Airbrush Sculpting', 'Vapor Featherlight', 'Renown Heavyweight']
        },
        {
          title: 'SHOP BY ACTIVITY',
          links: ['Hot Yoga', 'Studio & Dance', 'Lounge & Chill', 'Tennis & Pickleball', 'Streetwear']
        },
        {
          title: 'TRENDING DROPS',
          links: ['New Arrivals', 'Best Sellers', 'Monochrome Earth Tones', 'Tennis Club Collection']
        }
      ]
    },
    men: {
      columns: [
        {
          title: 'SHOP BY CATEGORY',
          links: ['All Men', 'Hoodies & Sweatpants', 'Performance Shorts', 'Tees & Tanks', 'Jackets', 'Compression Wear']
        },
        {
          title: 'POPULAR FABRICS',
          links: ['Heavyweight Fleece', 'Tech Ripstop', 'Moisture-Wicking Jersey', 'Seamless Knit']
        },
        {
          title: 'FEATURED EDIT',
          links: ['Off-Duty Essentials', 'Gym & Training', 'Travel & Recover']
        }
      ]
    },
    accessories: {
      columns: [
        {
          title: 'YOGA & STUDIO',
          links: ['Warrior Yoga Mats', 'Blocks & Straps', 'Mat Bags & Slings', 'Grip Socks']
        },
        {
          title: 'HATS & BAGS',
          links: ['Off-Duty Caps', 'Beanies', 'Tote Bags', 'Backpacks & Duffles']
        },
        {
          title: 'WELLNESS',
          links: ['Water Bottles', 'Glow System Skincare', 'Essential Oils']
        }
      ]
    },
    shoes: {
      columns: [
        {
          title: 'FOOTWEAR',
          links: ['Recovery Slides', 'Studio Sneakers', 'Recovery Socks']
        }
      ]
    },
    beauty: {
      columns: [
        {
          title: 'ALO GLOW SYSTEM',
          links: ['Radiance Serum', 'Mega-C Body Wash', 'Head-to-Toe Glow Oil', 'Superfruit Body Lotion']
        },
        {
          title: 'SELF CARE',
          links: ['Aromatherapy Oils', 'Magnesium Reset Spray', 'Clean Beauty Sets']
        }
      ]
    },
    'new-arrivals': {
      columns: [
        {
          title: 'NEW DROPS THIS WEEK',
          links: ['Limited Colorways', 'Airlift New Sheens', 'Accolade New Fleeces', 'Match Point Tennis Edit']
        }
      ]
    },
    'best-sellers': {
      columns: [
        {
          title: 'ICONIC TOP RATED',
          links: ['High-Waist Airlift Legging', 'Accolade Hoodie', 'Alosoft Lounge Pant', 'Warrior Pro Mat']
        }
      ]
    }
  };

  const menuData = menus[category];
  if (!menuData) return null;

  return (
    <div className="mega-menu">
      <div className="mega-menu-inner">
        {menuData.columns.map((col, idx) => (
          <div key={idx} className="mega-column">
            <h4>{col.title}</h4>
            <ul>
              {col.links.map((link, lIdx) => (
                <li key={lIdx}>
                  <a
                    href="#catalog"
                    onClick={(e) => {
                      e.preventDefault();
                      onSelectCategory(category === 'beauty' ? 'accessories' : category);
                    }}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
