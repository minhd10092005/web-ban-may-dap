import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import component từ thư mục features
import ProductList from './features/products/ProductList';
import ProductDetail from './features/products/ProductDetail';

function App() {
    return (
        <Router>
            <Routes>
                {/* Tự động chuyển hướng từ gốc sang /products */}
                <Route path="/" element={<Navigate to="/products" replace />} />

                {/* Route danh sách và chi tiết */}
                <Route path="/products" element={<ProductList />} />
                <Route path="/products/:id" element={<ProductDetail />} />
            </Routes>
        </Router>
    );
}

export default App;