const express = require('express');
const router = express.Router();
const productsPool = require('../config/productsDb');
const ordersPool = require('../config/ordersDb');
const authPool = require('../config/db');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const avatarUploadDir = path.join(__dirname, '..', 'uploads', 'avatars');
fs.mkdirSync(avatarUploadDir, { recursive: true });

const avatarStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, avatarUploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname || '').toLowerCase() || '.jpg';
    cb(null, `${unique}${ext}`);
  }
});

const avatarUpload = multer({
  storage: avatarStorage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Format d\'image non supporte (JPG, PNG, WEBP).'));
    }
    cb(null, true);
  }
});

const makeOrderNumber = () =>
  `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

const getClientFromToken = async (req) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  if (!token) return null;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload?.id || payload?.role !== 'client') return null;
    const [[user]] = await authPool.query(
      'SELECT id, email, first_name, last_name, phone, role, avatar_url FROM users WHERE id = ? LIMIT 1',
      [Number(payload.id)]
    );
    return user || null;
  } catch (e) {
    return null;
  }
};

const resolveClientUserId = async (req, bodyUserId, bodyUserEmail) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      if (payload?.id && payload?.role === 'client') return Number(payload.id);
    } catch (e) {
      // ignore token parse errors and fallback to body userId for simulation mode
    }
  }

  const fallbackId = Number(bodyUserId || 0);
  if (fallbackId) {
    const [[userById]] = await authPool.query(
      'SELECT id FROM users WHERE id = ? AND role = "client" LIMIT 1',
      [fallbackId]
    );
    if (userById?.id) return userById.id;
  }

  const fallbackEmail = String(bodyUserEmail || '').trim();
  if (fallbackEmail) {
    const [[userByEmail]] = await authPool.query(
      'SELECT id FROM users WHERE email = ? AND role = "client" LIMIT 1',
      [fallbackEmail]
    );
    if (userByEmail?.id) return userByEmail.id;
  }

  return null;
};

// GET /api/public/me
router.get('/me', async (req, res) => {
  try {
    const user = await getClientFromToken(req);
    if (!user) return res.status(401).json({ success: false, message: 'Non authentifié' });
    return res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        role: user.role,
        avatarUrl: user.avatar_url || null
      }
    });
  } catch (error) {
    console.error('Erreur public/me:', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// PUT /api/public/me/profile
router.put('/me/profile', async (req, res) => {
  try {
    const user = await getClientFromToken(req);
    if (!user) return res.status(401).json({ success: false, message: 'Non authentifié' });

    const firstName = String(req.body?.firstName || '').trim();
    const lastName = String(req.body?.lastName || '').trim();
    const phone = String(req.body?.phone || '').trim();
    if (!firstName || !lastName) {
      return res.status(400).json({ success: false, message: 'Prénom et nom requis' });
    }

    await authPool.query(
      'UPDATE users SET first_name = ?, last_name = ?, phone = ? WHERE id = ?',
      [firstName, lastName, phone || null, user.id]
    );

    return res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        firstName,
        lastName,
        phone,
        avatarUrl: user.avatar_url || null
      }
    });
  } catch (error) {
    console.error('Erreur public/me/profile:', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// POST /api/public/me/avatar
router.post('/me/avatar', avatarUpload.single('avatar'), async (req, res) => {
  try {
    const user = await getClientFromToken(req);
    if (!user) return res.status(401).json({ success: false, message: 'Non authentifie' });
    if (!req.file) return res.status(400).json({ success: false, message: 'Aucun fichier recu' });

    const nextAvatarUrl = `/uploads/avatars/${req.file.filename}`;
    const previousAvatar = typeof user.avatar_url === 'string' ? user.avatar_url : null;

    await authPool.query('UPDATE users SET avatar_url = ? WHERE id = ?', [nextAvatarUrl, user.id]);

    if (previousAvatar && previousAvatar.startsWith('/uploads/avatars/')) {
      const oldPath = path.join(avatarUploadDir, path.basename(previousAvatar));
      if (fs.existsSync(oldPath)) fs.unlink(oldPath, () => {});
    }

    return res.json({
      success: true,
      data: { avatarUrl: nextAvatarUrl }
    });
  } catch (error) {
    console.error('Erreur public/me/avatar:', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// GET /api/public/my-orders
router.get('/my-orders', async (req, res) => {
  try {
    const user = await getClientFromToken(req);
    if (!user) return res.status(401).json({ success: false, message: 'Non authentifié' });

    const [orders] = await ordersPool.query(
      `SELECT
         o.id,
         o.order_number,
         o.vendor_id,
         o.total_amount,
         o.status,
         o.payment_status,
         o.payment_method,
         o.placed_at
       FROM vendor_orders o
       WHERE o.user_id = ?
       ORDER BY o.placed_at DESC
       LIMIT 100`,
      [user.id]
    );

    const orderIds = orders.map((o) => o.id);
    let itemsByOrderId = {};
    if (orderIds.length) {
      const placeholders = orderIds.map(() => '?').join(',');
      const [items] = await ordersPool.query(
        `SELECT
           oi.order_id,
           COALESCE(NULLIF(oi.product_title, ''), vp.title, CONCAT('Produit #', oi.product_id)) AS product_title,
           oi.quantity,
           oi.unit_price,
           oi.total_price
         FROM vendor_order_items oi
         LEFT JOIN pemtshop_products.vendor_products vp ON vp.id = oi.product_id
         WHERE oi.order_id IN (${placeholders})
         ORDER BY oi.id ASC`,
        orderIds
      );
      itemsByOrderId = items.reduce((acc, item) => {
        if (!acc[item.order_id]) acc[item.order_id] = [];
        acc[item.order_id].push(item);
        return acc;
      }, {});
    }

    const data = orders.map((o) => ({
      ...o,
      items: itemsByOrderId[o.id] || []
    }));

    return res.json({ success: true, data });
  } catch (error) {
    console.error('Erreur public/my-orders:', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// GET /api/public/categories
router.get('/categories', async (req, res) => {
  try {
    const [rows] = await productsPool.query(
      `SELECT
         c.id,
         c.name,
         COUNT(p.id) AS product_count
       FROM product_categories c
       LEFT JOIN vendor_products p
         ON p.category_id = c.id
        AND p.status = 'active'
        AND p.quantity > 0
       WHERE c.is_active = 1
       GROUP BY c.id, c.name
       HAVING product_count > 0
       ORDER BY c.name ASC
       LIMIT 200`
    );

    return res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Erreur public/categories:', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// GET /api/public/products
router.get('/products', async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 12, 1), 60);
    const offset = (page - 1) * limit;

    const search = (req.query.search || '').trim();
    const category = req.query.category ? Number(req.query.category) : null;
    const minPrice = req.query.minPrice ? Number(req.query.minPrice) : null;
    const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : null;
    const sortBy = req.query.sortBy || 'newest';

    let where = `WHERE p.status = 'active' AND p.quantity > 0`;
    const params = [];

    if (search) {
      where += ` AND (p.title LIKE ? OR p.description LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }
    if (category) {
      where += ` AND p.category_id = ?`;
      params.push(category);
    }
    if (Number.isFinite(minPrice)) {
      where += ` AND p.price >= ?`;
      params.push(minPrice);
    }
    if (Number.isFinite(maxPrice)) {
      where += ` AND p.price <= ?`;
      params.push(maxPrice);
    }

    let orderBy = 'ORDER BY p.created_at DESC';
    if (sortBy === 'price_asc') orderBy = 'ORDER BY p.price ASC';
    if (sortBy === 'price_desc') orderBy = 'ORDER BY p.price DESC';
    if (sortBy === 'popular') orderBy = 'ORDER BY p.total_sales DESC, p.created_at DESC';

    const safeLimit = Number(limit) || 12;
    const safeOffset = Number(offset) || 0;

    const [rows] = await productsPool.query(
      `SELECT
         p.id,
         p.vendor_id,
         p.title,
         p.slug,
         p.short_description,
         p.price,
         p.compare_price,
         p.quantity,
         p.status,
         p.total_sales,
         p.created_at,
         c.id AS category_id,
         c.name AS category_name,
         (
           SELECT pi.image_url
           FROM product_images pi
           WHERE pi.product_id = p.id
           ORDER BY pi.is_primary DESC, pi.sort_order ASC, pi.id ASC
           LIMIT 1
         ) AS primary_image
       FROM vendor_products p
       LEFT JOIN product_categories c ON c.id = p.category_id
       ${where}
       ${orderBy}
       LIMIT ${safeLimit} OFFSET ${safeOffset}`,
      params
    );

    const [countRows] = await productsPool.query(
      `SELECT COUNT(*) AS total
       FROM vendor_products p
       ${where}`,
      params
    );

    const total = countRows[0]?.total || 0;
    return res.json({
      success: true,
      data: rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Erreur public/products:', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// GET /api/public/products/:slug
router.get('/products/:slug', async (req, res) => {
  try {
    const slug = req.params.slug;
    const [[product]] = await productsPool.execute(
      `SELECT
         p.*,
         c.name AS category_name
       FROM vendor_products p
       LEFT JOIN product_categories c ON c.id = p.category_id
       WHERE p.slug = ? AND p.status = 'active'
       LIMIT 1`,
      [slug]
    );

    if (!product) {
      return res.status(404).json({ success: false, message: 'Produit introuvable' });
    }

    const [images] = await productsPool.execute(
      `SELECT id, image_url, thumbnail_url, alt_text, sort_order, is_primary
       FROM product_images
       WHERE product_id = ?
       ORDER BY is_primary DESC, sort_order ASC, id ASC`,
      [product.id]
    );

    return res.json({
      success: true,
      data: {
        ...product,
        images
      }
    });
  } catch (error) {
    console.error('Erreur public/products/:slug:', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// POST /api/public/checkout/simulate
router.post('/checkout/simulate', async (req, res) => {
  try {
    const { items = [], shippingAddress = {}, payment = {}, userId, userEmail } = req.body || {};
    const resolvedUserId = await resolveClientUserId(req, userId, userEmail);

    if (!resolvedUserId) {
      return res.status(401).json({ success: false, message: 'Client non authentifié' });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Panier vide' });
    }

    const fullName = String(shippingAddress.fullName || '').trim();
    const phone = String(shippingAddress.phone || '').trim();
    const addressLine = String(shippingAddress.addressLine || '').trim();
    const city = String(shippingAddress.city || '').trim();
    const country = String(shippingAddress.country || '').trim();
    if (!fullName || !phone || !addressLine || !city || !country) {
      return res.status(400).json({ success: false, message: 'Adresse de livraison incomplète' });
    }

    const qtyByProductId = new Map();
    for (const item of items) {
      const productId = Number(item?.productId);
      const quantity = Math.max(1, Number(item?.quantity || 1));
      if (!productId) continue;
      qtyByProductId.set(productId, (qtyByProductId.get(productId) || 0) + quantity);
    }

    const productIds = [...qtyByProductId.keys()];
    if (!productIds.length) {
      return res.status(400).json({ success: false, message: 'Aucun produit valide' });
    }

    const placeholders = productIds.map(() => '?').join(',');
    const [products] = await productsPool.query(
      `SELECT id, vendor_id, sku, title, price, quantity, status
       FROM vendor_products
       WHERE id IN (${placeholders})`,
      productIds
    );

    const byId = new Map(products.map((p) => [Number(p.id), p]));
    const orderLines = [];
    for (const productId of productIds) {
      const product = byId.get(productId);
      const requestedQty = qtyByProductId.get(productId) || 0;

      if (!product) {
        return res.status(400).json({ success: false, message: `Produit introuvable: ${productId}` });
      }
      if (product.status !== 'active') {
        return res.status(400).json({ success: false, message: `Produit non actif: ${product.title}` });
      }
      if (Number(product.quantity) < requestedQty) {
        return res.status(400).json({
          success: false,
          message: `Stock insuffisant pour ${product.title} (disponible: ${product.quantity})`
        });
      }

      orderLines.push({
        productId,
        vendorId: Number(product.vendor_id),
        sku: product.sku,
        title: product.title,
        quantity: requestedQty,
        unitPrice: Number(product.price),
        totalPrice: Number((Number(product.price) * requestedQty).toFixed(2))
      });
    }

    const linesByVendor = new Map();
    for (const line of orderLines) {
      if (!linesByVendor.has(line.vendorId)) linesByVendor.set(line.vendorId, []);
      linesByVendor.get(line.vendorId).push(line);
    }

    const createdOrders = [];
    for (const [vendorId, vendorLines] of linesByVendor.entries()) {
      const subtotal = vendorLines.reduce((sum, l) => sum + l.totalPrice, 0);
      const shippingCost = subtotal > 100 ? 0 : 8;
      const taxAmount = Number((subtotal * 0.1).toFixed(2));
      const totalAmount = Number((subtotal + shippingCost + taxAmount).toFixed(2));
      const commissionRate = 10;
      const commissionAmount = Number(((subtotal * commissionRate) / 100).toFixed(2));
      const vendorPayout = Number((subtotal - commissionAmount).toFixed(2));
      const orderNumber = makeOrderNumber();

      const [orderResult] = await ordersPool.query(
        `INSERT INTO vendor_orders (
          order_number, vendor_id, user_id, subtotal, shipping_cost, tax_amount, discount_amount,
          total_amount, commission_rate, commission_amount, vendor_payout,
          status, payment_status, payment_method, shipping_address, billing_address, placed_at, paid_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          orderNumber,
          vendorId,
          resolvedUserId,
          subtotal,
          shippingCost,
          taxAmount,
          0,
          totalAmount,
          commissionRate,
          commissionAmount,
          vendorPayout,
          'confirmed',
          'paid',
          payment?.method || 'card_simulated',
          JSON.stringify(shippingAddress),
          JSON.stringify(shippingAddress)
        ]
      );

      const orderId = orderResult.insertId;

      for (const line of vendorLines) {
        await ordersPool.query(
          `INSERT INTO vendor_order_items (
            order_id, product_id, variant_id, product_sku, product_title, variant_attributes,
            quantity, unit_price, total_price, discount_amount, tax_rate, tax_amount, product_image
          ) VALUES (?, ?, NULL, ?, ?, NULL, ?, ?, ?, 0, 0, 0, NULL)`,
          [orderId, line.productId, line.sku, line.title, line.quantity, line.unitPrice, line.totalPrice]
        );

        await productsPool.query(
          `UPDATE vendor_products
           SET quantity = GREATEST(quantity - ?, 0),
               total_sales = COALESCE(total_sales, 0) + ?,
               status = CASE WHEN quantity - ? <= 0 THEN 'out_of_stock' ELSE status END
           WHERE id = ?`,
          [line.quantity, line.quantity, line.quantity, line.productId]
        );
      }

      await ordersPool.query(
        `INSERT INTO vendor_order_status_history (order_id, status, comment, changed_by, changed_by_type)
         VALUES (?, 'confirmed', 'Commande simulée payée par carte', ?, 'system')`,
        [orderId, resolvedUserId]
      );

      createdOrders.push({
        orderId,
        orderNumber,
        vendorId,
        totalAmount
      });
    }

    const grandTotal = createdOrders.reduce((sum, o) => sum + Number(o.totalAmount), 0);
    return res.json({
      success: true,
      message: 'Commande créée avec succès (simulation)',
      data: {
        userId: resolvedUserId,
        orders: createdOrders,
        totalOrders: createdOrders.length,
        totalAmount: Number(grandTotal.toFixed(2))
      }
    });
  } catch (error) {
    console.error('Erreur public/checkout/simulate:', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

module.exports = router;

