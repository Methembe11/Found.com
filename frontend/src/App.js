import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import GlobalStyles from './styles/GlobalStyles';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

const PageFade = styled.div`
  animation: fadeIn 0.3s ease;
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const NotFound = styled.div`
  text-align: center;
  padding: 6rem 1.5rem;
`;

const NotFoundTitle = styled.h1`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 4rem;
  font-weight: 300;
  color: #e2e0d8;
  margin-bottom: 1rem;
`;

function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <CartProvider>
      <GlobalStyles />
      {!isAdmin && <Navbar />}
      <PageFade key={location.pathname}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation/:id" element={<OrderConfirmationPage />} />
          <Route path="/payment/return" element={<OrderConfirmationPage />} />
          <Route path="/admin" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="*" element={
            <NotFound>
              <NotFoundTitle>404</NotFoundTitle>
              <p style={{ color: '#9a9890', fontSize: '14px' }}>Page not found</p>
            </NotFound>
          } />
        </Routes>
      </PageFade>
      {!isAdmin && <Footer />}
      {!isAdmin && <WhatsAppButton />}
    </CartProvider>
  );
}

export default App;
