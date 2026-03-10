import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Global Components (Dùng chung cho mọi trang)
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';

// Import các Trang (Pages)
import Home from './pages/Home';
// Ví dụ sau này bro tạo thêm trang Sản phẩm:
// import Products from './pages/Products'; 

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navbar nằm ngoài Routes: Lúc nào cũng hiện diện ở trên nóc */}
        <Navbar />

        {/* Khúc giữa này sẽ biến đổi tùy theo URL (đường dẫn) */}
        <Routes>
          {/* Nếu URL là trang chủ "/" -> Hiển thị cục Home */}
          <Route path="/" element={<Home />} />

          {/* Nếu URL là "/san-pham" -> Hiển thị cục Products */}
          <Route path="/san-pham" element={<div>Đây là trang Sản Phẩm (Đang xây dựng)</div>} />

          {/* Nếu URL là "/lien-he" -> Hiển thị cục Contact */}
          <Route path="/lien-he" element={<div>Đây là trang Liên Hệ (Đang xây dựng)</div>} />
        </Routes>

        {/* Footer nằm ngoài Routes: Lúc nào cũng hiện diện ở dưới đáy */}
        <Footer />
        <BackToTop />
      </div>
    </Router>
  );
}

export default App;