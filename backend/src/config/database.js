const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Ga0,Ru2&Bl3.',
  database: process.env.DB_NAME || 'pemtshop',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Convertir pool en promesses
const promisePool = pool.promise();

// Test de connexion
promisePool.getConnection()
  .then(connection => {
    console.log('✅ Connecté à la base de données MySQL');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Erreur de connexion à la base de données:', err.message);
  });

module.exports = promisePool;