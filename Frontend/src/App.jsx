﻿import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

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
        {/* Navbar và các nút liên hệ */}
        <Navbar />
        <FloatingContact />
        <BackToTop />

        {/* Khu vực định tuyến (Chỉ dùng <Route> bên trong <Routes>) */}
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

          {/* Hai trang Dashboard đã được sửa thành <Route> chuẩn */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/candidate" element={<CandidateDashboard />} />

          {/* Chống gõ link bậy */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
