require('dotenv').config();

const productsPool = require('../src/config/productsDb');
const ordersPool = require('../src/config/ordersDb');

async function syncTotalSales() {
  let productsConn;
  try {
    const [salesRows] = await ordersPool.query(
      `SELECT oi.product_id, SUM(oi.quantity) AS qty
       FROM vendor_order_items oi
       INNER JOIN vendor_orders o ON o.id = oi.order_id
       WHERE o.payment_status = 'paid'
       GROUP BY oi.product_id`
    );

    productsConn = await productsPool.getConnection();
    await productsConn.beginTransaction();

    await productsConn.query('UPDATE vendor_products SET total_sales = 0');

    let updatedProducts = 0;
    for (const row of salesRows) {
      const productId = Number(row.product_id);
      const qty = Number(row.qty || 0);
      if (!productId || qty <= 0) continue;

      const [result] = await productsConn.query(
        'UPDATE vendor_products SET total_sales = ? WHERE id = ?',
        [qty, productId]
      );
      updatedProducts += Number(result.affectedRows || 0);
    }

    await productsConn.commit();

    console.log('Sync total_sales termine.');
    console.log(`Produits avec ventes calculees: ${salesRows.length}`);
    console.log(`Produits mis a jour: ${updatedProducts}`);
  } catch (error) {
    if (productsConn) await productsConn.rollback();
    console.error('Erreur sync_total_sales:', error.message);
    process.exitCode = 1;
  } finally {
    if (productsConn) productsConn.release();
    await Promise.allSettled([productsPool.end(), ordersPool.end()]);
  }
}

syncTotalSales();
