const fs = require('fs');
const path = require('path');
require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function run() {
  try {
    // 1) Apply products DB migration
    const productsConn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_PRODUCTS_NAME || 'pemtshop_products',
      multipleStatements: true
    });

    const sqlPath = path.join(__dirname, '..', 'migrations', 'pemtshop_products.sql');
    if (!fs.existsSync(sqlPath)) {
      throw new Error('Migration file not found: ' + sqlPath);
    }

    const sql = fs.readFileSync(sqlPath, 'utf8');
    console.log('Applying products migration...');
    await productsConn.query(sql);
    console.log('Products migration applied.');
    await productsConn.end();

    // 2) Seed a test vendor into auth DB
    const authConn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || 'Ga0,Ru2&Bl3.',
      database: process.env.DB_NAME || 'pemtshop_auth',
      multipleStatements: true
    });

    const email = process.env.TEST_VENDOR_EMAIL || 'vendor.test@example.com';
    const password = process.env.TEST_VENDOR_PASSWORD || 'Test1234';
    const firstName = 'Test';
    const lastName = 'Vendor';
    const phone = '0000000000';

    const hash = await bcrypt.hash(password, 10);

    console.log('Inserting test user...');
    const [userRes] = await authConn.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, phone, role, is_active, accepted_terms_at)
       VALUES (?, ?, ?, ?, ?, 'vendor', 1, NOW())`,
      [email, hash, firstName, lastName, phone]
    );

    const userId = userRes.insertId;
    console.log('Inserted user id:', userId);

    console.log('Inserting vendor record...');
    await authConn.query(
      `INSERT INTO vendors (user_id, business_name, business_type, website, tax_id, address, city, postal_code, country, monthly_volume, product_categories)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, 'Test Business', 'retail', null, null, null, null, null, null, null, JSON.stringify([])]
    );

    console.log('Test vendor created:', email);

    // 3) Generate JWT for vendor and attempt a sample POST to /api/products
    const token = jwt.sign({ id: userId, role: 'vendor' }, process.env.JWT_SECRET || 'dev_secret_pemtshop_2026', { expiresIn: '7d' });
    console.log('Generated JWT (use for testing):', token);

    try {
      console.log('Posting sample product to API...');
      const product = { sku: 'TEST-CLI-AUTH', title: 'Test CLI Auth', slug: 'test-cli-auth', price: 5.5, quantity: 2 };
      const resp = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(product)
      });
      const data = await resp.json().catch(() => null);
      console.log('Create product response status:', resp.status);
      console.log('Create product response body:', data);
    } catch (err) {
      console.error('Create product failed:', err.message || err);
    }

    await authConn.end();
    console.log('Done.');
    process.exit(0);
  } catch (err) {
    console.error('Migration/seed failed:', err.message || err);
    process.exit(1);
  }
}

run();
