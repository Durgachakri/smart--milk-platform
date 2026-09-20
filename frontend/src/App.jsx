import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Providers
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Customer Pages
import Catalog from './pages/customer/Catalog';
import Checkout from './pages/customer/Checkout';
import MyOrders from './pages/customer/MyOrders';
import Subscriptions from './pages/customer/Subscriptions';
import CalendarView from './pages/customer/CalendarView';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
          {/* Global Navigation Bar */}
          <Navbar />

          {/* Main Content Viewport */}
          <main style={{ flex: 1, padding: '2rem 0' }}>
            <Routes>
              <Route path="/" element={<Navigate to="/catalog" replace />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<MyOrders />} />
              <Route path="/subscriptions" element={<Subscriptions />} />
              <Route path="/calendar" element={<CalendarView />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>

          {/* Global Footer */}
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;