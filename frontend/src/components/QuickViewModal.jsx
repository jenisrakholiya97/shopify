import React, { useState } from 'react';
import { X, ShoppingBag, ShieldCheck, RefreshCw } from 'lucide-react';

export default function QuickViewModal({ product, onClose, onAddToCart, currency }) {
  if (!product) return null;

  const [selectedColor, setSelectedColor] = useState(
    product.colors && product.colors.length > 0 ? product.colors[0].color_name : 'Black'
  );
  const [selectedSize, setSelectedSize] = useState('S');
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const isINR = currency === 'INR';
  const priceSymbol = isINR ? '₹' : '$';
  const priceVal = isINR ? product.price_inr : product.price_usd;

  const availableSizes = ['XXS', 'XS', 'S', 'M', 'L', 'XL'];

  const handleAdd = async () => {
    setAdding(true);
    await onAddToCart(product.id, `${product.id}-variant`, selectedColor, selectedSize, quantity);
    setAdding(false);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Product Image Preview */}
        <div className="pdp-gallery">
          <img
            src={product.image_primary}
            alt={product.name}
            className="pdp-main-img"
          />
        </div>

        {/* Product Details & Selection */}
        <div className="pdp-details">
          <span className="pdp-fabric-tag">{product.fabric}</span>
          <h2 className="pdp-title">{product.name}</h2>
          
          <div className="pdp-price">{priceSymbol}{priceVal ? priceVal.toLocaleString() : '0'}</div>

          <p style={{ fontSize: '0.85rem', color: '#555', marginBottom: '24px', lineHeight: 1.6 }}>
            {product.description}
          </p>

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px' }}>
                COLOR: <span style={{ fontWeight: 400, textTransform: 'uppercase' }}>{selectedColor}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {product.colors.map((c, i) => (
                  <button
                    key={i}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: c.color_hex,
                      border: selectedColor === c.color_name ? '2px solid #000' : '1px solid #CCC',
                      outline: selectedColor === c.color_name ? '2px solid #FFF' : 'none',
                      cursor: 'pointer'
                    }}
                    title={c.color_name}
                    onClick={() => setSelectedColor(c.color_name)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          <div className="size-selector">
            <div className="size-selector-header">
              <span>SELECT SIZE:</span>
              <a href="#size-guide" style={{ textDecoration: 'underline', color: '#666' }}>Size Guide</a>
            </div>

            <div className="size-grid">
              {availableSizes.map((sz) => (
                <button
                  key={sz}
                  className={`size-box ${selectedSize === sz ? 'active' : ''}`}
                  onClick={() => setSelectedSize(sz)}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Add to Bag */}
          <div style={{ display: 'flex', gap: '16px', marginTop: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E5E5E1', padding: '0 12px' }}>
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ padding: '8px' }}>-</button>
              <span style={{ padding: '0 12px', fontWeight: 600 }}>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} style={{ padding: '8px' }}>+</button>
            </div>

            <button
              className="btn-primary"
              style={{ flex: 1 }}
              onClick={handleAdd}
              disabled={adding}
            >
              {adding ? 'ADDING...' : 'ADD TO BAG'} <ShoppingBag size={18} />
            </button>
          </div>

          {/* Guarantees */}
          <div style={{ display: 'flex', gap: '20px', marginTop: '24px', fontSize: '0.75rem', color: '#666' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} /> Free Returns
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <RefreshCw size={16} /> Studio Approved
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
