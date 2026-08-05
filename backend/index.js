import express from 'express';
import cors from 'cors';
import db, { initDb } from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize SQLite Database
initDb();

// Free Shipping Thresholds
const FREE_SHIPPING_USD = 100.00;
const FREE_SHIPPING_INR = 8500.00;

// GET /api/categories
app.get('/api/categories', (req, res) => {
  try {
    const categories = db.prepare('SELECT * FROM categories').all();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/products
app.get('/api/products', (req, res) => {
  try {
    const { category, search, sort, is_new, is_best_seller, currency = 'USD' } = req.query;

    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (category && category !== 'all') {
      query += ' AND category_id = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ? OR fabric LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    if (is_new === 'true') {
      query += ' AND is_new = 1';
    }

    if (is_best_seller === 'true') {
      query += ' AND is_best_seller = 1';
    }

    const priceCol = currency === 'INR' ? 'price_inr' : 'price_usd';

    if (sort === 'price-asc') {
      query += ` ORDER BY ${priceCol} ASC`;
    } else if (sort === 'price-desc') {
      query += ` ORDER BY ${priceCol} DESC`;
    } else if (sort === 'rating') {
      query += ' ORDER BY rating DESC';
    } else {
      query += ' ORDER BY created_at DESC';
    }

    const products = db.prepare(query).all(...params);

    const getColors = db.prepare('SELECT DISTINCT color_name, color_hex FROM product_variants WHERE product_id = ?');
    const enriched = products.map(p => ({
      ...p,
      colors: getColors.all(p.id)
    }));

    res.json(enriched);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/products/:id
app.get('/api/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    const product = db.prepare('SELECT * FROM products WHERE id = ? OR slug = ?').get(id, id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const variants = db.prepare('SELECT * FROM product_variants WHERE product_id = ?').all(product.id);
    const reviews = db.prepare('SELECT * FROM reviews WHERE product_id = ? ORDER BY date DESC').all(product.id);
    const related = db.prepare('SELECT * FROM products WHERE category_id = ? AND id != ? LIMIT 4').all(product.category_id, product.id);

    res.json({ ...product, variants, reviews, related });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/cart
app.get('/api/cart', (req, res) => {
  try {
    const currency = req.query.currency || 'USD';
    const cartItems = db.prepare(`
      SELECT 
        c.id as cart_id,
        c.quantity,
        c.color_name,
        c.size,
        p.id as product_id,
        p.name,
        p.price_usd,
        p.price_inr,
        p.image_primary,
        p.fabric
      FROM cart c
      JOIN products p ON c.product_id = p.id
      ORDER BY c.created_at DESC
    `).all();

    const isINR = currency === 'INR';
    const subtotal = cartItems.reduce((acc, item) => {
      const p = isINR ? item.price_inr : item.price_usd;
      return acc + (p * item.quantity);
    }, 0);

    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const threshold = isINR ? FREE_SHIPPING_INR : FREE_SHIPPING_USD;
    const freeShippingRemaining = Math.max(0, threshold - subtotal);
    const hasFreeShipping = subtotal >= threshold;

    res.json({
      items: cartItems.map(i => ({
        ...i,
        price: isINR ? i.price_inr : i.price_usd
      })),
      subtotal,
      totalItems,
      freeShippingThreshold: threshold,
      freeShippingRemaining,
      hasFreeShipping,
      currency
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/cart/add
app.post('/api/cart/add', (req, res) => {
  try {
    const { productId, variantId, colorName, size, quantity = 1 } = req.body;

    const existing = db.prepare(`
      SELECT * FROM cart 
      WHERE product_id = ? AND color_name = ? AND size = ?
    `).get(productId, colorName, size);

    if (existing) {
      db.prepare('UPDATE cart SET quantity = quantity + ? WHERE id = ?').run(quantity, existing.id);
    } else {
      const cartId = `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
      db.prepare(`
        INSERT INTO cart (id, product_id, variant_id, color_name, size, quantity)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(cartId, productId, variantId || `${productId}-var`, colorName, size, quantity);
    }

    res.json({ success: true, message: 'Item added to bag' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/cart/update
app.put('/api/cart/update', (req, res) => {
  try {
    const { cartId, quantity } = req.body;

    if (quantity <= 0) {
      db.prepare('DELETE FROM cart WHERE id = ?').run(cartId);
    } else {
      db.prepare('UPDATE cart SET quantity = ? WHERE id = ?').run(quantity, cartId);
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/cart/clear
app.delete('/api/cart/clear', (req, res) => {
  try {
    db.prepare('DELETE FROM cart').run();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/checkout
app.post('/api/checkout', (req, res) => {
  try {
    const { customerName, customerEmail, shippingAddress, items, totalAmount, currency = 'USD' } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Shopping bag is empty' });
    }

    const orderId = `ALO-${Math.floor(100000 + Math.random() * 900000)}`;

    db.prepare(`
      INSERT INTO orders (id, customer_name, customer_email, shipping_address, total_amount, currency, items)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(orderId, customerName, customerEmail, shippingAddress, totalAmount, currency, JSON.stringify(items));

    db.prepare('DELETE FROM cart').run();

    res.json({
      success: true,
      orderId,
      message: 'Order confirmed successfully! Thank you for shopping with Alo Yoga.'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/reviews
app.post('/api/reviews', (req, res) => {
  try {
    const { productId, author, rating, title, comment } = req.body;
    const reviewId = `rev-${Date.now()}`;
    const date = new Date().toISOString().split('T')[0];

    db.prepare(`
      INSERT INTO reviews (id, product_id, author, rating, title, comment, verified, date)
      VALUES (?, ?, ?, ?, ?, ?, 1, ?)
    `).run(reviewId, productId, author, rating, title, comment, date);

    const stats = db.prepare('SELECT AVG(rating) as avg_rating, COUNT(*) as cnt FROM reviews WHERE product_id = ?').get(productId);
    db.prepare('UPDATE products SET rating = ?, reviews_count = ? WHERE id = ?').run(
      Math.round(stats.avg_rating * 10) / 10,
      stats.cnt,
      productId
    );

    res.json({ success: true, message: 'Review submitted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/coupon/apply
app.post('/api/coupon/apply', (req, res) => {
  try {
    const { code } = req.body;
    const cleanCode = (code || '').trim().toUpperCase();

    if (cleanCode === 'ALO10' || cleanCode === 'WELCOME10') {
      return res.json({ success: true, discountPercent: 10, code: cleanCode, message: '10% Alo Fam discount applied!' });
    } else if (cleanCode === 'ALO15' || cleanCode === 'VIP15') {
      return res.json({ success: true, discountPercent: 15, code: cleanCode, message: '15% VIP discount applied!' });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid promo code. Try "ALO10" or "WELCOME10"' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/cart/upsells
app.get('/api/cart/upsells', (req, res) => {
  try {
    const currency = req.query.currency || 'USD';
    const upsells = db.prepare(`
      SELECT * FROM products WHERE category_id = 'accessories' OR category_id = 'shoes' LIMIT 3
    `).all();

    const isINR = currency === 'INR';
    res.json(upsells.map(u => ({
      ...u,
      price: isINR ? u.price_inr : u.price_usd
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const server = app.listen(PORT, () => {
  console.log(`✨ Alo Yoga Express Server listening on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use by another process.`);
    console.error(`💡 Run: lsof -ti:${PORT} | xargs kill -9 to free port ${PORT}.`);
    process.exit(1);
  } else {
    console.error(err);
  }
});
