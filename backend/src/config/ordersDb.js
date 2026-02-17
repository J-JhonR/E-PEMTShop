const mysql = require('mysql2/promise');
require('dotenv').config();

const ordersPool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_ORDERS_NAME || 'pemtshop_orders',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+00:00',
  charset: 'utf8mb4'
});

module.exports = ordersPool;
