import React, { useState } from 'react';
import { X, Lock, CheckCircle, CreditCard } from 'lucide-react';

export default function CheckoutModal({ isOpen, onClose, cartData, onOrderSuccess, currency }) {
  if (!isOpen) return null;

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    cardNumber: '4532 •••• •••• 8892',
    expDate: '08/28',
    cvv: '921'
  });
  const [loading, setLoading] = useState(false);
  const [orderResult, setOrderResult] = useState(null);

  const isINR = currency === 'INR';
  const priceSymbol = isINR ? '₹' : '$';

  const { items = [], subtotal = 0, hasFreeShipping = false } = cartData || {};
  const shippingFee = hasFreeShipping ? 0 : (isINR ? 1200.00 : 15.00);
  const grandTotal = subtotal + shippingFee;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.name,
          customerEmail: formData.email,
          shippingAddress: `${formData.address}, ${formData.city} ${formData.zip}`,
          items,
          totalAmount: grandTotal,
          currency
        })
      });

      const data = await res.json();
      setLoading(false);
      if (data.success) {
        setOrderResult(data);
        setStep(3);
        onOrderSuccess();
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '800px', gridTemplateColumns: step === 3 ? '1fr' : '1.2fr 1fr' }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {step === 3 ? (
          /* Confirmation Screen */
          <div style={{ padding: '60px 40px', textAlign: 'center' }}>
            <CheckCircle size={64} color="#000" style={{ marginBottom: '20px' }} />
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '12px' }}>ORDER CONFIRMED!</h2>
            <p style={{ fontSize: '1rem', color: '#666', marginBottom: '8px' }}>
              Thank you for your order, <strong>{formData.name}</strong>.
            </p>
            <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '24px' }}>
              Order Number: <strong style={{ color: '#000' }}>{orderResult?.orderId}</strong>
            </p>
            <p style={{ fontSize: '0.85rem', color: '#555', maxWidth: '500px', margin: '0 auto 32px' }}>
              We have sent a confirmation email to <strong>{formData.email}</strong>. Your Alo studio apparel is being prepared for express shipping!
            </p>
            <button className="btn-primary" onClick={onClose}>
              CONTINUE SHOPPING
            </button>
          </div>
        ) : (
          /* Checkout Form */
          <>
            <div style={{ padding: '36px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em' }}>
                <Lock size={16} /> SECURE ALO CHECKOUT ({currency})
              </div>

              <form onSubmit={handleSubmitOrder}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>1. Shipping Details</h3>
                
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  style={{ width: '100%', padding: '12px', marginBottom: '12px', border: '1px solid #CCC', fontSize: '0.85rem' }}
                />
                
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  style={{ width: '100%', padding: '12px', marginBottom: '12px', border: '1px solid #CCC', fontSize: '0.85rem' }}
                />

                <input
                  type="text"
                  placeholder="Street Address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                  style={{ width: '100%', padding: '12px', marginBottom: '12px', border: '1px solid #CCC', fontSize: '0.85rem' }}
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                  <input
                    type="text"
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                    style={{ padding: '12px', border: '1px solid #CCC', fontSize: '0.85rem' }}
                  />
                  <input
                    type="text"
                    placeholder="Postal Code"
                    value={formData.zip}
                    onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                    required
                    style={{ padding: '12px', border: '1px solid #CCC', fontSize: '0.85rem' }}
                  />
                </div>

                <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>2. Payment Method</h3>
                
                <div style={{ background: '#F8F8F6', padding: '16px', border: '1px solid #E5E5E1', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', fontSize: '0.85rem', fontWeight: 600 }}>
                    <CreditCard size={20} /> Credit / Debit Card (Sandbox)
                  </div>
                  <input
                    type="text"
                    value={formData.cardNumber}
                    readOnly
                    style={{ width: '100%', padding: '10px', background: '#FFF', border: '1px solid #DDD', marginBottom: '8px', fontSize: '0.85rem' }}
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <input type="text" value={formData.expDate} readOnly style={{ padding: '8px', background: '#FFF', border: '1px solid #DDD', fontSize: '0.8rem' }} />
                    <input type="text" value={formData.cvv} readOnly style={{ padding: '8px', background: '#FFF', border: '1px solid #DDD', fontSize: '0.8rem' }} />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: '100%', padding: '16px 0' }}
                  disabled={loading}
                >
                  {loading ? 'PROCESSING...' : `COMPLETE ORDER • ${priceSymbol}${grandTotal.toLocaleString()}`}
                </button>
              </form>
            </div>

            {/* Sidebar */}
            <div style={{ background: '#F8F8F6', padding: '36px', borderLeft: '1px solid #E5E5E1' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '20px' }}>ORDER SUMMARY</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px', maxHeight: '300px', overflowY: 'auto' }}>
                {items.map((it) => (
                  <div key={it.cart_id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{it.name} (x{it.quantity})</div>
                      <div style={{ fontSize: '0.75rem', color: '#777' }}>{it.color_name} / {it.size}</div>
                    </div>
                    <div style={{ fontWeight: 700 }}>{priceSymbol}{(it.price * it.quantity).toLocaleString()}</div>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid #DDD', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Subtotal</span>
                  <span>{priceSymbol}{subtotal.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Express Shipping</span>
                  <span>{hasFreeShipping ? 'FREE' : `${priceSymbol}${shippingFee.toLocaleString()}`}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800, marginTop: '8px', borderTop: '1px solid #000', paddingTop: '12px' }}>
                  <span>TOTAL</span>
                  <span>{priceSymbol}{grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
