import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroBanner from './components/HeroBanner';
import CategoryGrid from './components/CategoryGrid';
import ProductGrid from './components/ProductGrid';
import ColorGrid from './components/ColorGrid';
import LoyaltyBanner from './components/LoyaltyBanner';
import SocialGrid from './components/SocialGrid';
import QuickViewModal from './components/QuickViewModal';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import AccountModal from './components/AccountModal';
import SizeGuideModal from './components/SizeGuideModal';
import ProductDetail from './components/ProductDetail';
import CheckoutModal from './components/CheckoutModal';
import Footer from './components/Footer';
import SEOHead from './components/SEOHead';
import { Check } from 'lucide-react';

export default function App() {
  const [currency, setCurrency] = useState('INR'); // Default to INR for India store
  const [activeCategory, setActiveCategory] = useState('all');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');

  // Cart & UI Modals State
  const [cartData, setCartData] = useState({ items: [], subtotal: 0 });
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, [activeCategory, sortOption, searchQuery, currency]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let url = `/api/products?sort=${sortOption}&currency=${currency}`;
      if (activeCategory !== 'all') {
        if (activeCategory === 'new-arrivals') {
          url += '&is_new=true';
        } else if (activeCategory === 'best-sellers') {
          url += '&is_best_seller=true';
        } else {
          url += `&category=${activeCategory}`;
        }
      }
      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      setProducts(data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setLoading(false);
    }
  };

  const fetchCart = async () => {
    try {
      const res = await fetch(`/api/cart?currency=${currency}`);
      const data = await res.json();
      setCartData(data);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleAddToCart = async (productId, variantId, colorName, size, quantity = 1) => {
    try {
      const res = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, variantId, colorName, size, quantity })
      });
      const data = await res.json();
      if (data.success) {
        fetchCart();
        setCartOpen(true);
        showToast('Added to your Shopping Bag!');
      }
    } catch (err) {
      console.error('Add to cart failed:', err);
    }
  };

  const handleUpdateQuantity = async (cartId, quantity) => {
    try {
      await fetch('/api/cart/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartId, quantity })
      });
      fetchCart();
    } catch (err) {
      console.error('Update cart failed:', err);
    }
  };

  const handleToggleWishlist = (product) => {
    if (wishlistIds.includes(product.id)) {
      setWishlistIds(wishlistIds.filter(id => id !== product.id));
      showToast(`Removed ${product.name} from wishlist`);
    } else {
      setWishlistIds([...wishlistIds, product.id]);
      showToast(`Added ${product.name} to wishlist ❤️`);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setActiveCategory('all');
    setSelectedProductId(null);
  };

  const handleSelectCategory = (catId) => {
    setActiveCategory(catId);
    setSearchQuery('');
    setSelectedProductId(null);
    const catalogElem = document.getElementById('catalog');
    if (catalogElem) {
      catalogElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectColor = (colorName) => {
    setSearchQuery(colorName);
    setActiveCategory('all');
    setSelectedProductId(null);
    const catalogElem = document.getElementById('catalog');
    if (catalogElem) {
      catalogElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const wishlistProducts = products.filter(p => wishlistIds.includes(p.id));

  return (
    <div className="app-layout">
      <SEOHead
        title="Alo Yoga India | Luxury Studio to Street Activewear"
        description="Official custom Shopify store for Alo Yoga India. High-waist airlift leggings, Accolade fleece hoodies, sports bras, and eco-friendly yoga mats."
      />

      {/* Global Header */}
      <Header
        cartCount={cartData.totalItems || 0}
        onOpenCart={() => setCartOpen(true)}
        onSelectCategory={handleSelectCategory}
        onSearch={handleSearch}
        activeCategory={activeCategory}
        wishlistCount={wishlistIds.length}
        onOpenWishlistDrawer={() => setWishlistOpen(true)}
        onOpenAccountModal={() => setAccountOpen(true)}
        currency={currency}
        onToggleCurrency={setCurrency}
      />

      {/* Main Content Area */}
      <main>
        {selectedProductId ? (
          <ProductDetail
            productId={selectedProductId}
            onBack={() => setSelectedProductId(null)}
            onAddToCart={handleAddToCart}
            onSelectProduct={(p) => setSelectedProductId(p.id)}
            onOpenSizeGuide={() => setSizeGuideOpen(true)}
            currency={currency}
          />
        ) : (
          <>
            {/* Hero Section Carousel */}
            <HeroBanner onSelectCategory={handleSelectCategory} />

            {/* Signature Fabric Collections Section */}
            <CategoryGrid onSelectCategory={handleSelectCategory} />

            {/* Product Catalog Grid Section */}
            <ProductGrid
              products={products}
              categories={categories}
              activeCategory={activeCategory}
              onSelectCategory={handleSelectCategory}
              sortOption={sortOption}
              onSortChange={setSortOption}
              onQuickView={(p) => setQuickViewProduct(p)}
              onAddToCart={handleAddToCart}
              onSelectProduct={(p) => setSelectedProductId(p.id)}
              onToggleWishlist={handleToggleWishlist}
              wishlistIds={wishlistIds}
              loading={loading}
              currency={currency}
            />

            {/* Shop by Color Palette Section */}
            <ColorGrid onSelectColor={handleSelectColor} />

            {/* Alo Access VIP Rewards Banner */}
            <LoyaltyBanner onOpenAccountModal={() => setAccountOpen(true)} />

            {/* Instagram Studio to Street Gallery */}
            <SocialGrid />
          </>
        )}
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartData={cartData}
        onUpdateQuantity={handleUpdateQuantity}
        onOpenCheckout={() => setCheckoutOpen(true)}
        currency={currency}
        onAddToCart={handleAddToCart}
      />

      {/* Dedicated Wishlist Drawer */}
      <WishlistDrawer
        isOpen={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        wishlistProducts={wishlistProducts}
        onRemoveFromWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        currency={currency}
      />

      {/* Account / Alo Access Sign-In Modal */}
      <AccountModal
        isOpen={accountOpen}
        onClose={() => setAccountOpen(false)}
      />

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
      />

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={handleAddToCart}
          currency={currency}
        />
      )}

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cartData={cartData}
        onOrderSuccess={() => fetchCart()}
        currency={currency}
      />

      {/* Global Toast Banner */}
      {toastMessage && (
        <div className="toast-container">
          <Check size={18} color="#D4AF37" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
