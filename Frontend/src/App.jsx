<<<<<<< HEAD
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import Global Components (Dùng chung cho mọi trang)
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import FloatingContact from './components/FloatingContact';

// Import các Trang (Pages)
import Home from './pages/Home';

// Import component từ thư mục features
import ProductList from './features/products/ProductList';
import ProductDetail from './features/products/ProductDetail';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navbar nằm ngoài Routes: Lúc nào cũng hiện diện ở trên nóc */}
        <Navbar />

        {/* Khúc giữa này sẽ biến đổi tùy theo URL (đường dẫn) */}
        <Routes>
          {/* Trang chủ (Bảo toàn trang Home tuyệt đẹp vừa code xong) */}
          <Route path="/" element={<Home />} />

          {/* Route danh sách và chi tiết sản phẩm (Lấy từ code mới) */}
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />

          {/* Nếu gõ tiếng Việt /san-pham thì tự động bẻ lái sang /products */}
          <Route path="/san-pham" element={<Navigate to="/products" replace />} />

          {/* Trang Liên Hệ (Tạm thời) */}
          <Route path="/lien-he" element={
            <div style={{ padding: '150px 0', textAlign: 'center', fontSize: '24px' }}>
              Đây là trang Liên Hệ (Đang xây dựng)
            </div>
          } />
        </Routes>

        {/* Footer nằm ngoài Routes: Lúc nào cũng hiện diện ở dưới đáy */}
        <Footer />

        {/* Các công cụ lơ lửng */}
        <FloatingContact />
        <BackToTop />
      </div>
    </Router>
=======
import { BrowserRouter, Routes, Route } from "react-router-dom";
import About from "./features/about/About";
import Contact from "./features/contact/Contact";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
>>>>>>> 01b581039d261a092ea10797170a4308931fac48
  );
}

export default App;