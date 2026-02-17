const express = require('express');
const router = express.Router();
const productsPool = require('../config/productsDb');
const authPool = require('../config/db');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const uploadDir = path.join(__dirname, '..', 'uploads', 'product_images');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  }
});

const upload = multer({ storage });

const toSlug = (value) =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const parseMaybeJsonArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }
  return [];
};

const ALLOWED_PRODUCT_STATUSES = new Set(['draft', 'pending', 'active', 'inactive', 'out_of_stock']);

const normalizeProductStatus = (value) => {
  const normalized = String(value || '').trim().toLowerCase();
  return ALLOWED_PRODUCT_STATUSES.has(normalized) ? normalized : 'draft';
};

const normalizeFeatured = (value) => {
  if (value === true || value === 1 || value === '1' || value === 'true') return 1;
  return 0;
};

const requireVendor = (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ message: 'Token manquant' });
    const token = auth.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload || payload.role !== 'vendor') return res.status(403).json({ message: 'Acces refuse' });
    req.user = payload;
    next();
  } catch (err) {
    console.error('JWT error', err.message);
    return res.status(401).json({ message: 'Token invalide' });
  }
};

const resolveVendorByUserId = async (userId) => {
  const [[vendor]] = await authPool.query(
    'SELECT id, user_id FROM vendors WHERE user_id = ? LIMIT 1',
    [Number(userId)]
  );
  return vendor || null;
};

const resolveVendorFromParam = async (value) => {
  const numeric = Number(value);
  if (!numeric) return null;

  const [[byVendorId]] = await authPool.query(
    'SELECT id, user_id FROM vendors WHERE id = ? LIMIT 1',
    [numeric]
  );
  if (byVendorId) return byVendorId;

  const [[byUserId]] = await authPool.query(
    'SELECT id, user_id FROM vendors WHERE user_id = ? LIMIT 1',
    [numeric]
  );
  return byUserId || null;
};

// POST /api/products - create product
router.post('/', requireVendor, upload.array('images', 8), async (req, res) => {
  try {
    const vendor = await resolveVendorByUserId(req.user.id);
    if (!vendor) return res.status(404).json({ message: 'Profil vendeur introuvable' });
    const vendorId = vendor.id;

    let body = req.body;
    if (req.body.productData) {
      try {
        body = JSON.parse(req.body.productData);
      } catch (e) {
        // keep req.body
      }
    }

    const {
      sku,
      title,
      slug,
      description,
      short_description,
      price = 0.0,
      quantity = 0,
      category_id = null,
      status = 'draft',
      is_featured = 0,
      primary_image_index = 0
    } = body;

    if (!sku || !title || !slug) return res.status(400).json({ message: 'Champs requis manquants' });

    const [result] = await productsPool.execute(
      `INSERT INTO vendor_products (vendor_id, sku, title, slug, description, short_description, price, quantity, category_id, status, is_featured)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        vendorId,
        sku,
        title,
        slug,
        description || null,
        short_description || null,
        price,
        quantity,
        category_id,
        normalizeProductStatus(status),
        normalizeFeatured(is_featured)
      ]
    );

    const productId = result.insertId;

    if (req.files && req.files.length) {
      for (let i = 0; i < req.files.length; i++) {
        const f = req.files[i];
        const imageUrl = `/uploads/product_images/${f.filename}`;
        const isPrimary = i === Number(primary_image_index) ? 1 : 0;
        await productsPool.execute(
          `INSERT INTO product_images (product_id, image_url, image_path, thumbnail_url, alt_text, sort_order, is_primary)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [productId, imageUrl, f.path, null, f.originalname, i, isPrimary]
        );
      }
    }

    return res.json({ success: true, productId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
});

// GET /api/products?vendorId=
router.get('/', async (req, res) => {
  try {
    const requestedVendorId = req.query.vendorId;
    if (!requestedVendorId) return res.status(400).json({ message: 'vendorId requis' });

    const vendor = await resolveVendorFromParam(requestedVendorId);
    if (!vendor) return res.status(404).json({ message: 'Vendeur introuvable' });

    const [rows] = await productsPool.execute(
      `SELECT id, vendor_id, sku, title, slug, price, compare_price, quantity, low_stock_threshold, total_sales, status, is_featured, created_at,
              (
                SELECT pi.image_url
                FROM product_images pi
                WHERE pi.product_id = vendor_products.id
                ORDER BY pi.is_primary DESC, pi.sort_order ASC, pi.id ASC
                LIMIT 1
              ) AS primary_image
       FROM vendor_products
       WHERE vendor_id IN (?, ?)
       ORDER BY created_at DESC
       LIMIT 100`,
      [vendor.id, vendor.user_id]
    );

    return res.json({ success: true, products: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
});

// GET /api/products/vendors/:vendorId/categories
router.get('/vendors/:vendorId/categories', requireVendor, async (req, res) => {
  try {
    const vendor = await resolveVendorByUserId(req.user.id);
    if (!vendor) return res.status(404).json({ message: 'Profil vendeur introuvable' });

    const paramVendorId = Number(req.params.vendorId);
    if (!paramVendorId) return res.status(400).json({ message: 'vendorId invalide' });
    if (paramVendorId !== vendor.id && paramVendorId !== vendor.user_id) {
      return res.status(403).json({ message: 'Acces refuse' });
    }

    const [[vendorAuthData]] = await authPool.query(
      'SELECT product_categories FROM vendors WHERE user_id = ? LIMIT 1',
      [vendor.user_id]
    );

    if (!vendorAuthData) return res.status(404).json({ message: 'Vendeur introuvable' });

    let businessCategories = [];
    if (Array.isArray(vendorAuthData.product_categories)) {
      businessCategories = vendorAuthData.product_categories;
    } else if (typeof vendorAuthData.product_categories === 'string' && vendorAuthData.product_categories.trim()) {
      try {
        const parsed = JSON.parse(vendorAuthData.product_categories);
        if (Array.isArray(parsed)) businessCategories = parsed;
      } catch (e) {
        businessCategories = [];
      }
    }

    const uniqueNames = [...new Set(businessCategories.map((c) => String(c || '').trim()).filter(Boolean))];

    for (const name of uniqueNames) {
      const slug = toSlug(name);
      if (!slug) continue;
      await productsPool.execute(
        `INSERT INTO product_categories (vendor_id, name, slug, is_active)
         VALUES (?, ?, ?, 1)
         ON DUPLICATE KEY UPDATE name = VALUES(name), is_active = 1`,
        [vendor.id, name, slug]
      );
    }

    const [categories] = await productsPool.execute(
      `SELECT id, name, slug
       FROM product_categories
       WHERE vendor_id = ? AND is_active = 1
       ORDER BY name ASC`,
      [vendor.id]
    );

    return res.json({ success: true, categories });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const [[product]] = await productsPool.execute('SELECT * FROM vendor_products WHERE id = ?', [id]);
    if (!product) return res.status(404).json({ message: 'Produit non trouve' });

    const [images] = await productsPool.execute(
      'SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order',
      [id]
    );

    return res.json({ success: true, product: { ...product, images } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
});

// PUT /api/products/:id
router.put('/:id', requireVendor, upload.array('images', 8), async (req, res) => {
  try {
    const id = req.params.id;
    const vendor = await resolveVendorByUserId(req.user.id);
    if (!vendor) return res.status(404).json({ message: 'Profil vendeur introuvable' });

    let body = req.body;
    if (req.body.productData) {
      try {
        body = JSON.parse(req.body.productData);
      } catch (e) {
        body = req.body;
      }
    }

    const {
      title,
      sku,
      slug,
      description,
      short_description,
      price,
      quantity,
      category_id,
      status,
      is_featured,
      deletedImages,
      primary_image_id
    } = body;

    const [[existing]] = await productsPool.execute(
      'SELECT vendor_id, status, is_featured FROM vendor_products WHERE id = ?',
      [id]
    );
    if (!existing) return res.status(404).json({ message: 'Produit non trouve' });
    if (existing.vendor_id !== vendor.id && existing.vendor_id !== vendor.user_id) {
      return res.status(403).json({ message: 'Acces refuse' });
    }

    const statusToSave =
      typeof status === 'undefined' ? existing.status : normalizeProductStatus(status);
    const featuredToSave =
      typeof is_featured === 'undefined' ? normalizeFeatured(existing.is_featured) : normalizeFeatured(is_featured);

    await productsPool.execute(
      `UPDATE vendor_products
       SET title = ?, sku = ?, slug = ?, description = ?, short_description = ?, price = ?, quantity = ?, category_id = ?, status = ?, is_featured = ?
       WHERE id = ?`,
      [
        title,
        sku,
        slug,
        description,
        short_description,
        price,
        quantity,
        category_id,
        statusToSave,
        featuredToSave,
        id
      ]
    );

    const deletedIds = parseMaybeJsonArray(deletedImages)
      .map((v) => Number(v))
      .filter(Boolean);

    if (deletedIds.length) {
      const placeholders = deletedIds.map(() => '?').join(',');
      const [toDelete] = await productsPool.execute(
        `SELECT id, image_path FROM product_images WHERE product_id = ? AND id IN (${placeholders})`,
        [id, ...deletedIds]
      );

      await productsPool.execute(
        `DELETE FROM product_images WHERE product_id = ? AND id IN (${placeholders})`,
        [id, ...deletedIds]
      );

      for (const img of toDelete) {
        if (img.image_path) fs.unlink(img.image_path, () => {});
      }
    }

    if (req.files && req.files.length) {
      const [[orderRow]] = await productsPool.execute(
        `SELECT COALESCE(MAX(sort_order), -1) AS max_order FROM product_images WHERE product_id = ?`,
        [id]
      );
      const startOrder = Number(orderRow?.max_order || -1) + 1;

      for (let i = 0; i < req.files.length; i++) {
        const f = req.files[i];
        const imageUrl = `/uploads/product_images/${f.filename}`;
        await productsPool.execute(
          `INSERT INTO product_images (product_id, image_url, image_path, thumbnail_url, alt_text, sort_order, is_primary)
           VALUES (?, ?, ?, ?, ?, ?, 0)`,
          [id, imageUrl, f.path, null, f.originalname, startOrder + i]
        );
      }
    }

    if (primary_image_id) {
      await productsPool.execute('UPDATE product_images SET is_primary = 0 WHERE product_id = ?', [id]);
      await productsPool.execute(
        'UPDATE product_images SET is_primary = 1 WHERE product_id = ? AND id = ?',
        [id, Number(primary_image_id)]
      );
    } else {
      const [[hasPrimary]] = await productsPool.execute(
        'SELECT id FROM product_images WHERE product_id = ? AND is_primary = 1 LIMIT 1',
        [id]
      );
      if (!hasPrimary) {
        await productsPool.execute(
          `UPDATE product_images SET is_primary = 1
           WHERE id = (
             SELECT id FROM (
               SELECT id FROM product_images WHERE product_id = ? ORDER BY sort_order ASC, id ASC LIMIT 1
             ) t
           )`,
          [id]
        );
      }
    }

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
});

// DELETE /api/products/:id
router.delete('/:id', requireVendor, async (req, res) => {
  try {
    const id = req.params.id;
    const vendor = await resolveVendorByUserId(req.user.id);
    if (!vendor) return res.status(404).json({ message: 'Profil vendeur introuvable' });

    const [[existing]] = await productsPool.execute('SELECT vendor_id FROM vendor_products WHERE id = ?', [id]);
    if (!existing) return res.status(404).json({ message: 'Produit non trouve' });
    if (existing.vendor_id !== vendor.id && existing.vendor_id !== vendor.user_id) {
      return res.status(403).json({ message: 'Acces refuse' });
    }

    await productsPool.execute('DELETE FROM vendor_products WHERE id = ?', [id]);

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
