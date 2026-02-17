require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./src/routes/auth.routes');
const productsRoutes = require('./src/routes/products.routes');
const orderRoutes = require('./src/routes/order.routes');
const publicRoutes = require('./src/routes/public.routes');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// 🔹 Middleware AVANT les routes
app.use(express.json());

app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// 🔹 Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/vendors', orderRoutes);
app.use('/api/public', publicRoutes);

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'src', 'uploads')));

// 🔹 Health check
app.get('/health', (req, res) =>
  res.json({ ok: true, env: process.env.NODE_ENV || 'dev' })
);

// 🔹 Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend lancé sur le port ${PORT}`);
});
