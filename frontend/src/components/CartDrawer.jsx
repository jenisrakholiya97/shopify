import React, { useState, useEffect } from 'react';
import { X, Trash2, Lock, Truck, Gift, Tag, Plus } from 'lucide-react';

export default function CartDrawer({
  isOpen,
  onClose,
  cartData,
  onUpdateQuantity,
  onOpenCheckout,
  currency,
  onAddToCart
}) {
  const {
    items = [],
    subtotal = 0,
    freeShippingThreshold = 8500,
    freeShippingRemaining = 8500,
    hasFreeShipping = false
  } = cartData || {};

  const isINR = currency === 'INR';
  const priceSymbol = isINR ? '₹' : '$';
  const progressPercentage = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  // Free Gift Threshold (e.g., ₹12,000 or $150)
  const freeGiftThreshold = isINR ? 12000 : 150;
  const hasFreeGift = subtotal >= freeGiftThreshold;
  const giftRemaining = Math.max(0, freeGiftThreshold - subtotal);

  // Promo Code State
  const [couponInput, setCouponInput] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponMessage, setCouponMessage] = useState(null);
  const [upsellItems, setUpsellItems] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchUpsells();
    }
  }, [isOpen, currency]);

  const fetchUpsells = async () => {
    try {
      const res = await fetch(`/api/cart/upsells?currency=${currency}`);
      const data = await res.json();
      setUpsellItems(data);
    } catch (err) {
      console.error('Failed to fetch upsells:', err);
    }
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    try {
      const res = await fetch('/api/coupon/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput })
      });
      const data = await res.json();
      if (data.success) {
        setDiscountPercent(data.discountPercent);
        setCouponMessage({ type: 'success', text: data.message });
      } else {
        setCouponMessage({ type: 'error', text: data.message });
      }
    } catch (err) {
      setCouponMessage({ type: 'error', text: 'Failed to apply coupon' });
    }
  };

  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const finalSubtotal = Math.max(0, subtotal - discountAmount);

  return (
    <div className={`cart-drawer-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cart-header">
          <h3>YOUR SHOPPING BAG ({items.reduce((a, b) => a + b.quantity, 0)})</h3>
          <button onClick={onClose} style={{ padding: '4px' }}>
            <X size={22} />
          </button>
        </div>

        {/* Free Shipping & Free Gift Progress Bar */}
        <div className="free-shipping-meter">
          <div className="free-shipping-text">
            <Truck size={16} />
            {hasFreeShipping ? (
              <span style={{ color: '#000', fontWeight: 700 }}>YOU QUALIFY FOR FREE EXPRESS SHIPPING! 🎉</span>
            ) : (
              <span>
                Add <strong style={{ color: '#000' }}>{priceSymbol}{freeShippingRemaining.toLocaleString()}</strong> more for <strong>FREE SHIPPING</strong>
              </span>
            )}
          </div>
          <div className="meter-bar-track">
            <div
              className="meter-bar-fill"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {/* Free Gift with Purchase Banner */}
          <div className="free-gift-banner">
            <Gift size={16} color="#000" />
            {hasFreeGift ? (
              <span><strong>UNLOCKED!</strong> Free Alo Luxury Carryall Shopper Tote added!</span>
            ) : (
              <span>Add <strong>{priceSymbol}{giftRemaining.toLocaleString()}</strong> more for a <strong>FREE ALO SHOPPER TOTE!</strong></span>
            )}
          </div>
        </div>

        {/* Items List */}
        <div className="cart-items-container">
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <p style={{ fontSize: '1rem', color: '#666', marginBottom: '16px' }}>Your shopping bag is empty.</p>
              <button className="btn-primary" onClick={onClose}>
                START SHOPPING
              </button>
            </div>
          ) : (
            <>
              {items.map((item) => (
                <div key={item.cart_id} className="cart-item">
                  <img
                    src={item.image_primary}
                    alt={item.name}
                    className="cart-item-img"
                  />
                  <div className="cart-item-details">
                    <div>
                      <h4 className="cart-item-title">{item.name}</h4>
                      <p className="cart-item-meta">
                        Color: {item.color_name} | Size: {item.size}
                      </p>
                      <p style={{ fontWeight: 700, fontSize: '0.85rem', marginTop: '4px' }}>
                        {priceSymbol}{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' }}>
                      <div className="cart-item-qty">
                        <button onClick={() => onUpdateQuantity(item.cart_id, item.quantity - 1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => onUpdateQuantity(item.cart_id, item.quantity + 1)}>+</button>
                      </div>

                      <button
                        onClick={() => onUpdateQuantity(item.cart_id, 0)}
                        style={{ color: '#999', padding: '4px' }}
                        title="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Free Gift item row if unlocked */}
              {hasFreeGift && (
                <div className="cart-item free-gift-item">
                  <img
                    src="https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=200&auto=format&fit=crop"
                    alt="Free Alo Tote"
                    className="cart-item-img"
                  />
                  <div className="cart-item-details">
                    <span className="badge-tag" style={{ background: '#000', color: '#fff' }}>GIFT WITH PURCHASE</span>
                    <h4 className="cart-item-title" style={{ marginTop: '4px' }}>Alo Heavy-Duty Shopper Tote</h4>
                    <p style={{ fontWeight: 700, color: '#000', fontSize: '0.85rem' }}>FREE (Value: {priceSymbol}{isINR ? '4,000' : '48'})</p>
                  </div>
                </div>
              )}

              {/* Recommended Accessories Impulse Upsells */}
              {upsellItems.length > 0 && (
                <div className="cart-upsell-section">
                  <p className="upsell-title">RECOMMENDED ACCESSORIES</p>
                  <div className="upsell-list">
                    {upsellItems.map((up) => (
                      <div key={up.id} className="upsell-card">
                        <img src={up.image_primary} alt={up.name} />
                        <div className="upsell-info">
                          <p className="upsell-name">{up.name}</p>
                          <p className="upsell-price">{priceSymbol}{up.price.toLocaleString()}</p>
                        </div>
                        <button
                          className="upsell-add-btn"
                          onClick={() => onAddToCart(up.id, `${up.id}-var`, 'Black', 'One Size')}
                        >
                          <Plus size={14} /> ADD
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer & Checkout Section */}
        {items.length > 0 && (
          <div className="cart-footer">
            {/* Promo Code Input Box */}
            <form onSubmit={handleApplyCoupon} className="coupon-form">
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="PROMO CODE (e.g. ALO10)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                />
                <button type="submit">APPLY</button>
              </div>
              {couponMessage && (
                <p className={`coupon-msg ${couponMessage.type}`}>
                  <Tag size={12} /> {couponMessage.text}
                </p>
              )}
            </form>

            <div className="cart-subtotal-row">
              <span>SUBTOTAL</span>
              <span>{priceSymbol}{subtotal.toLocaleString()}</span>
            </div>

            {discountPercent > 0 && (
              <div className="cart-subtotal-row" style={{ color: '#27ae60' }}>
                <span>PROMO DISCOUNT ({discountPercent}%)</span>
                <span>-{priceSymbol}{discountAmount.toLocaleString()}</span>
              </div>
            )}

            <div className="cart-subtotal-row" style={{ fontWeight: 800, fontSize: '1rem', borderTop: '1px solid #E5E5E5', paddingTop: '8px' }}>
              <span>TOTAL</span>
              <span>{priceSymbol}{finalSubtotal.toLocaleString()}</span>
            </div>

            <p style={{ fontSize: '0.75rem', color: '#777', margin: '12px 0', textAlign: 'center' }}>
              Taxes and duties calculated during checkout
            </p>

            <button
              className="checkout-btn"
              onClick={() => {
                onClose();
                onOpenCheckout();
              }}
            >
              PROCEED TO CHECKOUT <Lock size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
