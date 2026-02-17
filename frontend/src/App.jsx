// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import du contexte
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Import des composants
import Navbar from './components/Navbar';
import HomePage from './pages/Homepage';
import ProductCatalog from './pages/ProductCatalog';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import CheckoutSuccess from './pages/CheckoutSuccess';
import ClientProfile from './pages/ClientProfile';

// Import des pages d'authentification
import LoginClient from './pages/auth/LoginClient';
import RegisterClient from './pages/auth/RegisterClient';
import LoginVendor from './pages/auth/LoginVendor';
import RegisterVendor from './pages/auth/RegisterVendor';
import VerifyOTP from './pages/auth/VerifyOTP';
import ForgotPassword from './pages/auth/ForgotPassword';
import ForgotPasswordVendor from './pages/auth/ForgotPasswordVendor';
import VendorSupport from './pages/VendorSupport';
import VendorDashboard from './pages/vendor/Dashboard';
import ProductList from './components/vendor/products/ProductList';
import ProductForm from './components/vendor/products/ProductForm';
import { useParams } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
          {/* Page d'accueil */}
          <Route 
            path="/" 
            element={
              <>
                <Navbar />
                <HomePage />
              </>
            } 
          />
          <Route
            path="/products"
            element={
              <>
                <Navbar />
                <ProductCatalog />
              </>
            }
          />
          <Route
            path="/products/:slug"
            element={
              <>
                <Navbar />
                <ProductDetails />
              </>
            }
          />
          <Route
            path="/cart"
            element={
              <>
                <Navbar />
                <Cart />
              </>
            }
          />
          <Route
            path="/checkout"
            element={
              <>
                <Navbar />
                <Checkout />
              </>
            }
          />
          <Route
            path="/checkout/success"
            element={
              <>
                <Navbar />
                <CheckoutSuccess />
              </>
            }
          />
          <Route
            path="/profile"
            element={
              <>
                <Navbar />
                <ClientProfile />
              </>
            }
          />
          
          {/* Pages d'authentification CLIENT */}
          <Route path="/auth/login-client" element={<LoginClient />} />
          <Route path="/auth/register-client" element={<RegisterClient />} />
          
          {/* Pages d'authentification VENDEUR */}
          <Route path="/auth/login-vendor" element={<LoginVendor />} />
          <Route path="/auth/register-vendor" element={<RegisterVendor />} />
          
          {/* Vérification OTP */}
          <Route path="/auth/verify-otp" element={<VerifyOTP />} />
          
          {/* Mot de passe oublié CLIENT */}
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          
          {/* Mot de passe oublié VENDEUR */}
          <Route path="/auth/forgot-password-vendor" element={<ForgotPasswordVendor />} />
          
          {/* Support Vendeur */}
          <Route path="/vendor-support" element={<VendorSupport />} />
          
          {/* Tableau de bord Vendeur */}
          <Route path="/vendor/dashboard" element={<VendorDashboard />} />

          {/* Product pages (vendor-scoped) */}
          <Route path="/vendor/:vendorId/products" element={<ProductListWrapper />} />
          <Route path="/vendor/:vendorId/products/add" element={<ProductFormWrapper />} />
          <Route path="/vendor/:vendorId/products/edit/:productId" element={<ProductFormWrapper />} />
          
          {/* Redirection par défaut */}
          <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

function ProductListWrapper() {
  const { vendorId } = useParams();
  return <ProductList vendorId={vendorId} />;
}

function ProductFormWrapper() {
  const { vendorId, productId } = useParams();
  return <ProductForm />;
}

export default App;
