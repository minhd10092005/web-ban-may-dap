
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import FloatingContact from './components/FloatingContact';
import Home from './pages/Home';
import ProductList from './features/products/ProductList';
import ProductDetail from './features/products/ProductDetail';
import About from "./features/about/About";
import Contact from "./features/contact/Contact";
import Login from "./features/login/Login";
import Register from "./features/login/Register";


function App() {
  return (
    <Router>
      <div className="App">
        {/* Navbar và các nút liên hệ luôn hiện diện */}
        <Navbar />
        <FloatingContact />
        <BackToTop />
        <Login />
        <Register />

        <Routes>
          {/* 1. Trang chủ của bro (Giữ đúng path "/") */}
          <Route path="/" element={<Home />} />

          {/* 2. Trang danh sách và chi tiết máy móc */}
          <Route path="/products" element={<ProductList />} />
          {/* Lưu ý: path là /product/:id để khớp với link ở trang Home */}
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/san-pham" element={<Navigate to="/products" replace />} />

          {/* 3. Trang About của nhóm trưởng (Đổi sang path "/about") */}
          <Route path="/about" element={<About />} />

          {/* 4. Trang Contact của nhóm trưởng (Đổi sang path "/contact") */}
          <Route path="/contact" element={<Contact />} />

          {/* 5. Trang Liên Hệ tạm của bro (Nếu cần giữ) */}
          <Route path="/lien-he" element={<Navigate to="/contact" replace />} />

          {/* 6. Chống gõ bậy bạ */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
