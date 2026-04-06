import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './i18n/i18n';
import './App.css';

// ===== Layout user =====
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import FloatingContact from './components/FloatingContact';

// ===== Pages user =====
import Home from './pages/Home';
import About from "./features/about/About";
import Login from "./features/login/Login";
import Register from "./features/login/Register";
import ChangePassword from "./features/login/ChangePassword";

// ===== Product =====
import ProductList from './features/products/ProductList';
import ProductDetail from './features/products/ProductDetail';

// ===== Quote =====
import QuoteForm from './features/quotes/QuoteForm';

// ===== Admin =====
import AdminLayout from './features/admin/components/AdminLayout';
import ProductManager from './features/admin/pages/ProductManager';
import CategoryManager from './features/admin/pages/CategoryManager';
import ProductDetailManager from './features/admin/pages/ProductDetailManager';
import ProductImageManager from './features/admin/pages/ProductImageManager';
import AdminManager from './features/admin/pages/AdminManager';
import UserManager from './features/admin/pages/UserManager';
import QuoteManager from './features/admin/pages/QuoteManager';
import CandidateProfileManager from './features/admin/pages/CandidateProfileManager';

// ===== Candidate Dashboard (Trang hồ sơ sau khi Login) =====
// Chú ý: Nếu dòng này báo lỗi màu đen "Failed to resolve", bro hãy kiểm tra lại tên folder AdminDashboard
import CandidateDashboard from './features/AdminDashboard/CandidateDashboard';

function App() {
  return (
    <Router>
      <div className="App">

        {/* ===== USER LAYOUT ===== */}
        <Navbar />
        <FloatingContact />
        <BackToTop />

        <Routes>

          {/* ===== PUBLIC ROUTES ===== */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />

          {/* Khi nhấn "Tuyển dụng" ở Navbar, nó sẽ nhảy vào Route /login này */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/change-password" element={<ChangePassword />} />

          {/* ===== PRIVATE/USER ROUTES ===== */}
          {/* Trang hồ sơ cá nhân của ứng viên sau khi đăng nhập thành công */}
          <Route path="/candidates" element={<CandidateDashboard />} />
          <Route path="/candidate" element={<CandidateDashboard />} />

          {/* ===== PRODUCT & QUOTE ===== */}
          <Route path="/products" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/quote" element={<QuoteForm />} />

          {/* ===== ADMIN ROUTES (Chỉ dành cho Admin) ===== */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="products" replace />} />
            <Route path="products" element={<ProductManager />} />
            <Route path="categories" element={<CategoryManager />} />
            <Route path="product-details" element={<ProductDetailManager />} />
            <Route path="product-images" element={<ProductImageManager />} />
            <Route path="admins" element={<AdminManager />} />
            <Route path="users" element={<UserManager />} />
            <Route path="quotes" element={<QuoteManager />} />
            <Route path="candidate-profiles" element={<CandidateProfileManager />} />
          </Route>

          {/* ===== FALLBACK (Tránh trang trắng) ===== */}
          {/* <Route path="*" element={<Navigate to="/" />} /> */}

        </Routes>

        <Footer />

        <ToastContainer
          position="top-right"
          autoClose={3000}
          theme="light"
        />
      </div>
    </Router>
  );
}

export default App;