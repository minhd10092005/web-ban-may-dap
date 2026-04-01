import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AdminLayout          from './features/admin/components/AdminLayout';
import ProductManager       from './features/admin/pages/ProductManager';
import CategoryManager      from './features/admin/pages/CategoryManager';
import ProductDetailManager from './features/admin/pages/ProductDetailManager';
import ProductImageManager  from './features/admin/pages/ProductImageManager';
import AdminManager         from './features/admin/pages/AdminManager';
import UserManager          from './features/admin/pages/UserManager';
import QuoteManager         from './features/admin/pages/QuoteManager';
import CandidateProfileManager from './features/admin/pages/CandidateProfileManager';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root → admin */}
        <Route path="/" element={<Navigate to="/admin/products" replace />} />

        {/* Admin layout wrapper (sidebar + outlet) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="products" replace />} />
          <Route path="products"        element={<ProductManager />} />
          <Route path="categories"      element={<CategoryManager />} />
          <Route path="product-details" element={<ProductDetailManager />} />
          <Route path="product-images"  element={<ProductImageManager />} />
          <Route path="admins"          element={<AdminManager />} />
          <Route path="users"           element={<UserManager />} />
          <Route path="quotes"          element={<QuoteManager />} />
          <Route path="candidate-profiles" element={<CandidateProfileManager />} />
        </Route>
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />
    </BrowserRouter>
  );
}

export default App;
