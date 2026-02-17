const mysql = require('mysql2/promise');
require('dotenv').config();

const productsPool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'Ga0,Ru2&Bl3.',
  database: process.env.DB_PRODUCTS_NAME || 'pemtshop_products',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+00:00',
  charset: 'utf8mb4'
});

module.exports = productsPool;
