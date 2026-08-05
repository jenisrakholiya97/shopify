import React, { useState, useEffect } from 'react';
import { Star, ShoppingBag, ArrowLeft, CheckCircle2 } from 'lucide-react';
import SEOHead from './SEOHead';

export default function ProductDetail({ productId, onBack, onAddToCart, onSelectProduct, currency, onOpenSizeGuide }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState('S');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState('');
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [newReview, setNewReview] = useState({ author: '', rating: 5, title: '', comment: '' });

  const isINR = currency === 'INR';
  const priceSymbol = isINR ? '₹' : '$';

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/products/${productId}`);
      const data = await res.json();
      setProduct(data);
      setActiveImage(data.image_primary);
      if (data.variants && data.variants.length > 0) {
        setSelectedColor(data.variants[0].color_name);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, ...newReview })
      });
      setReviewFormOpen(false);
      setNewReview({ author: '', rating: 5, title: '', comment: '' });
      fetchProductDetails();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !product) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 0', fontSize: '1rem', color: '#666' }}>
        Loading product details...
      </div>
    );
  }

  const sizes = ['XXS', 'XS', 'S', 'M', 'L', 'XL'];
  const priceVal = isINR ? product.price_inr : product.price_usd;

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '40px 32px' }}>
      <SEOHead
        title={`${product.name} - Studio to Street Activewear`}
        description={product.description}
      />

      <button
        onClick={onBack}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.85rem',
          fontWeight: 600,
          marginBottom: '32px',
          textTransform: 'uppercase'
        }}
      >
        <ArrowLeft size={16} /> BACK TO COLLECTION
      </button>

      {/* Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '60px', marginBottom: '80px' }}>
        {/* Multi-angle Gallery */}
        <div>
          <div style={{ marginBottom: '16px', backgroundColor: '#F8F8F6', aspectRatio: '3/4', overflow: 'hidden' }}>
            <img src={activeImage} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <img
              src={product.image_primary}
              alt="View 1"
              style={{ width: '90px', height: '120px', objectFit: 'cover', cursor: 'pointer', border: activeImage === product.image_primary ? '2px solid #000' : '1px solid #DDD' }}
              onClick={() => setActiveImage(product.image_primary)}
            />
            {product.image_secondary && (
              <img
                src={product.image_secondary}
                alt="View 2"
                style={{ width: '90px', height: '120px', objectFit: 'cover', cursor: 'pointer', border: activeImage === product.image_secondary ? '2px solid #000' : '1px solid #DDD' }}
                onClick={() => setActiveImage(product.image_secondary)}
              />
            )}
          </div>
        </div>

        {/* Details Column */}
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.12em', color: '#666', textTransform: 'uppercase' }}>
            {product.fabric}
          </span>

          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '8px', marginBottom: '12px', textTransform: 'none' }}>
            {product.name}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', color: '#D4AF37' }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill={i < Math.floor(product.rating) ? '#D4AF37' : 'none'} color="#D4AF37" />
              ))}
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{product.rating}</span>
            <span style={{ fontSize: '0.85rem', color: '#777' }}>({product.reviews_count} reviews)</span>
          </div>

          <div style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '24px' }}>
            {priceSymbol}{priceVal ? priceVal.toLocaleString() : '0'}
          </div>

          <p style={{ color: '#444', lineHeight: 1.7, marginBottom: '32px' }}>
            {product.description}
          </p>

          {/* Feature Highlights */}
          <div style={{ background: '#F8F8F6', padding: '20px', marginBottom: '32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} /> 4-Way Signature Stretch
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} /> Moisture-Wicking Fabric
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} /> Lifts, Sculpts & Smooths
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} /> Tested by Yoga Masters
            </div>
          </div>

          {/* Size Selector */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '12px' }}>
              <span>SELECT SIZE:</span>
              <span
                style={{ color: '#000', textDecoration: 'underline', cursor: 'pointer' }}
                onClick={() => onOpenSizeGuide && onOpenSizeGuide()}
              >
                Size & Fit Guide
              </span>
            </div>
            <div className="size-grid">
              {sizes.map((sz) => (
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

          {/* Add to Bag Button */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E5E5E1', padding: '0 16px' }}>
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ padding: '8px', fontSize: '1rem', fontWeight: 700 }}>-</button>
              <span style={{ padding: '0 16px', fontWeight: 700 }}>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} style={{ padding: '8px', fontSize: '1rem', fontWeight: 700 }}>+</button>
            </div>

            <button
              className="btn-primary"
              style={{ flex: 1, padding: '18px 0', fontSize: '0.9rem' }}
              onClick={() => onAddToCart(product.id, `${product.id}-variant`, selectedColor || 'Default', selectedSize, quantity)}
            >
              ADD TO SHOPPING BAG <ShoppingBag size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div style={{ borderTop: '1px solid #E5E5E1', paddingTop: '60px', marginBottom: '80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '36px' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>CUSTOMER REVIEWS</h2>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>Real feedback from verified Alo shoppers.</p>
          </div>
          <button className="btn-secondary" style={{ color: '#000', borderColor: '#000' }} onClick={() => setReviewFormOpen(!reviewFormOpen)}>
            WRITE A REVIEW
          </button>
        </div>

        {/* Review Form Modal */}
        {reviewFormOpen && (
          <form onSubmit={handleAddReview} style={{ background: '#F8F8F6', padding: '24px', marginBottom: '36px', maxWidth: '600px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>Write Your Review</h3>
            <input
              type="text"
              placeholder="Your Name"
              value={newReview.author}
              onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
              required
              style={{ width: '100%', padding: '10px', marginBottom: '12px', border: '1px solid #DDD' }}
            />
            <input
              type="text"
              placeholder="Review Title (e.g., Best leggings ever!)"
              value={newReview.title}
              onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
              required
              style={{ width: '100%', padding: '10px', marginBottom: '12px', border: '1px solid #DDD' }}
            />
            <textarea
              placeholder="Your detailed review..."
              rows={4}
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              required
              style={{ width: '100%', padding: '10px', marginBottom: '12px', border: '1px solid #DDD' }}
            />
            <button type="submit" className="btn-primary">SUBMIT REVIEW</button>
          </form>
        )}

        {/* Reviews List */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {product.reviews && product.reviews.map((rev) => (
            <div key={rev.id} style={{ background: '#F8F8F6', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', gap: '2px', color: '#D4AF37' }}>
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={14} fill="#D4AF37" color="#D4AF37" />
                  ))}
                </div>
                <span style={{ fontSize: '0.75rem', color: '#888' }}>{rev.date}</span>
              </div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '6px' }}>{rev.title}</h4>
              <p style={{ fontSize: '0.85rem', color: '#444', marginBottom: '12px', lineHeight: 1.5 }}>"{rev.comment}"</p>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#000' }}>— {rev.author} (Verified Buyer)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
