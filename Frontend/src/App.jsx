﻿import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// 👇 1. IMPORT CẤU HÌNH I18N Ở ĐÂY ĐỂ KÍCH HOẠT TOÀN DỰ ÁN
import './i18n/i18n';

// Import các component dùng chung
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import FloatingContact from './components/FloatingContact';

// Import các trang
import Home from './pages/Home';
import ProductList from './features/products/ProductList';
import ProductDetail from './features/products/ProductDetail';
import About from "./features/about/About";
import Contact from "./features/contact/Contact";
import Login from "./features/login/Login";
import Register from "./features/login/Register";

// Import Dashboard đúng đường dẫn thư mục
import AdminDashboard from "./features/AdminDashboard/AdminDashboard";
import CandidateDashboard from "./features/AdminDashboard/CandidateDashboard";

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navbar giờ đây đã có thể sử dụng useTranslation vì i18n đã được load ở trên */}
        <Navbar />
        <FloatingContact />
        <BackToTop />

        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/products" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/san-pham" element={<Navigate to="/products" replace />} />

          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/lien-he" element={<Navigate to="/contact" replace />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/candidate" element={<CandidateDashboard />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;