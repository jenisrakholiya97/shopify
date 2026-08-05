import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new Database(dbPath);

db.pragma('foreign_keys = ON');

export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      image TEXT
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      category_id TEXT,
      price_usd REAL NOT NULL,
      price_inr REAL NOT NULL,
      original_price_usd REAL,
      original_price_inr REAL,
      fabric TEXT,
      description TEXT,
      is_new BOOLEAN DEFAULT 0,
      is_best_seller BOOLEAN DEFAULT 0,
      rating REAL DEFAULT 5.0,
      reviews_count INTEGER DEFAULT 0,
      image_primary TEXT NOT NULL,
      image_secondary TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    );

    CREATE TABLE IF NOT EXISTS product_variants (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      color_name TEXT NOT NULL,
      color_hex TEXT NOT NULL,
      size TEXT NOT NULL,
      stock_qty INTEGER DEFAULT 25,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS cart (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      variant_id TEXT NOT NULL,
      color_name TEXT,
      size TEXT,
      quantity INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      author TEXT NOT NULL,
      rating INTEGER NOT NULL,
      title TEXT,
      comment TEXT,
      verified BOOLEAN DEFAULT 1,
      date TEXT,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      shipping_address TEXT NOT NULL,
      total_amount REAL NOT NULL,
      currency TEXT DEFAULT 'USD',
      items JSON NOT NULL,
      status TEXT DEFAULT 'Processing',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed Categories
  const countCategories = db.prepare('SELECT COUNT(*) as count FROM categories').get();
  if (countCategories.count === 0) {
    const insertCategory = db.prepare(`
      INSERT INTO categories (id, name, slug, description, image) VALUES (?, ?, ?, ?, ?)
    `);

    insertCategory.run('women', 'Women', 'women', 'Sculpting studio activewear, Airlift leggings & sports bras for women.', 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=1200&auto=format&fit=crop');
    insertCategory.run('men', 'Men', 'men', 'High-performance men shorts, tees, hoodies & street gear.', 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop');
    insertCategory.run('accessories', 'Accessories', 'accessories', 'Pro yoga mats, caps, socks & studio lifestyle gear.', 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=1200&auto=format&fit=crop');
    insertCategory.run('shoes', 'Footwear', 'shoes', 'Luxury recovery slides & studio sneakers.', 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1200&auto=format&fit=crop');
    insertCategory.run('new-arrivals', 'New Arrivals', 'new-arrivals', 'Explore weekly fresh drops and limited edition colorways.', 'https://images.unsplash.com/photo-1506152983158-b4a74a01c721?q=80&w=1200&auto=format&fit=crop');
    insertCategory.run('best-sellers', 'Best Sellers', 'best-sellers', 'Top-rated iconic Alo styles loved around the globe.', 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=1200&auto=format&fit=crop');
  }

  // Seed Products
  const countProducts = db.prepare('SELECT COUNT(*) as count FROM products').get();
  if (countProducts.count === 0) {
    const insertProduct = db.prepare(`
      INSERT INTO products (
        id, name, slug, category_id, price_usd, price_inr, original_price_usd, original_price_inr,
        fabric, description, is_new, is_best_seller, rating, reviews_count, image_primary, image_secondary
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertVariant = db.prepare(`
      INSERT INTO product_variants (id, product_id, color_name, color_hex, size, stock_qty)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const insertReview = db.prepare(`
      INSERT INTO reviews (id, product_id, author, rating, title, comment, verified, date)
      VALUES (?, ?, ?, ?, ?, ?, 1, ?)
    `);

    const items = [
      {
        id: 'alo-1',
        name: '7/8 High-Waist Airlift Legging',
        slug: '7-8-high-waist-airlift-legging',
        category_id: 'women',
        price_usd: 128.00,
        price_inr: 10800.00,
        original_price_usd: null,
        original_price_inr: null,
        fabric: 'Airlift Double-Knit Compression',
        description: 'Sleek, sculpting sheen finish. Designed to smooth, lift, and sculpt for studio performance and streetwear elegance.',
        is_new: 1,
        is_best_seller: 1,
        rating: 4.9,
        reviews_count: 428,
        image_primary: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=1000&auto=format&fit=crop',
        image_secondary: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=1000&auto=format&fit=crop',
        colors: [
          { name: 'Black', hex: '#000000' },
          { name: 'Bone', hex: '#EAE6DF' },
          { name: 'Espresso', hex: '#3B2F2F' },
          { name: 'Macaron Pink', hex: '#F4C2C2' }
        ],
        sizes: ['XXS', 'XS', 'S', 'M', 'L', 'XL']
      },
      {
        id: 'alo-2',
        name: 'Accolade Sweatshirt Hoodie',
        slug: 'accolade-sweatshirt-hoodie',
        category_id: 'women',
        price_usd: 138.00,
        price_inr: 11500.00,
        original_price_usd: 158.00,
        original_price_inr: 13200.00,
        fabric: 'Heavyweight French Terry Fleece',
        description: 'The iconic luxury hoodie. Features a relaxed unisex fit, chrome Alo logo emblem, and plush brushed interior.',
        is_new: 1,
        is_best_seller: 1,
        rating: 4.8,
        reviews_count: 312,
        image_primary: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000&auto=format&fit=crop',
        image_secondary: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop',
        colors: [
          { name: 'Ivory', hex: '#F9F8F6' },
          { name: 'Black', hex: '#000000' },
          { name: 'Athletic Grey', hex: '#9E9E9E' }
        ],
        sizes: ['XS', 'S', 'M', 'L', 'XL']
      },
      {
        id: 'alo-3',
        name: 'Alosoft Lounge Legging',
        slug: 'alosoft-lounge-legging',
        category_id: 'women',
        price_usd: 118.00,
        price_inr: 9800.00,
        original_price_usd: null,
        original_price_inr: null,
        fabric: 'Alosoft Velvety Ultra-Soft Knit',
        description: 'Peach-fuzz soft touch with breathable 4-way stretch. Perfect for studio practice and cozy lounge days.',
        is_new: 0,
        is_best_seller: 1,
        rating: 4.9,
        reviews_count: 245,
        image_primary: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1000&auto=format&fit=crop',
        image_secondary: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1000&auto=format&fit=crop',
        colors: [
          { name: 'Heather Grey', hex: '#888888' },
          { name: 'Jet Black', hex: '#000000' },
          { name: 'Soft Lavender', hex: '#E6E6FA' }
        ],
        sizes: ['XXS', 'XS', 'S', 'M', 'L']
      },
      {
        id: 'alo-4',
        name: 'Off-Duty Cap',
        slug: 'off-duty-cap',
        category_id: 'accessories',
        price_usd: 48.00,
        price_inr: 4000.00,
        original_price_usd: null,
        original_price_inr: null,
        fabric: '100% Washed Cotton Canvas',
        description: 'Essential streetwear dad cap featuring front embroidered Alo logo, unstructured crown, and custom metal clasp.',
        is_new: 0,
        is_best_seller: 1,
        rating: 4.9,
        reviews_count: 610,
        image_primary: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=1000&auto=format&fit=crop',
        image_secondary: 'https://images.unsplash.com/photo-1534215754734-18e55d13e346?q=80&w=1000&auto=format&fit=crop',
        colors: [
          { name: 'Black', hex: '#000000' },
          { name: 'Chalk White', hex: '#F0EFEA' },
          { name: 'Blush Pink', hex: '#FFD1DC' }
        ],
        sizes: ['One Size']
      },
      {
        id: 'alo-5',
        name: 'Warrior Pro Mat 5mm',
        slug: 'warrior-pro-mat-5mm',
        category_id: 'accessories',
        price_usd: 128.00,
        price_inr: 10800.00,
        original_price_usd: null,
        original_price_inr: null,
        fabric: 'Non-slip Eco Rubber & Polyurethane',
        description: 'Pro-grade dry-grip cushion yoga mat. Odorless, non-toxic, and oversized for full studio coverage.',
        is_new: 1,
        is_best_seller: 1,
        rating: 5.0,
        reviews_count: 780,
        image_primary: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?q=80&w=1000&auto=format&fit=crop',
        image_secondary: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=1000&auto=format&fit=crop',
        colors: [
          { name: 'Jet Black', hex: '#000000' },
          { name: 'Sage Green', hex: '#9CAF88' },
          { name: 'Clay Pink', hex: '#CC887A' }
        ],
        sizes: ['One Size']
      },
      {
        id: 'alo-6',
        name: 'Renown Heavyweight Sweatpant',
        slug: 'renown-heavyweight-sweatpant',
        category_id: 'men',
        price_usd: 148.00,
        price_inr: 12400.00,
        original_price_usd: null,
        original_price_inr: null,
        fabric: '450gsm Dense Fleece',
        description: 'Ultra-luxurious men sweatpant featuring deep zip pockets, embroidered micro-logo, and cinched cuffs.',
        is_new: 1,
        is_best_seller: 0,
        rating: 4.8,
        reviews_count: 156,
        image_primary: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1000&auto=format&fit=crop',
        image_secondary: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=1000&auto=format&fit=crop',
        colors: [
          { name: 'Athletic Grey', hex: '#808080' },
          { name: 'Jet Black', hex: '#000000' },
          { name: 'Oatmeal', hex: '#E3DAC9' }
        ],
        sizes: ['S', 'M', 'L', 'XL', 'XXL']
      },
      {
        id: 'alo-7',
        name: 'Vapor High-Waist Short 5"',
        slug: 'vapor-high-waist-short-5',
        category_id: 'women',
        price_usd: 68.00,
        price_inr: 5600.00,
        original_price_usd: 78.00,
        original_price_inr: 6500.00,
        fabric: 'Ultralight Vapor Performance Knit',
        description: 'Feather-light stretch shorts with sleek compression waist and second-skin feel.',
        is_new: 0,
        is_best_seller: 1,
        rating: 4.7,
        reviews_count: 210,
        image_primary: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=1000&auto=format&fit=crop',
        image_secondary: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=1000&auto=format&fit=crop',
        colors: [
          { name: 'Black', hex: '#000000' },
          { name: 'White', hex: '#FFFFFF' }
        ],
        sizes: ['XXS', 'XS', 'S', 'M', 'L']
      },
      {
        id: 'alo-8',
        name: 'Recovery Slide',
        slug: 'recovery-slide',
        category_id: 'shoes',
        price_usd: 98.00,
        price_inr: 8200.00,
        original_price_usd: null,
        original_price_inr: null,
        fabric: 'Ergonomic Cushioned EVA Foam',
        description: 'Post-workout cushioned slide with cloud-like arch support and bold embossed Alo branding.',
        is_new: 1,
        is_best_seller: 1,
        rating: 4.9,
        reviews_count: 184,
        image_primary: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000&auto=format&fit=crop',
        image_secondary: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=1000&auto=format&fit=crop',
        colors: [
          { name: 'Bone', hex: '#EAE6DF' },
          { name: 'Black', hex: '#000000' }
        ],
        sizes: ['US 6', 'US 7', 'US 8', 'US 9', 'US 10', 'US 11']
      }
    ];

    for (const p of items) {
      insertProduct.run(
        p.id, p.name, p.slug, p.category_id, p.price_usd, p.price_inr,
        p.original_price_usd, p.original_price_inr, p.fabric, p.description,
        p.is_new, p.is_best_seller, p.rating, p.reviews_count,
        p.image_primary, p.image_secondary
      );

      let vIdx = 1;
      for (const col of p.colors) {
        for (const sz of p.sizes) {
          insertVariant.run(`${p.id}-v${vIdx++}`, p.id, col.name, col.hex, sz, 25);
        }
      }

      insertReview.run(`r-${p.id}-1`, p.id, 'Ananya S.', 5, 'Exceptional Quality!', 'The Airlift fabric fit is unbelievable. Perfectly holds shape during hot yoga.', '2026-07-18');
      insertReview.run(`r-${p.id}-2`, p.id, 'Dev K.', 5, 'Luxury Comfort', 'Super fast delivery to Mumbai. Feels premium and looks stunning.', '2026-07-22');
    }
  }
}

export default db;
