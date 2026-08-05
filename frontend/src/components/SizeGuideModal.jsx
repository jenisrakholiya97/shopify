import React, { useState } from 'react';
import { X, Ruler } from 'lucide-react';

export default function SizeGuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [unit, setUnit] = useState('in'); // 'in' or 'cm'
  const [activeTab, setActiveTab] = useState('leggings'); // 'leggings', 'bras', 'tops'

  const sizingData = {
    leggings: [
      { size: 'XXS', waistIn: '23.5 - 25.5"', waistCm: '60 - 65 cm', hipIn: '33.5 - 35.5"', hipCm: '85 - 90 cm' },
      { size: 'XS', waistIn: '25.5 - 27.5"', waistCm: '65 - 70 cm', hipIn: '35.5 - 37.5"', hipCm: '90 - 95 cm' },
      { size: 'S', waistIn: '27.5 - 29.5"', waistCm: '70 - 75 cm', hipIn: '37.5 - 39.5"', hipCm: '95 - 100 cm' },
      { size: 'M', waistIn: '29.5 - 31.5"', waistCm: '75 - 80 cm', hipIn: '39.5 - 41.5"', hipCm: '100 - 105 cm' },
      { size: 'L', waistIn: '31.5 - 34"', waistCm: '80 - 86 cm', hipIn: '41.5 - 44"', hipCm: '105 - 112 cm' },
      { size: 'XL', waistIn: '34 - 37"', waistCm: '86 - 94 cm', hipIn: '44 - 47"', hipCm: '112 - 119 cm' }
    ],
    bras: [
      { size: 'XS', band: '30 - 32', cup: 'A / B' },
      { size: 'S', band: '32 - 34', cup: 'B / C' },
      { size: 'M', band: '34 - 36', cup: 'C / D' },
      { size: 'L', band: '36 - 38', cup: 'D / DD' },
      { size: 'XL', band: '38 - 40', cup: 'DD+' }
    ]
  };

  return (
    <div className="search-modal-overlay" onClick={onClose}>
      <div className="search-modal-content" style={{ maxWidth: '640px', padding: '28px' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid #E5E5E5', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Ruler size={20} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '0.05em' }}>ALO SIZE & FIT GUIDE</h3>
          </div>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Category Tabs & Unit Switcher */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className={`currency-btn ${activeTab === 'leggings' ? 'active' : ''}`}
              onClick={() => setActiveTab('leggings')}
            >
              Leggings & Pants
            </button>
            <button
              className={`currency-btn ${activeTab === 'bras' ? 'active' : ''}`}
              onClick={() => setActiveTab('bras')}
            >
              Sports Bras
            </button>
          </div>

          {activeTab === 'leggings' && (
            <div className="currency-toggle-pill">
              <button className={`currency-btn ${unit === 'in' ? 'active' : ''}`} onClick={() => setUnit('in')}>
                INCHES
              </button>
              <button className={`currency-btn ${unit === 'cm' ? 'active' : ''}`} onClick={() => setUnit('cm')}>
                CM
              </button>
            </div>
          )}
        </div>

        {/* Sizing Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#F8F8F6', borderBottom: '2px solid #000' }}>
              <th style={{ padding: '12px', fontWeight: 700 }}>SIZE</th>
              {activeTab === 'leggings' ? (
                <>
                  <th style={{ padding: '12px', fontWeight: 700 }}>WAIST</th>
                  <th style={{ padding: '12px', fontWeight: 700 }}>HIP</th>
                </>
              ) : (
                <>
                  <th style={{ padding: '12px', fontWeight: 700 }}>BAND SIZE</th>
                  <th style={{ padding: '12px', fontWeight: 700 }}>CUP SIZE</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {sizingData[activeTab].map((row, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #E5E5E1' }}>
                <td style={{ padding: '12px', fontWeight: 700 }}>{row.size}</td>
                {activeTab === 'leggings' ? (
                  <>
                    <td style={{ padding: '12px' }}>{unit === 'in' ? row.waistIn : row.waistCm}</td>
                    <td style={{ padding: '12px' }}>{unit === 'in' ? row.hipIn : row.hipCm}</td>
                  </>
                ) : (
                  <>
                    <td style={{ padding: '12px' }}>{row.band}</td>
                    <td style={{ padding: '12px' }}>{row.cup}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        <p style={{ fontSize: '0.75rem', color: '#777', marginTop: '20px', lineHeight: 1.5 }}>
          💡 <strong>Fit Tip:</strong> Airlift and Alosoft leggings feature 4-way stretch compression. If you prefer a snug compression fit for intense workouts, choose your true size. For a relaxed lounge feel, size up.
        </p>
      </div>
    </div>
  );
}
