/**
 * Alo Yoga Shopify Theme - Production Client-Side Logic
 * Luxury athleisure store functionality with India INR support
 */

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------
  // STATE MANAGEMENT (Cart, Currency, Wishlist)
  // -------------------------------------------------------------
  const FREE_SHIPPING_THRESHOLD = 15000; // INR ₹15,000 threshold for India
  
  let cart = JSON.parse(localStorage.getItem('alo_cart') || '[]');
  let wishlist = JSON.parse(localStorage.getItem('alo_wishlist') || '[]');
  let currentCurrency = localStorage.getItem('alo_currency') || 'INR';

  // Seed default cart item if first time user
  if (cart.length === 0) {
    cart = [
      {
        id: 'alo-1',
        title: 'Seamless High-Waist Two Tone Rib Legging',
        color: 'Java Brown',
        size: 'S',
        price: 18600,
        quantity: 1,
        image: 'https://cdn.shopify.com/s/files/1/2185/2813/files/W54268R_08194_b2_s1_a1_dFA26_m264_1.jpg?v=1791353818'
      }
    ];
    localStorage.setItem('alo_cart', JSON.stringify(cart));
  }

  // -------------------------------------------------------------
  // UTILITIES
  // -------------------------------------------------------------
  const formatCurrency = (amount) => {
    return '₹' + amount.toLocaleString('en-IN');
  };

  const showToast = (message) => {
    const toast = document.getElementById('alo-toast');
    const msgEl = document.getElementById('toast-message');
    if (!toast || !msgEl) return;
    msgEl.textContent = message;
    toast.hidden = false;
    setTimeout(() => {
      toast.hidden = true;
    }, 3200);
  };

  // -------------------------------------------------------------
  // SCROLL LOCKING UTILITY FOR ALL MODALS & DRAWERS
  // -------------------------------------------------------------
  const lockScroll = () => {
    document.body.classList.add('modal-open');
    document.documentElement.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  };

  const unlockScroll = () => {
    setTimeout(() => {
      const anyModalOpen = document.querySelector(
        '.cart-drawer.open, .quick-view-modal.open, .size-guide-modal.open, .search-modal.open, .mobile-nav-drawer.open'
      );
      if (!anyModalOpen) {
        document.body.classList.remove('modal-open');
        document.documentElement.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      }
    }, 50);
  };

  // -------------------------------------------------------------
  // ANNOUNCEMENT BAR ROTATION
  // -------------------------------------------------------------
  const slides = document.querySelectorAll('.announcement-slide');
  if (slides.length > 1) {
    let currentSlide = 0;
    setInterval(() => {
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('active');
    }, 4000);
  }

  // -------------------------------------------------------------
  // STICKY HEADER SCROLL SHADOW
  // -------------------------------------------------------------
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header?.classList.add('header--scrolled');
    } else {
      header?.classList.remove('header--scrolled');
    }
  }, { passive: true });

  // -------------------------------------------------------------
  // COUNTRY / CURRENCY SELECTOR
  // -------------------------------------------------------------
  const countryTrigger = document.querySelector('[data-country-picker-trigger]');
  const countryDropdown = document.getElementById('currency-dropdown');
  const countryClose = document.querySelector('[data-close-dropdown]');

  if (countryTrigger && countryDropdown) {
    countryTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      countryDropdown.hidden = !countryDropdown.hidden;
    });

    countryClose?.addEventListener('click', () => {
      countryDropdown.hidden = true;
    });

    document.addEventListener('click', (e) => {
      if (!countryDropdown.contains(e.target) && !countryTrigger.contains(e.target)) {
        countryDropdown.hidden = true;
      }
    });

    const countryItems = countryDropdown.querySelectorAll('.localization-item');
    countryItems.forEach(item => {
      item.addEventListener('click', () => {
        countryItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        const curr = item.getAttribute('data-currency');
        const flag = item.getAttribute('data-flag');
        const name = item.getAttribute('data-country');
        const textSpan = countryTrigger.querySelector('.localization-text');
        const flagSpan = countryTrigger.querySelector('.flag-icon');
        if (textSpan) textSpan.textContent = `${name} (${curr})`;
        if (flagSpan) flagSpan.textContent = flag;
        countryDropdown.hidden = true;
        showToast(`Store currency updated to ${curr}`);
      });
    });
  }

  // -------------------------------------------------------------
  // CART DRAWER LOGIC
  // -------------------------------------------------------------
  const cartDrawer = document.getElementById('cart-drawer');
  const cartOverlay = document.getElementById('cart-drawer-overlay');
  const openCartBtns = document.querySelectorAll('[data-open-cart]');
  const closeCartBtns = document.querySelectorAll('[data-close-cart]');
  const cartItemsContainer = document.querySelector('[data-cart-items-container]');
  const cartEmptyState = document.querySelector('[data-cart-empty]');
  const cartSubtotalEls = document.querySelectorAll('[data-cart-subtotal]');
  const cartSubtotalBtnEl = document.querySelector('[data-cart-subtotal-btn]');
  const cartCountEls = document.querySelectorAll('[data-cart-count]');
  const shippingMsgEl = document.querySelector('[data-shipping-message]');
  const shippingProgressFill = document.querySelector('[data-shipping-progress]');

  const openCart = () => {
    renderCart();
    cartDrawer?.classList.add('open');
    cartOverlay?.classList.add('open');
    lockScroll();
  };

  const closeCart = () => {
    cartDrawer?.classList.remove('open');
    cartOverlay?.classList.remove('open');
    unlockScroll();
  };

  openCartBtns.forEach(btn => btn.addEventListener('click', openCart));
  closeCartBtns.forEach(btn => btn.addEventListener('click', closeCart));
  cartOverlay?.addEventListener('click', closeCart);

  const renderCart = () => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Update count badges
    cartCountEls.forEach(el => {
      el.textContent = `(${totalItems})`;
    });

    // Update Subtotals
    const formattedSubtotal = formatCurrency(subtotal);
    cartSubtotalEls.forEach(el => {
      el.textContent = formattedSubtotal;
    });
    if (cartSubtotalBtnEl) cartSubtotalBtnEl.textContent = formattedSubtotal;

    // Update Shipping Progress
    if (shippingProgressFill && shippingMsgEl) {
      const percentage = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
      shippingProgressFill.style.width = `${percentage}%`;

      if (subtotal >= FREE_SHIPPING_THRESHOLD) {
        shippingMsgEl.innerHTML = `🎉 <span class="bold">YOU UNLOCKED FREE EXPRESS SHIPPING!</span>`;
      } else {
        const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
        shippingMsgEl.innerHTML = `Add <span class="highlight">${formatCurrency(remaining)}</span> more for <span class="bold">FREE EXPRESS SHIPPING</span>`;
      }
    }

    // Toggle Empty / Items view
    if (cart.length === 0) {
      if (cartEmptyState) cartEmptyState.style.display = 'block';
      if (cartItemsContainer) cartItemsContainer.innerHTML = '';
      return;
    }

    if (cartEmptyState) cartEmptyState.style.display = 'none';

    // Populate Line Items
    if (cartItemsContainer) {
      cartItemsContainer.innerHTML = cart.map((item, index) => `
        <div class="cart-item" data-index="${index}">
          <img src="${item.image}" alt="${item.title}" class="cart-item-img" width="80" height="106">
          <div class="cart-item-details">
            <h4>${item.title}</h4>
            <div class="cart-item-meta">Color: ${item.color} | Size: ${item.size}</div>
            <div class="cart-item-price">${formatCurrency(item.price)}</div>
            <div class="cart-item-qty">
              <button type="button" class="qty-btn" data-qty-change="-1" data-index="${index}">-</button>
              <span class="qty-val">${item.quantity}</span>
              <button type="button" class="qty-btn" data-qty-change="1" data-index="${index}">+</button>
            </div>
          </div>
          <button type="button" class="btn-remove-item" data-remove-index="${index}" aria-label="Remove Item">Remove</button>
        </div>
      `).join('');

      // Wire quantity listeners
      cartItemsContainer.querySelectorAll('[data-qty-change]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const idx = parseInt(btn.getAttribute('data-index'));
          const delta = parseInt(btn.getAttribute('data-qty-change'));
          cart[idx].quantity += delta;
          if (cart[idx].quantity <= 0) {
            cart.splice(idx, 1);
          }
          localStorage.setItem('alo_cart', JSON.stringify(cart));
          renderCart();
        });
      });

      // Wire remove listeners
      cartItemsContainer.querySelectorAll('[data-remove-index]').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.getAttribute('data-remove-index'));
          cart.splice(idx, 1);
          localStorage.setItem('alo_cart', JSON.stringify(cart));
          renderCart();
          showToast('Item removed from bag');
        });
      });
    }
  };

  // Cross-sell items
  document.querySelectorAll('[data-add-cross-sell]').forEach(btn => {
    btn.addEventListener('click', () => {
      const handle = btn.getAttribute('data-add-cross-sell');
      if (handle === 'off-duty-cap') {
        cart.push({
          id: 'alo-cap',
          title: 'Alo Off-Duty Cap',
          color: 'Black',
          size: 'OS',
          price: 4200,
          quantity: 1,
          image: 'https://cdn.shopify.com/s/files/1/2185/2813/files/W54268R_08194_b2_s1_a1_dFA26_m264_1.jpg?v=1791353818'
        });
      } else {
        cart.push({
          id: 'alo-mat',
          title: 'Warrior Yoga Mat',
          color: 'Black',
          size: 'Standard',
          price: 12400,
          quantity: 1,
          image: 'https://cdn.shopify.com/s/files/1/2185/2813/files/W6525R_04893_b2_s1_a1_dSP26_m125.jpg?v=1775845334'
        });
      }
      localStorage.setItem('alo_cart', JSON.stringify(cart));
      renderCart();
      showToast('Added accessory to bag');
    });
  });

  // Initial cart count render
  renderCart();

  // -------------------------------------------------------------
  // QUICK ADD OVERLAY & BUTTONS
  // -------------------------------------------------------------
  document.addEventListener('click', (e) => {
    const quickAddBtn = e.target.closest('[data-quick-add-trigger]');
    if (quickAddBtn) {
      const card = quickAddBtn.closest('.alo-product-card');
      const sizeSelector = card ? card.querySelector('.quick-size-selector') : null;
      if (sizeSelector) {
        sizeSelector.hidden = !sizeSelector.hidden;
      } else {
        // Direct add or open PDP
        openCart();
      }
    }

    // Size pill clicked inside quick add
    const sizePill = e.target.closest('.size-pill');
    if (sizePill) {
      const card = sizePill.closest('.alo-product-card');
      const title = card?.querySelector('.product-card-title a')?.textContent || 'Airlift Studio Legging';
      const priceText = card?.querySelector('.price-item--regular')?.textContent || '₹18,600';
      const cleanPrice = parseInt(priceText.replace(/[^0-9]/g, '')) || 18600;
      const img = card?.querySelector('.primary-image')?.src || '';
      const size = sizePill.getAttribute('data-variant-size') || 'S';

      cart.push({
        id: 'alo-' + Date.now(),
        title: title,
        color: 'Black',
        size: size,
        price: cleanPrice,
        quantity: 1,
        image: img
      });
      localStorage.setItem('alo_cart', JSON.stringify(cart));
      openCart();
      showToast(`Added ${title} (${size}) to bag!`);
    }
  });

  // -------------------------------------------------------------
  // WISHLIST HEART TOGGLE
  // -------------------------------------------------------------
  const wishlistCountEl = document.querySelector('[data-wishlist-count]');
  const updateWishlistUI = () => {
    if (wishlistCountEl) wishlistCountEl.textContent = wishlist.length;
    document.querySelectorAll('[data-wishlist-id]').forEach(btn => {
      const id = btn.getAttribute('data-wishlist-id');
      if (wishlist.includes(id)) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  };

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-wishlist-id]');
    if (btn) {
      const id = btn.getAttribute('data-wishlist-id');
      const idx = wishlist.indexOf(id);
      if (idx > -1) {
        wishlist.splice(idx, 1);
        showToast('Removed from wishlist');
      } else {
        wishlist.push(id);
        showToast('Saved to your wishlist ❤️');
      }
      localStorage.setItem('alo_wishlist', JSON.stringify(wishlist));
      updateWishlistUI();
    }
  });
  updateWishlistUI();

  // -------------------------------------------------------------
  // SIZE GUIDE MODAL
  // -------------------------------------------------------------
  const sizeGuideModal = document.getElementById('size-guide-modal');
  const sizeGuideOverlay = document.getElementById('size-guide-overlay');
  const openSizeGuideBtns = document.querySelectorAll('[data-open-size-guide]');
  const closeSizeGuideBtns = document.querySelectorAll('[data-close-size-guide]');

  const openSizeGuide = () => {
    sizeGuideModal?.classList.add('open');
    sizeGuideOverlay?.classList.add('open');
    lockScroll();
  };

  const closeSizeGuide = () => {
    sizeGuideModal?.classList.remove('open');
    sizeGuideOverlay?.classList.remove('open');
    unlockScroll();
  };

  openSizeGuideBtns.forEach(btn => btn.addEventListener('click', openSizeGuide));
  closeSizeGuideBtns.forEach(btn => btn.addEventListener('click', closeSizeGuide));
  sizeGuideOverlay?.addEventListener('click', closeSizeGuide);

  // Size Guide Units Toggle (Inches vs CM)
  const unitBtns = document.querySelectorAll('.unit-btn');
  const unitCells = document.querySelectorAll('.unit-val');

  unitBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      unitBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const unit = btn.getAttribute('data-unit');
      unitCells.forEach(cell => {
        cell.textContent = cell.getAttribute(`data-${unit}`);
      });
    });
  });

  // -------------------------------------------------------------
  // PREDICTIVE SEARCH MODAL
  // -------------------------------------------------------------
  const searchModal = document.getElementById('search-modal');
  const searchOverlay = document.getElementById('search-modal-overlay');
  const openSearchBtns = document.querySelectorAll('[data-open-search]');
  const closeSearchBtns = document.querySelectorAll('[data-close-search]');
  const searchInput = document.getElementById('predictive-search-input');

  const openSearch = () => {
    searchModal?.classList.add('open');
    searchOverlay?.classList.add('open');
    lockScroll();
    setTimeout(() => searchInput?.focus(), 200);
  };

  const closeSearch = () => {
    searchModal?.classList.remove('open');
    searchOverlay?.classList.remove('open');
    unlockScroll();
  };

  openSearchBtns.forEach(btn => btn.addEventListener('click', openSearch));
  closeSearchBtns.forEach(btn => btn.addEventListener('click', closeSearch));
  searchOverlay?.addEventListener('click', closeSearch);

  // Search pills click
  document.querySelectorAll('.search-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = pill.getAttribute('data-search-term');
        searchInput.focus();
      }
    });
  });

  // -------------------------------------------------------------
  // COLLECTION FILTER TABS (All, Leggings, Tops, Outerwear, Men)
  // -------------------------------------------------------------
  const filterTabs = document.querySelectorAll('.filter-tab-btn');
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const category = tab.getAttribute('data-filter');
      const cards = document.querySelectorAll('#featured-products-grid .alo-product-card');

      cards.forEach(card => {
        const itemCat = card.getAttribute('data-category');
        if (category === 'all' || itemCat === category) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // -------------------------------------------------------------
  // MOBILE NAVIGATION DRAWER
  // -------------------------------------------------------------
  const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
  const mobileNavBackdrop = document.querySelector('.mobile-nav-backdrop');
  const openMobileNavBtn = document.querySelector('[data-open-mobile-nav]');
  const closeMobileNavBtns = document.querySelectorAll('[data-close-mobile-nav]');

  const openMobileNav = () => {
    mobileNavDrawer?.classList.add('open');
    mobileNavBackdrop?.classList.add('open');
    lockScroll();
  };

  const closeMobileNav = () => {
    mobileNavDrawer?.classList.remove('open');
    mobileNavBackdrop?.classList.remove('open');
    unlockScroll();
  };

  openMobileNavBtn?.addEventListener('click', openMobileNav);
  closeMobileNavBtns.forEach(btn => btn.addEventListener('click', closeMobileNav));
  mobileNavBackdrop?.addEventListener('click', closeMobileNav);

  // Mobile Tabs (Women / Men)
  const mobileTabs = document.querySelectorAll('.mobile-tab-btn');
  mobileTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      mobileTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.getAttribute('data-mobile-tab');
      document.querySelectorAll('.mobile-tab-content').forEach(content => {
        content.classList.remove('active');
      });
      document.getElementById(`mobile-tab-${target}`)?.classList.add('active');
    });
  });

  // -------------------------------------------------------------
  // CHECKOUT BUTTON
  // -------------------------------------------------------------
  const checkoutBtn = document.getElementById('btn-cart-checkout');
  checkoutBtn?.addEventListener('click', () => {
    showToast('Redirecting to secure India checkout...');
    setTimeout(() => {
      window.location.href = '/checkout';
    }, 800);
  });
});
