// controllers/order.controller.js
const db = require('../config/database');

class OrderController {
  /**
   * Récupérer les commandes d'un vendeur
   */
  async getVendorOrders(req, res) {
    try {
      const vendorId = req.params.vendorId;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const status = req.query.status;
      const dateRange = req.query.dateRange;

      let query = `
        SELECT o.*, 
          u.first_name, u.last_name, u.email,
          (SELECT COUNT(*) FROM vendor_order_items WHERE order_id = o.id) as items_count
        FROM vendor_orders o
        LEFT JOIN pemtshop_auth.users u ON o.user_id = u.id
        WHERE o.vendor_id = ?
      `;
      
      const params = [vendorId];

      if (status && status !== 'all') {
        query += ` AND o.status = ?`;
        params.push(status);
      }

      if (dateRange === 'today') {
        query += ` AND DATE(o.placed_at) = CURDATE()`;
      } else if (dateRange === 'week') {
        query += ` AND o.placed_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)`;
      } else if (dateRange === 'month') {
        query += ` AND o.placed_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)`;
      }

      query += ` ORDER BY o.placed_at DESC LIMIT ? OFFSET ?`;
      params.push(limit, offset);

      const [orders] = await db.query(query, params);

      // Récupérer les items pour chaque commande
      for (let order of orders) {
        const [items] = await db.query(
          `SELECT * FROM vendor_order_items WHERE order_id = ?`,
          [order.id]
        );
        order.items = items;
      }

      // Récupérer le nombre total
      let countQuery = `SELECT COUNT(*) as total FROM vendor_orders WHERE vendor_id = ?`;
      const countParams = [vendorId];
      
      if (status && status !== 'all') {
        countQuery += ` AND status = ?`;
        countParams.push(status);
      }
      
      const [totalResult] = await db.query(countQuery, countParams);
      const total = totalResult[0].total;

      res.json({
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
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }

  /**
   * Récupérer une commande spécifique
   */
  async getOrderById(req, res) {
    try {
      const { vendorId, orderId } = req.params;

      const [orders] = await db.query(
        `SELECT o.*, 
          u.first_name, u.last_name, u.email, u.phone
        FROM vendor_orders o
        LEFT JOIN pemtshop_auth.users u ON o.user_id = u.id
        WHERE o.id = ? AND o.vendor_id = ?`,
        [orderId, vendorId]
      );

      if (orders.length === 0) {
        return res.status(404).json({ success: false, message: 'Commande non trouvée' });
      }

      const order = orders[0];

      // Récupérer les items de la commande
      const [items] = await db.query(
        `SELECT * FROM vendor_order_items WHERE order_id = ?`,
        [orderId]
      );

      // Récupérer l'historique des statuts
      const [history] = await db.query(
        `SELECT * FROM vendor_order_status_history WHERE order_id = ? ORDER BY created_at DESC`,
        [orderId]
      );

      order.items = items;
      order.status_history = history;

      res.json({ success: true, data: order });
    } catch (error) {
      console.error('Erreur getOrderById:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }

  /**
   * Mettre à jour le statut d'une commande
   */
  async updateOrderStatus(req, res) {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      const { vendorId, orderId } = req.params;
      const { status, comment, tracking_number, carrier } = req.body;

      // Vérifier la commande
      const [orders] = await connection.query(
        `SELECT * FROM vendor_orders WHERE id = ? AND vendor_id = ?`,
        [orderId, vendorId]
      );

      if (orders.length === 0) {
        await connection.rollback();
        return res.status(404).json({ success: false, message: 'Commande non trouvée' });
      }

      const order = orders[0];

      // Mettre à jour le statut
      let updateQuery = `UPDATE vendor_orders SET status = ?`;
      const updateParams = [status];

      // Ajouter les dates selon le statut
      if (status === 'shipped') {
        updateQuery += `, shipped_at = NOW(), tracking_number = ?, carrier = ?`;
        updateParams.push(tracking_number, carrier);
      } else if (status === 'delivered') {
        updateQuery += `, delivered_at = NOW()`;
      } else if (status === 'cancelled') {
        updateQuery += `, cancelled_at = NOW()`;
      }

      updateQuery += ` WHERE id = ? AND vendor_id = ?`;
      updateParams.push(orderId, vendorId);

      await connection.query(updateQuery, updateParams);

      // Ajouter l'historique
      await connection.query(
        `INSERT INTO vendor_order_status_history (order_id, status, comment, changed_by, changed_by_type)
         VALUES (?, ?, ?, ?, 'vendor')`,
        [orderId, status, comment, vendorId]
      );

      await connection.commit();

      res.json({
        success: true,
        message: 'Statut de la commande mis à jour avec succès'
      });
    } catch (error) {
      await connection.rollback();
      console.error('Erreur updateOrderStatus:', error);
      res.status(500).json({ success: false, message: 'Erreur lors de la mise à jour du statut' });
    } finally {
      connection.release();
    }
  }

  /**
   * Récupérer les statistiques des commandes
   */
  async getOrderStats(req, res) {
    try {
      const vendorId = req.params.vendorId;

      // Commandes aujourd'hui
      const [today] = await db.query(
        `SELECT 
          COUNT(*) as count,
          COALESCE(SUM(total_amount), 0) as total
        FROM vendor_orders 
        WHERE vendor_id = ? AND DATE(placed_at) = CURDATE()`,
        [vendorId]
      );

      // Commandes cette semaine
      const [week] = await db.query(
        `SELECT 
          COUNT(*) as count,
          COALESCE(SUM(total_amount), 0) as total
        FROM vendor_orders 
        WHERE vendor_id = ? AND placed_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)`,
        [vendorId]
      );

      // Commandes ce mois
      const [month] = await db.query(
        `SELECT 
          COUNT(*) as count,
          COALESCE(SUM(total_amount), 0) as total
        FROM vendor_orders 
        WHERE vendor_id = ? AND placed_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)`,
        [vendorId]
      );

      // Stats par statut
      const [statusStats] = await db.query(
        `SELECT status, COUNT(*) as count, COALESCE(SUM(total_amount), 0) as total
         FROM vendor_orders
         WHERE vendor_id = ?
         GROUP BY status`,
        [vendorId]
      );

      // Commandes récentes
      const [recent] = await db.query(
        `SELECT id, order_number, total_amount, status, placed_at
         FROM vendor_orders
         WHERE vendor_id = ?
         ORDER BY placed_at DESC
         LIMIT 5`,
        [vendorId]
      );

      res.json({
        success: true,
        data: {
          today: today[0],
          week: week[0],
          month: month[0],
          by_status: statusStats,
          recent: recent
        }
      });
    } catch (error) {
      console.error('Erreur getOrderStats:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }
}

module.exports = new OrderController();