import React, { useState } from 'react';
import { ShoppingBag, Search, Heart, Menu, X, User, ChevronRight, Tag, Sparkles } from 'lucide-react';
import MegaMenu from './MegaMenu';

export default function Header({
  cartCount,
  onOpenCart,
  onSelectCategory,
  onSearch,
  activeCategory,
  wishlistCount,
  onOpenWishlistDrawer,
  onOpenAccountModal,
  currency,
  onToggleCurrency
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      setSearchOpen(false);
    }
  };

  const handleQuickSearchTerm = (term) => {
    setSearchQuery(term);
    onSearch(term);
    setSearchOpen(false);
  };

  return (
    <>
      {/* Dynamic Announcement Bar Ticker */}
      <div className="announcement-bar">
        <span>
          ✨ {currency === 'INR' ? 'FREE EXPRESS SHIPPING TO INDIA ON ORDERS OVER ₹8,500' : 'FREE EXPRESS SHIPPING WORLDWIDE ON ORDERS OVER $100'} | SHOP NEW TUESDAY DROPS ✨
        </span>
      </div>

      {/* Main Sticky Luxury Header */}
      <header className="site-header">
        <div className="header-container">
          {/* Mobile Menu Hamburger Toggle */}
          <button
            className="mobile-menu-toggle"
            aria-label="Toggle Navigation Menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* SVG Alo Brand Logo */}
          <a
            href="/"
            className="brand-logo"
            onClick={(e) => {
              e.preventDefault();
              onSelectCategory('all');
            }}
          >
            <svg viewBox="0 0 71 48" width="56" height="38" fill="currentColor">
              <path d="M22.826 19.591h5.771v27.43h-5.77v-1.928A13.973 13.973 0 0114.298 48C6.414 48 0 41.409 0 33.306c0-8.103 6.414-14.694 14.299-14.694 3.193 0 6.145 1.082 8.527 2.907zm-.145 13.715c0-4.861-3.76-8.816-8.382-8.816-4.623 0-8.382 3.955-8.382 8.816 0 4.862 3.76 8.816 8.382 8.816s8.382-3.954 8.382-8.816zM39.434 47.02h-5.906V0h5.906zm2.969-13.714c0-8.103 6.414-14.694 14.298-14.694C64.586 18.612 71 25.203 71 33.306 71 41.41 64.586 48 56.701 48s-14.298-6.591-14.298-14.694zm5.916 0c0 4.862 3.76 8.816 8.382 8.816 4.623 0-8.382-3.954 8.382-8.816 0-4.861-3.76-8.816-8.382-8.816s-8.382 3.955-8.382 8.816z"/>
            </svg>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="desktop-nav">
            <ul className="nav-links">
              <li className="nav-link-item">
                <button
                  className={`nav-link-btn ${activeCategory === 'women' ? 'active' : ''}`}
                  onClick={() => onSelectCategory('women')}
                >
                  Women
                </button>
                <MegaMenu category="women" onSelectCategory={onSelectCategory} />
              </li>
              <li className="nav-link-item">
                <button
                  className={`nav-link-btn ${activeCategory === 'men' ? 'active' : ''}`}
                  onClick={() => onSelectCategory('men')}
                >
                  Men
                </button>
                <MegaMenu category="men" onSelectCategory={onSelectCategory} />
              </li>
              <li className="nav-link-item">
                <button
                  className={`nav-link-btn ${activeCategory === 'accessories' ? 'active' : ''}`}
                  onClick={() => onSelectCategory('accessories')}
                >
                  Accessories
                </button>
                <MegaMenu category="accessories" onSelectCategory={onSelectCategory} />
              </li>
              <li className="nav-link-item">
                <button
                  className={`nav-link-btn ${activeCategory === 'shoes' ? 'active' : ''}`}
                  onClick={() => onSelectCategory('shoes')}
                >
                  Footwear
                </button>
                <MegaMenu category="shoes" onSelectCategory={onSelectCategory} />
              </li>
              <li className="nav-link-item">
                <button
                  className={`nav-link-btn ${activeCategory === 'beauty' ? 'active' : ''}`}
                  onClick={() => onSelectCategory('accessories')}
                >
                  Beauty
                </button>
                <MegaMenu category="beauty" onSelectCategory={onSelectCategory} />
              </li>
              <li className="nav-link-item">
                <button
                  className={`nav-link-btn ${activeCategory === 'new-arrivals' ? 'active' : ''}`}
                  onClick={() => onSelectCategory('new-arrivals')}
                >
                  New Drops
                </button>
                <MegaMenu category="new-arrivals" onSelectCategory={onSelectCategory} />
              </li>
              <li className="nav-link-item">
                <button
                  className={`nav-link-btn ${activeCategory === 'best-sellers' ? 'active' : ''}`}
                  onClick={() => onSelectCategory('best-sellers')}
                >
                  Best Sellers
                </button>
                <MegaMenu category="best-sellers" onSelectCategory={onSelectCategory} />
              </li>
            </ul>
          </nav>

          {/* Right Action Icons & Currency Switcher */}
          <div className="header-actions">
            {/* Currency Selector Pill */}
            <div className="currency-toggle-pill" title="Toggle Store Currency">
              <button
                className={`currency-btn ${currency === 'INR' ? 'active' : ''}`}
                onClick={() => onToggleCurrency('INR')}
              >
                ₹ INR
              </button>
              <button
                className={`currency-btn ${currency === 'USD' ? 'active' : ''}`}
                onClick={() => onToggleCurrency('USD')}
              >
                $ USD
              </button>
            </div>

            {/* Search Trigger */}
            <button className="icon-btn" title="Search Alo" onClick={() => setSearchOpen(true)}>
              <Search size={20} />
            </button>

            {/* Wishlist Trigger */}
            <button className="icon-btn" title="Wishlist Drawer" onClick={onOpenWishlistDrawer}>
              <Heart size={20} />
              {wishlistCount > 0 && <span className="cart-badge">{wishlistCount}</span>}
            </button>

            {/* Account Trigger */}
            <button className="icon-btn" title="Alo Access Account" onClick={onOpenAccountModal}>
              <User size={20} />
            </button>

            {/* Cart Drawer Trigger */}
            <button className="icon-btn" title="Shopping Bag" onClick={onOpenCart}>
              <ShoppingBag size={20} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <div className={`mobile-nav-drawer ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-nav-header">
            <span style={{ fontWeight: 700, letterSpacing: '0.1em' }}>EXPLORE ALO</span>
            <button onClick={() => setMobileMenuOpen(false)}>
              <X size={24} />
            </button>
          </div>
          <div className="mobile-nav-links">
            <button className="mobile-nav-item" onClick={() => { onSelectCategory('women'); setMobileMenuOpen(false); }}>
              <span>WOMEN</span> <ChevronRight size={18} />
            </button>
            <button className="mobile-nav-item" onClick={() => { onSelectCategory('men'); setMobileMenuOpen(false); }}>
              <span>MEN</span> <ChevronRight size={18} />
            </button>
            <button className="mobile-nav-item" onClick={() => { onSelectCategory('accessories'); setMobileMenuOpen(false); }}>
              <span>ACCESSORIES</span> <ChevronRight size={18} />
            </button>
            <button className="mobile-nav-item" onClick={() => { onSelectCategory('shoes'); setMobileMenuOpen(false); }}>
              <span>FOOTWEAR</span> <ChevronRight size={18} />
            </button>
            <button className="mobile-nav-item" onClick={() => { onSelectCategory('new-arrivals'); setMobileMenuOpen(false); }}>
              <span>NEW DROPS</span> <ChevronRight size={18} />
            </button>
            <button className="mobile-nav-item" onClick={() => { onSelectCategory('best-sellers'); setMobileMenuOpen(false); }}>
              <span>BEST SELLERS</span> <ChevronRight size={18} />
            </button>
            <button className="mobile-nav-item" onClick={() => { onOpenAccountModal(); setMobileMenuOpen(false); }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Sparkles size={16} color="#D4AF37" /> ALO ACCESS VIP</span> <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Predictive Instant Search Modal */}
      {searchOpen && (
        <div className="search-modal-overlay" onClick={() => setSearchOpen(false)}>
          <div className="search-modal-content" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSearchSubmit} className="search-form">
              <Search size={22} color="#000" />
              <input
                type="text"
                placeholder="Search Leggings, Hoodies, Yoga Mats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button type="button" onClick={() => setSearchOpen(false)}>
                <X size={22} />
              </button>
            </form>

            {/* Trending Quick Suggestions */}
            <div className="search-suggestions">
              <p className="suggestion-title">TRENDING SEARCHES</p>
              <div className="suggestion-tags">
                <button type="button" onClick={() => handleQuickSearchTerm('Airlift Leggings')}>
                  Airlift Leggings
                </button>
                <button type="button" onClick={() => handleQuickSearchTerm('Accolade Hoodie')}>
                  Accolade Hoodie
                </button>
                <button type="button" onClick={() => handleQuickSearchTerm('Yoga Mat')}>
                  Yoga Mat
                </button>
                <button type="button" onClick={() => handleQuickSearchTerm('Alosoft')}>
                  Alosoft
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
