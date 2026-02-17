const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const authPool = require('../config/db');
const ordersPool = require('../config/ordersDb');

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

const assertVendorAccess = async (req, res, next) => {
  const loggedVendor = await resolveVendorByUserId(req.user.id);
  if (!loggedVendor) return res.status(404).json({ success: false, message: 'Profil vendeur introuvable' });

  const paramVendor = await resolveVendorFromParam(req.params.vendorId);
  if (!paramVendor) return res.status(404).json({ success: false, message: 'Vendeur introuvable' });

  if (paramVendor.id !== loggedVendor.id) {
    return res.status(403).json({ success: false, message: 'Acces refuse' });
  }

  req.vendor = loggedVendor;
  next();
};

router.get('/:vendorId/orders', requireVendor, assertVendorAccess, async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;
    const status = req.query.status;
    const search = req.query.search;

    let where = 'WHERE o.vendor_id = ?';
    const params = [req.vendor.id];

    if (status && status !== 'all') {
      where += ' AND o.status = ?';
      params.push(status);
    }

    if (search) {
      where += ' AND o.order_number LIKE ?';
      params.push(`%${search}%`);
    }

    const [orders] = await ordersPool.query(
      `SELECT o.*, u.first_name, u.last_name, u.email
       FROM vendor_orders o
       LEFT JOIN pemtshop_auth.users u ON u.id = o.user_id
       ${where}
       ORDER BY o.placed_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    const [countRows] = await ordersPool.query(
      `SELECT COUNT(*) as total FROM vendor_orders o ${where}`,
      params
    );

    const total = countRows[0]?.total || 0;

    return res.json({
      success: true,
      data: orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Erreur getVendorOrders:', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

router.get('/:vendorId/orders/:orderId', requireVendor, assertVendorAccess, async (req, res) => {
  try {
    const { orderId } = req.params;

    const [[order]] = await ordersPool.query(
      `SELECT o.*, u.first_name, u.last_name, u.email, u.phone
       FROM vendor_orders o
       LEFT JOIN pemtshop_auth.users u ON u.id = o.user_id
       WHERE o.id = ? AND o.vendor_id = ?`,
      [orderId, req.vendor.id]
    );

    if (!order) return res.status(404).json({ success: false, message: 'Commande introuvable' });

    const [items] = await ordersPool.query(
      'SELECT * FROM vendor_order_items WHERE order_id = ?',
      [orderId]
    );

    return res.json({ success: true, data: { ...order, items } });
  } catch (error) {
    console.error('Erreur getOrderById:', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

router.put('/:vendorId/orders/:orderId/status', requireVendor, assertVendorAccess, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, comment } = req.body;

    if (!status) return res.status(400).json({ success: false, message: 'Statut requis' });

    const [result] = await ordersPool.query(
      'UPDATE vendor_orders SET status = ? WHERE id = ? AND vendor_id = ?',
      [status, orderId, req.vendor.id]
    );

    if (!result.affectedRows) return res.status(404).json({ success: false, message: 'Commande introuvable' });

    await ordersPool.query(
      `INSERT INTO vendor_order_status_history (order_id, status, comment, changed_by, changed_by_type)
       VALUES (?, ?, ?, ?, 'vendor')`,
      [orderId, status, comment || null, req.vendor.id]
    );

    return res.json({ success: true, message: 'Statut mis a jour' });
  } catch (error) {
    console.error('Erreur updateOrderStatus:', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

router.get('/:vendorId/orders/stats', requireVendor, assertVendorAccess, async (req, res) => {
  try {
    const vendorId = req.vendor.id;

    const [[today]] = await ordersPool.query(
      `SELECT COUNT(*) as count, COALESCE(SUM(total_amount),0) as total
       FROM vendor_orders WHERE vendor_id = ? AND DATE(placed_at) = CURDATE()`,
      [vendorId]
    );

    const [[week]] = await ordersPool.query(
      `SELECT COUNT(*) as count, COALESCE(SUM(total_amount),0) as total
       FROM vendor_orders WHERE vendor_id = ? AND placed_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)`,
      [vendorId]
    );

    const [[month]] = await ordersPool.query(
      `SELECT COUNT(*) as count, COALESCE(SUM(total_amount),0) as total
       FROM vendor_orders WHERE vendor_id = ? AND placed_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)`,
      [vendorId]
    );

    return res.json({ success: true, data: { today, week, month } });
  } catch (error) {
    console.error('Erreur getOrderStats:', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

module.exports = router;
