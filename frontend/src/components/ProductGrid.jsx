import React from 'react';
import ProductCard from './ProductCard';

export default function ProductGrid({
  products,
  categories,
  activeCategory,
  onSelectCategory,
  sortOption,
  onSortChange,
  onQuickView,
  onAddToCart,
  onSelectProduct,
  onToggleWishlist,
  wishlistIds,
  loading,
  currency
}) {
  return (
    <section id="catalog" className="section-padding">
      <div className="section-header">
        <p className="section-tag">CURATED APPAREL</p>
        <h2 className="section-title">THE ALO COLLECTION</h2>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="filter-bar">
        <div className="filter-group">
          <button
            className={`filter-btn ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => onSelectCategory('all')}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`filter-btn ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#666' }}>SORT BY:</label>
          <select
            className="sort-select"
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="newest">Featured / Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Loading Skeleton or Empty State */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', fontSize: '1rem', color: '#666' }}>
          Loading Alo collection...
        </div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <h3 style={{ marginBottom: '12px' }}>No products found</h3>
          <p style={{ color: '#666', marginBottom: '20px' }}>Try clearing your search query or filters.</p>
          <button className="btn-primary" onClick={() => onSelectCategory('all')}>
            VIEW ALL PRODUCTS
          </button>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
              onAddToCart={onAddToCart}
              onSelectProduct={onSelectProduct}
              onToggleWishlist={onToggleWishlist}
              isWishlisted={wishlistIds.includes(product.id)}
              currency={currency}
            />
          ))}
        </div>
      )}
    </section>
  );
}
