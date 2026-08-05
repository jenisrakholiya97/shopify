import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';

export default function WishlistDrawer({
  isOpen,
  onClose,
  wishlistProducts = [],
  onRemoveFromWishlist,
  onAddToCart,
  currency
}) {
  if (!isOpen) return null;

  const isINR = currency === 'INR';
  const priceSymbol = isINR ? '₹' : '$';

  return (
    <div className="cart-drawer-overlay active" onClick={onClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cart-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Heart size={20} fill="#000" />
            <h3>YOUR WISHLIST ({wishlistProducts.length})</h3>
          </div>
          <button onClick={onClose} style={{ padding: '4px' }}>
            <X size={22} />
          </button>
        </div>

        {/* Wishlist Items Container */}
        <div className="cart-items-container">
          {wishlistProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <Heart size={48} color="#CCC" style={{ margin: '0 auto 16px' }} />
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>YOUR WISHLIST IS EMPTY</h4>
              <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '24px' }}>
                Tap the heart icon on any Airlift legging, Accolade hoodie, or accessory to save your favorite styles!
              </p>
              <button className="btn-primary" onClick={onClose}>
                EXPLORE STYLES
              </button>
            </div>
          ) : (
            wishlistProducts.map((p) => {
              const currentPrice = isINR ? p.price_inr : p.price_usd;
              return (
                <div key={p.id} className="cart-item">
                  <img
                    src={p.image_primary}
                    alt={p.name}
                    className="cart-item-img"
                  />
                  <div className="cart-item-details">
                    <div>
                      <h4 className="cart-item-title">{p.name}</h4>
                      <p className="cart-item-meta">{p.fabric || 'Studio Activewear'}</p>
                      <p style={{ fontWeight: 700, fontSize: '0.85rem', marginTop: '4px' }}>
                        {priceSymbol}{currentPrice ? currentPrice.toLocaleString() : '0'}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                      <button
                        className="btn-primary"
                        style={{ padding: '8px 12px', fontSize: '0.75rem', flex: 1 }}
                        onClick={() => {
                          onAddToCart(p.id, `${p.id}-var`, p.colors?.[0]?.color_name || 'Black', 'S');
                          onRemoveFromWishlist(p);
                        }}
                      >
                        <ShoppingBag size={14} /> ADD TO BAG
                      </button>

                      <button
                        onClick={() => onRemoveFromWishlist(p)}
                        style={{ color: '#999', padding: '8px' }}
                        title="Remove from wishlist"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {wishlistProducts.length > 0 && (
          <div className="cart-footer">
            <button className="btn-secondary" style={{ width: '100%' }} onClick={onClose}>
              CONTINUE SHOPPING
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
