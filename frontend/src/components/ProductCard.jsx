import React, { useState } from 'react';
import { Heart, Star } from 'lucide-react';

export default function ProductCard({
  product,
  onQuickView,
  onAddToCart,
  onSelectProduct,
  onToggleWishlist,
  isWishlisted,
  currency
}) {
  const [selectedColor, setSelectedColor] = useState(
    product.colors && product.colors.length > 0 ? product.colors[0] : null
  );

  const isINR = currency === 'INR';
  const priceSymbol = isINR ? '₹' : '$';
  const currentPrice = isINR ? product.price_inr : product.price_usd;
  const originalPrice = isINR ? product.original_price_inr : product.original_price_usd;

  return (
    <div className="product-card">
      {/* Product Image Container */}
      <div
        className="product-image-wrap"
        onClick={() => onSelectProduct(product)}
      >
        {/* Badge Tag */}
        {product.is_new ? (
          <span className="badge-tag">NEW DROP</span>
        ) : product.is_best_seller ? (
          <span className="badge-tag">BEST SELLER</span>
        ) : null}

        {/* Wishlist Button */}
        <button
          className="wishlist-btn"
          title="Add to Wishlist"
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
        >
          <Heart
            size={18}
            fill={isWishlisted ? '#000000' : 'none'}
            color={isWishlisted ? '#000000' : '#333333'}
          />
        </button>

        {/* Primary & Secondary Images */}
        <img
          src={product.image_primary}
          alt={product.name}
          className="product-image-primary"
          loading="lazy"
        />
        {product.image_secondary && (
          <img
            src={product.image_secondary}
            alt={`${product.name} lifestyle view`}
            className="product-image-secondary"
            loading="lazy"
          />
        )}

        {/* Quick Add Button */}
        <button
          className="quick-add-btn"
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(product);
          }}
        >
          QUICK VIEW / ADD
        </button>
      </div>

      {/* Product Info Section */}
      <div className="product-info">
        {/* Color Swatches */}
        {product.colors && product.colors.length > 0 && (
          <div className="color-swatches">
            {product.colors.map((col, idx) => (
              <span
                key={idx}
                className={`color-swatch ${selectedColor?.color_name === col.color_name ? 'active' : ''}`}
                style={{ backgroundColor: col.color_hex }}
                title={col.color_name}
                onClick={() => setSelectedColor(col)}
              />
            ))}
          </div>
        )}

        <h3
          className="product-title"
          onClick={() => onSelectProduct(product)}
          style={{ cursor: 'pointer' }}
        >
          {product.name}
        </h3>

        <p className="product-fabric">{product.fabric}</p>

        {/* Rating summary */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px', fontSize: '0.75rem', color: '#666' }}>
          <Star size={12} fill="#D4AF37" color="#D4AF37" />
          <span style={{ fontWeight: 600, color: '#000' }}>{product.rating}</span>
          <span>({product.reviews_count})</span>
        </div>

        {/* Price Row */}
        <div className="product-price-row">
          <span>{priceSymbol}{currentPrice ? currentPrice.toLocaleString() : '0'}</span>
          {originalPrice && (
            <span className="original-price">{priceSymbol}{originalPrice.toLocaleString()}</span>
          )}
        </div>
      </div>
    </div>
  );
}
