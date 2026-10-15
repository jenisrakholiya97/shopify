import React, { useState, useEffect, useRef } from 'react';
import { Search, Heart, User, X, Menu } from 'lucide-react';
import MegaMenu from './MegaMenu';

export default function Header({
  products = [],
  cartCount = 0,
  onOpenCart,
  onSelectCategory,
  onSearch,
  activeCategory,
  wishlistCount = 0,
  onOpenWishlistDrawer,
  onOpenAccountModal,
  currency = 'INR',
  onToggleCurrency
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileActiveTab, setMobileActiveTab] = useState('women');
  const [hoveredNav, setHoveredNav] = useState(null);
  const searchInputRef = useRef(null);

  // Lock background scroll when search modal or mobile drawer is open
  useEffect(() => {
    if (searchOpen || mobileMenuOpen) {
      document.body.classList.add('modal-open');
      document.documentElement.classList.add('modal-open');
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      if (searchOpen && searchInputRef.current) {
        setTimeout(() => searchInputRef.current?.focus(), 80);
      }
    } else {
      const hasOtherModal = document.querySelector(
        '.cart-drawer.open, .cart-drawer-overlay.active, .modal-backdrop'
      );
      if (!hasOtherModal) {
        document.body.classList.remove('modal-open');
        document.documentElement.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      }
    }

    return () => {
      document.body.classList.remove('modal-open');
      document.documentElement.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [searchOpen, mobileMenuOpen]);

  // Handle escape key to close modals
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (searchOpen) setSearchOpen(false);
        if (mobileMenuOpen) setMobileMenuOpen(false);
        setHoveredNav(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen, mobileMenuOpen]);

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

  // Curated Popular Search Products (matching Alo Yoga Search Modal Screenshot)
  const defaultPopularProducts = [
    {
      id: 'alo-2',
      name: 'Accolade Crew Neck Pullover',
      colorName: 'Black',
      priceFormatted: currency === 'INR' ? '₹20,000' : '$138',
      badge: 'BEST SELLER',
      swatches: ['#000000', '#3B2F2F', '#1B263B'],
      extraSwatches: '+17',
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600&auto=format&fit=crop',
      category: 'women'
    },
    {
      id: 'alo-1',
      name: '7/8 High-Waist Airlift Legging',
      colorName: 'Black',
      priceFormatted: currency === 'INR' ? '₹19,400' : '$128',
      badge: 'BEST SELLER',
      swatches: ['#000000', '#3B2F2F', '#1B263B'],
      extraSwatches: '+23',
      image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=600&auto=format&fit=crop',
      category: 'women'
    },
    {
      id: 'alo-8',
      name: 'ALO Recovery Mode Sneaker (Unisex)',
      colorName: 'Natural White/Gum',
      priceFormatted: currency === 'INR' ? '₹28,300' : '$198',
      badge: '',
      swatches: ['#A07855', '#FFFFFF', '#EAE6DF'],
      extraSwatches: '+7',
      image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600&auto=format&fit=crop',
      category: 'shoes'
    },
    {
      id: 'alo-7',
      name: 'Match Point Tennis Skirt',
      colorName: 'Black',
      priceFormatted: currency === 'INR' ? '₹11,300' : '$78',
      badge: 'BEST SELLER',
      swatches: ['#000000', '#FFFFFF', '#1B263B'],
      extraSwatches: '+4',
      image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=600&auto=format&fit=crop',
      category: 'women'
    }
  ];

  // Dynamic search results: when typing, searches live catalog products!
  let displayProducts = defaultPopularProducts;
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    // Search through live products catalog
    const matchedCatalog = (products || [])
      .filter(
        (p) =>
          (p.name || '').toLowerCase().includes(q) ||
          (p.description || '').toLowerCase().includes(q) ||
          (p.fabric || '').toLowerCase().includes(q) ||
          (p.category_id || '').toLowerCase().includes(q)
      )
      .map((p) => ({
        id: p.id,
        name: p.name,
        colorName: p.colors?.[0]?.color_name || 'Standard',
        priceFormatted:
          currency === 'INR' ? `₹${(p.price_inr || 0).toLocaleString()}` : `$${p.price_usd || 0}`,
        badge: p.is_best_seller ? 'BEST SELLER' : p.is_new ? 'NEW DROP' : '',
        swatches: (p.colors || []).slice(0, 3).map((c) => c.color_hex),
        extraSwatches: (p.colors || []).length > 3 ? `+${p.colors.length - 3}` : '',
        image: p.image_primary || p.image || defaultPopularProducts[0].image,
        category: p.category_id || 'all'
      }));

    // Also search default products
    const matchedDefaults = defaultPopularProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.colorName.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );

    const combined = [...matchedCatalog, ...matchedDefaults];
    // Deduplicate by name
    const seen = new Set();
    displayProducts = combined.filter((item) => {
      if (seen.has(item.name)) return false;
      seen.add(item.name);
      return true;
    });
  }

  // Mobile Drawer Tab Category Cards (matching Alo Yoga Mobile Drawer Screenshot)
  const mobileCardsData = {
    women: [
      {
        title: "WOMEN'S CLOTHING",
        category: 'women',
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop'
      },
      {
        title: 'BEST SELLERS',
        category: 'best-sellers',
        image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600&auto=format&fit=crop'
      },
      {
        title: 'ACCESSORIES',
        category: 'accessories',
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop'
      },
      {
        title: 'NEW ARRIVALS',
        category: 'new-arrivals',
        image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=600&auto=format&fit=crop'
      },
      {
        title: 'SHOP BY COLOR',
        category: 'women',
        image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600&auto=format&fit=crop'
      },
      {
        title: 'SHOP BY ACTIVITY',
        category: 'women',
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600&auto=format&fit=crop'
      }
    ],
    men: [
      {
        title: "MEN'S CLOTHING",
        category: 'men',
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600&auto=format&fit=crop'
      },
      {
        title: 'BEST SELLERS',
        category: 'best-sellers',
        image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600&auto=format&fit=crop'
      },
      {
        title: 'SHORTS & 2-IN-1S',
        category: 'men',
        image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=600&auto=format&fit=crop'
      },
      {
        title: 'HOODIES & SWEATSHIRTS',
        category: 'men',
        image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=600&auto=format&fit=crop'
      },
      {
        title: 'RECOVERY MODE',
        category: 'shoes',
        image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600&auto=format&fit=crop'
      },
      {
        title: 'SHOP BY ACTIVITY',
        category: 'men',
        image: 'https://images.unsplash.com/photo-1534215754734-18e55d13e346?q=80&w=600&auto=format&fit=crop'
      }
    ],
    shoes: [
      {
        title: 'RECOVERY SNEAKERS',
        category: 'shoes',
        image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600&auto=format&fit=crop'
      },
      {
        title: 'SLIDES & SLIP-ONS',
        category: 'shoes',
        image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=600&auto=format&fit=crop'
      },
      {
        title: 'PERFORMANCE SOCKS',
        category: 'accessories',
        image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=600&auto=format&fit=crop'
      }
    ],
    atelier: [
      {
        title: 'HAUTE LUXURY',
        category: 'women',
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop'
      },
      {
        title: 'RUNWAY DROPS',
        category: 'new-arrivals',
        image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&auto=format&fit=crop'
      },
      {
        title: 'SILK & CASHMERE',
        category: 'women',
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600&auto=format&fit=crop'
      }
    ]
  };

  return (
    <>
      {/* 1. Official Alo Burgundy Announcement Bar */}
      <div className="alo-announcement-bar" role="banner">
        <div className="alo-announcement-inner">
          <p className="alo-announcement-text">
            {currency === 'INR'
              ? 'COMPLIMENTARY SHIPPING OVER RS. 10,900'
              : 'COMPLIMENTARY SHIPPING OVER $150'}
          </p>
        </div>
      </div>

      {/* 2. Main Alo Yoga Luxury Header */}
      <header className="alo-site-header" role="banner">
        <div className="alo-header-container">
          {/* Mobile Left Controls (Hamburger + Search) */}
          <div className="alo-mobile-left">
            <button
              type="button"
              id="alo-mobile-menu-btn"
              className="alo-mobile-btn"
              aria-label="Open Navigation Menu"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={22} strokeWidth={1.8} />
            </button>
            <button
              type="button"
              id="alo-mobile-search-btn"
              className="alo-mobile-btn"
              aria-label="Search Alo Yoga"
              onClick={() => setSearchOpen(true)}
            >
              <Search size={21} strokeWidth={1.8} />
            </button>
          </div>

          {/* Left Brand Area: Alo Logo & Desktop Nav Links */}
          <div className="alo-header-left">
            {/* Iconic Alo Logo SVG */}
            <a
              href="/"
              className="alo-brand-logo"
              aria-label="Alo Yoga Home"
              onClick={(e) => {
                e.preventDefault();
                onSelectCategory('all');
              }}
            >
              <svg
                viewBox="0 0 71 48"
                width="64"
                height="42"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M22.826 19.591h5.771v27.43h-5.77v-1.928A13.973 13.973 0 0114.298 48C6.414 48 0 41.409 0 33.306c0-8.103 6.414-14.694 14.299-14.694 3.193 0 6.145 1.082 8.527 2.907zm-.145 13.715c0-4.861-3.76-8.816-8.382-8.816-4.623 0-8.382 3.955-8.382 8.816 0 4.862 3.76 8.816 8.382 8.816s8.382-3.954 8.382-8.816zM39.434 47.02h-5.906V0h5.906zm2.969-13.714c0-8.103 6.414-14.694 14.298-14.694C64.586 18.612 71 25.203 71 33.306 71 41.41 64.586 48 56.701 48s-14.298-6.591-14.298-14.694zm5.916 0c0 4.862 3.76 8.816 8.382 8.816 4.623 0-8.382-3.954 8.382-8.816 0-4.861-3.76-8.816-8.382-8.816s-8.382 3.955-8.382 8.816z" />
              </svg>
            </a>

            {/* Desktop Navigation Links (Left-aligned directly next to logo) */}
            <nav className="alo-desktop-nav" role="navigation" aria-label="Main Navigation">
              <ul className="alo-nav-list">
                <li
                  className={`alo-nav-item ${hoveredNav === 'women' ? 'is-active' : ''}`}
                  onMouseEnter={() => setHoveredNav('women')}
                  onMouseLeave={() => setHoveredNav(null)}
                >
                  <button
                    type="button"
                    id="alo-nav-women"
                    className={`alo-nav-link ${activeCategory === 'women' ? 'active' : ''}`}
                    onClick={() => {
                      onSelectCategory('women');
                      setHoveredNav(null);
                    }}
                  >
                    WOMEN
                  </button>
                  <MegaMenu
                    category="women"
                    isOpen={hoveredNav === 'women'}
                    onSelectCategory={(cat) => {
                      onSelectCategory(cat);
                      setHoveredNav(null);
                    }}
                  />
                </li>

                <li
                  className={`alo-nav-item ${hoveredNav === 'men' ? 'is-active' : ''}`}
                  onMouseEnter={() => setHoveredNav('men')}
                  onMouseLeave={() => setHoveredNav(null)}
                >
                  <button
                    type="button"
                    id="alo-nav-men"
                    className={`alo-nav-link ${activeCategory === 'men' ? 'active' : ''}`}
                    onClick={() => {
                      onSelectCategory('men');
                      setHoveredNav(null);
                    }}
                  >
                    MEN
                  </button>
                  <MegaMenu
                    category="men"
                    isOpen={hoveredNav === 'men'}
                    onSelectCategory={(cat) => {
                      onSelectCategory(cat);
                      setHoveredNav(null);
                    }}
                  />
                </li>

                <li
                  className={`alo-nav-item ${hoveredNav === 'shoes' ? 'is-active' : ''}`}
                  onMouseEnter={() => setHoveredNav('shoes')}
                  onMouseLeave={() => setHoveredNav(null)}
                >
                  <button
                    type="button"
                    id="alo-nav-shoes"
                    className={`alo-nav-link ${activeCategory === 'shoes' ? 'active' : ''}`}
                    onClick={() => {
                      onSelectCategory('shoes');
                      setHoveredNav(null);
                    }}
                  >
                    SHOES
                  </button>
                  <MegaMenu
                    category="shoes"
                    isOpen={hoveredNav === 'shoes'}
                    onSelectCategory={(cat) => {
                      onSelectCategory(cat);
                      setHoveredNav(null);
                    }}
                  />
                </li>

                <li
                  className={`alo-nav-item ${hoveredNav === 'atelier' ? 'is-active' : ''}`}
                  onMouseEnter={() => setHoveredNav('atelier')}
                  onMouseLeave={() => setHoveredNav(null)}
                >
                  <button
                    type="button"
                    id="alo-nav-atelier"
                    className={`alo-nav-link alo-nav-link--atelier ${activeCategory === 'atelier' ? 'active' : ''}`}
                    onClick={() => {
                      onSelectCategory('women');
                      setHoveredNav(null);
                    }}
                  >
                    ATELIER
                    <span className="alo-new-sup">NEW</span>
                  </button>
                  <MegaMenu
                    category="atelier"
                    isOpen={hoveredNav === 'atelier'}
                    onSelectCategory={(cat) => {
                      onSelectCategory(cat);
                      setHoveredNav(null);
                    }}
                  />
                </li>
              </ul>
            </nav>
          </div>

          {/* Right Action Utilities */}
          <div className="alo-header-right">
            {/* Desktop Search Trigger */}
            <button
              type="button"
              id="alo-search-btn"
              className="alo-action-btn alo-search-trigger"
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
            >
              <Search size={20} strokeWidth={1.7} />
            </button>

            {/* SIGN IN TO GET REWARDS (Desktop) */}
            <button
              type="button"
              id="alo-rewards-btn"
              className="alo-rewards-link"
              onClick={onOpenAccountModal}
              title="Alo Access Rewards"
            >
              <User size={18} strokeWidth={1.8} />
              <span>SIGN IN TO GET REWARDS</span>
            </button>

            {/* Mobile Account Icon */}
            <button
              type="button"
              className="alo-action-btn alo-mobile-account-btn"
              aria-label="My Account"
              onClick={onOpenAccountModal}
            >
              <User size={21} strokeWidth={1.7} />
            </button>

            {/* Currency Pill Switcher */}
            <button
              type="button"
              id="alo-currency-btn"
              className="alo-currency-pill"
              onClick={() => onToggleCurrency(currency === 'INR' ? 'USD' : 'INR')}
              title={`Switch currency (Current: ${currency})`}
            >
              <span className="alo-currency-flag">{currency === 'INR' ? '🇮🇳' : '🇺🇸'}</span>
              <span className="alo-currency-code">{currency}</span>
            </button>

            {/* Wishlist Heart Trigger */}
            <button
              type="button"
              id="alo-wishlist-btn"
              className="alo-action-btn alo-wishlist-btn"
              aria-label="Wishlist"
              onClick={onOpenWishlistDrawer}
            >
              <Heart size={21} strokeWidth={1.7} />
              {wishlistCount > 0 && <span className="alo-badge-pill">{wishlistCount}</span>}
            </button>

            {/* Shopping Bag Trigger with Embedded Count (Ditto Alo Yoga) */}
            <button
              type="button"
              id="alo-bag-btn"
              className="alo-action-btn alo-bag-btn"
              aria-label={`Shopping Bag with ${cartCount} items`}
              onClick={onOpenCart}
            >
              <svg
                width="22"
                height="25"
                viewBox="0 0 24 26"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="alo-bag-svg"
                aria-hidden="true"
              >
                {/* Bag body */}
                <path d="M4 7h16l1.5 16H2.5L4 7z" />
                {/* Bag Handle */}
                <path d="M8 7V5a4 4 0 0 1 8 0v2" />
                {/* Centered count number inside bag body */}
                <text
                  x="12"
                  y="18.5"
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="700"
                  fill="currentColor"
                  stroke="none"
                  fontFamily="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif"
                >
                  {cartCount}
                </text>
              </svg>
            </button>
          </div>
        </div>

        {/* 3. Mobile Sub-Banner: GET REWARDS WITH alo access | SIGN IN */}
        <div className="alo-mobile-subbar">
          <div className="alo-mobile-subbar-inner">
            <span className="alo-subbar-rewards">
              GET REWARDS WITH <strong>alo</strong><span style={{ fontWeight: 300 }}>access</span>
            </span>
            <button
              type="button"
              className="alo-subbar-signin"
              onClick={onOpenAccountModal}
            >
              SIGN IN
            </button>
          </div>
        </div>
      </header>

      {/* 4. Full Alo Search Modal / Overlay (Ditto Alo Yoga India Screenshot) */}
      {searchOpen && (
        <div
          className="alo-search-overlay"
          onClick={() => setSearchOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Search Alo Yoga"
        >
          <div className="alo-search-modal" onClick={(e) => e.stopPropagation()}>
            {/* Top Search Bar */}
            <div className="alo-search-bar-wrap">
              <form onSubmit={handleSearchSubmit} className="alo-search-input-form">
                <Search size={22} strokeWidth={1.8} className="alo-search-input-icon" />
                <input
                  ref={searchInputRef}
                  id="alo-search-input"
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="alo-search-text-input"
                  autoComplete="off"
                />
              </form>
              <button
                type="button"
                id="alo-search-close-btn"
                className="alo-search-close-btn"
                aria-label="Close Search"
                onClick={() => setSearchOpen(false)}
              >
                <X size={26} strokeWidth={1.5} />
              </button>
            </div>

            {/* Modal Body: Left Trending Searches & Right Popular Products */}
            <div className="alo-search-body">
              {/* Left Column: TRENDING SEARCHES */}
              <div className="alo-search-trending-col">
                <h3 className="alo-search-section-title">TRENDING SEARCHES</h3>
                <ul className="alo-trending-list">
                  {['socks', 'airlift', 'leggings', 'sweatpants', 'tops', 'recovery sneaker', 'accolade'].map(
                    (term) => (
                      <li key={term}>
                        <button
                          type="button"
                          className="alo-trending-link"
                          onClick={() => handleQuickSearchTerm(term)}
                        >
                          {term}
                        </button>
                      </li>
                    )
                  )}
                </ul>
              </div>

              {/* Right Section: POPULAR PRODUCTS Grid */}
              <div className="alo-search-products-col">
                <h3 className="alo-search-section-title">
                  {searchQuery.trim() ? `SEARCH RESULTS FOR "${searchQuery}"` : 'POPULAR PRODUCTS'}
                </h3>
                {displayProducts.length === 0 ? (
                  <div className="alo-search-empty">
                    <p>No products found for "{searchQuery}". Try searching "Leggings" or "Hoodie".</p>
                  </div>
                ) : (
                  <div className="alo-search-products-grid">
                    {displayProducts.map((item) => (
                      <div
                        key={item.id}
                        className="alo-search-product-card"
                        onClick={() => {
                          onSelectCategory(item.category);
                          setSearchOpen(false);
                        }}
                      >
                        <div className="alo-search-card-img-wrap">
                          <img src={item.image} alt={item.name} loading="lazy" />
                          <button
                            type="button"
                            className="alo-search-card-heart"
                            aria-label="Add to wishlist"
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenWishlistDrawer();
                            }}
                          >
                            <Heart size={16} strokeWidth={1.8} />
                          </button>
                        </div>

                        {/* Color Swatch Dots */}
                        <div className="alo-search-swatches">
                          {(item.swatches || []).map((color, sIdx) => (
                            <span
                              key={sIdx}
                              className="alo-search-swatch-dot"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                          {item.extraSwatches && (
                            <span className="alo-search-swatch-extra">{item.extraSwatches}</span>
                          )}
                        </div>

                        {/* Best Seller Badge */}
                        {item.badge && (
                          <span className="alo-search-best-seller">{item.badge}</span>
                        )}

                        {/* Product Title & Price */}
                        <h4 className="alo-search-card-title">{item.name}</h4>
                        <p className="alo-search-card-color">{item.colorName}</p>
                        <p className="alo-search-card-price">{item.priceFormatted}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Full Mobile Navigation Drawer (Ditto Alo Yoga Mobile Screenshot) */}
      <div
        className={`alo-mobile-drawer-overlay ${mobileMenuOpen ? 'open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div
          className={`alo-mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Header: SIGN IN TO GET REWARDS + Close Button */}
          <div className="alo-drawer-topbar">
            <button
              type="button"
              className="alo-drawer-signin"
              onClick={() => {
                onOpenAccountModal();
                setMobileMenuOpen(false);
              }}
            >
              <User size={18} strokeWidth={1.8} />
              <span>SIGN IN TO GET REWARDS</span>
            </button>
            <button
              type="button"
              id="alo-drawer-close-btn"
              className="alo-drawer-close"
              aria-label="Close navigation"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X size={24} strokeWidth={1.5} />
            </button>
          </div>

          {/* Search Box */}
          <div className="alo-drawer-search-wrap">
            <form
              onSubmit={(e) => {
                handleSearchSubmit(e);
                setMobileMenuOpen(false);
              }}
              className="alo-drawer-search-box"
            >
              <Search size={18} strokeWidth={1.8} className="alo-drawer-search-icon" />
              <input
                id="alo-drawer-search-input"
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          {/* Category Tabs: WOMEN | MEN | SHOES | ATELIER NEW */}
          <div className="alo-drawer-tabs">
            <button
              type="button"
              id="alo-drawer-tab-women"
              className={`alo-drawer-tab ${mobileActiveTab === 'women' ? 'active' : ''}`}
              onClick={() => setMobileActiveTab('women')}
            >
              WOMEN
            </button>
            <button
              type="button"
              id="alo-drawer-tab-men"
              className={`alo-drawer-tab ${mobileActiveTab === 'men' ? 'active' : ''}`}
              onClick={() => setMobileActiveTab('men')}
            >
              MEN
            </button>
            <button
              type="button"
              id="alo-drawer-tab-shoes"
              className={`alo-drawer-tab ${mobileActiveTab === 'shoes' ? 'active' : ''}`}
              onClick={() => setMobileActiveTab('shoes')}
            >
              SHOES
            </button>
            <button
              type="button"
              id="alo-drawer-tab-atelier"
              className={`alo-drawer-tab ${mobileActiveTab === 'atelier' ? 'active' : ''}`}
              onClick={() => setMobileActiveTab('atelier')}
            >
              ATELIER<span className="alo-drawer-new-sup">NEW</span>
            </button>
          </div>

          {/* 2-Column Image Card Grid (Ditto Alo Yoga Mobile Screenshot!) */}
          <div className="alo-drawer-content">
            <div className="alo-drawer-grid">
              {(mobileCardsData[mobileActiveTab] || []).map((card, idx) => (
                <div
                  key={idx}
                  className="alo-drawer-card"
                  onClick={() => {
                    onSelectCategory(card.category);
                    setMobileMenuOpen(false);
                  }}
                >
                  <div className="alo-drawer-card-img-wrap">
                    <img
                      src={card.image}
                      alt={card.title}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src =
                          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop';
                      }}
                    />
                  </div>
                  <span className="alo-drawer-card-title">{card.title}</span>
                </div>
              ))}
            </div>

            {/* Bottom Utilities in Mobile Drawer */}
            <div className="alo-drawer-footer">
              <button
                type="button"
                className="alo-drawer-footer-link"
                onClick={() => {
                  onToggleCurrency(currency === 'INR' ? 'USD' : 'INR');
                }}
              >
                <span>
                  Currency:{' '}
                  <strong>
                    {currency === 'INR' ? '🇮🇳 India (INR ₹)' : '🇺🇸 United States (USD $)'}
                  </strong>
                </span>
              </button>
              <button
                type="button"
                className="alo-drawer-footer-link"
                onClick={() => {
                  onOpenWishlistDrawer();
                  setMobileMenuOpen(false);
                }}
              >
                <span>My Wishlist ({wishlistCount})</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
