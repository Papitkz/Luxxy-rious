import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { useLenis } from '@/hooks/useLenis';
import { Toaster } from '@/components/ui/sonner';

// Pages
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Products from '@/pages/Products';
import ProductDetail from '@/pages/ProductDetail';
import Cart from '@/pages/Cart';
import Checkout from '@/pages/Checkout';
import Profile from '@/pages/Profile';
import Addresses from '@/pages/Addresses';
import Orders from '@/pages/Orders';

// Dashboards
import AdminDashboard from '@/pages/dashboards/AdminDashboard';
import SellerDashboard from '@/pages/dashboards/SellerDashboard';
import CustomerServiceDashboard from '@/pages/dashboards/CustomerServiceDashboard';

// Components
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProtectedRoute from '@/components/ProtectedRoute';

import './App.css';

function AppContent() {
  useLenis();

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:category" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />

          {/* Protected Buyer Routes */}
          <Route path="/checkout" element={
            <ProtectedRoute allowedRoles={['buyer']}>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute allowedRoles={['buyer', 'seller', 'admin', 'customer_service']}>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/addresses" element={
            <ProtectedRoute allowedRoles={['buyer']}>
              <Addresses />
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute allowedRoles={['buyer']}>
              <Orders />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin/*" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* Seller Routes */}
          <Route path="/seller/*" element={
            <ProtectedRoute allowedRoles={['seller']}>
              <SellerDashboard />
            </ProtectedRoute>
          } />

          {/* Customer Service Routes */}
          <Route path="/support/*" element={
            <ProtectedRoute allowedRoles={['customer_service', 'admin']}>
              <CustomerServiceDashboard />
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: '#000',
            border: '1px solid #ac9455',
            color: '#fff',
          },
        }}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <AppContent />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
