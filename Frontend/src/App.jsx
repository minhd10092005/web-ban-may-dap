import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Public pages
import Home from './pages/Home';
import About from './features/about/About';
import Contact from './features/contact/Contact';
import Login from './features/login/Login';
import Register from './features/login/Register';
import ProductList from './features/products/ProductList';
import ProductDetail from './features/products/ProductDetail';

// Layouts
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminLayout from './features/admin/components/AdminLayout';

// Admin pages
import AdminManager from './features/admin/pages/AdminManager';
import CandidateProfileManager from './features/admin/pages/CandidateProfileManager';
import CategoryManager from './features/admin/pages/CategoryManager';
import ProductDetailManager from './features/admin/pages/ProductDetailManager';
import ProductImageManager from './features/admin/pages/ProductImageManager';
import ProductManager from './features/admin/pages/ProductManager';
import QuoteManager from './features/admin/pages/QuoteManager';
import UserManager from './features/admin/pages/UserManager';

import './App.css';

const PublicLayout = ({ children }) => (
  <>
    <Navbar />
    <main style={{ minHeight: '80vh' }}>{children}</main>
    <Footer />
  </>
);

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
        <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
        <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />
        <Route path="/products" element={<PublicLayout><ProductList /></PublicLayout>} />
        <Route path="/products/:id" element={<PublicLayout><ProductDetail /></PublicLayout>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="products" replace />} />
          <Route path="products" element={<ProductManager />} />
          <Route path="categories" element={<CategoryManager />} />
          <Route path="product-details" element={<ProductDetailManager />} />
          <Route path="product-images" element={<ProductImageManager />} />
          <Route path="users" element={<UserManager />} />
          <Route path="admins" element={<AdminManager />} />
          <Route path="candidates" element={<CandidateProfileManager />} />
          <Route path="quotes" element={<QuoteManager />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;