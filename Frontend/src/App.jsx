// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// import AdminLayout          from './features/admin/components/AdminLayout';
// import ProductManager       from './features/admin/pages/ProductManager';
// import CategoryManager      from './features/admin/pages/CategoryManager';
// import ProductDetailManager from './features/admin/pages/ProductDetailManager';
// import ProductImageManager  from './features/admin/pages/ProductImageManager';
// import AdminManager         from './features/admin/pages/AdminManager';
// import UserManager          from './features/admin/pages/UserManager';
// import QuoteManager         from './features/admin/pages/QuoteManager';
// import CandidateProfileManager from './features/admin/pages/CandidateProfileManager';
// import './App.css';

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* Redirect root → admin */}
//         <Route path="/" element={<Navigate to="/admin/products" replace />} />

//         {/* Admin layout wrapper (sidebar + outlet) */}
//         <Route path="/admin" element={<AdminLayout />}>
//           <Route index element={<Navigate to="products" replace />} />
//           <Route path="products"        element={<ProductManager />} />
//           <Route path="categories"      element={<CategoryManager />} />
//           <Route path="product-details" element={<ProductDetailManager />} />
//           <Route path="product-images"  element={<ProductImageManager />} />
//           <Route path="admins"          element={<AdminManager />} />
//           <Route path="users"           element={<UserManager />} />
//           <Route path="quotes"          element={<QuoteManager />} />
//           <Route path="candidate-profiles" element={<CandidateProfileManager />} />
//         </Route>
//       </Routes>

//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop
//         closeOnClick
//         pauseOnHover
//         theme="light"
//       />
//     </BrowserRouter>
//   );
// }

// export default App;


import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import ProductList from './features/products/ProductList';
import ProductDetail from './features/products/ProductDetail';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import './i18n/i18n';

// Import các component dùng chung
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import FloatingContact from './components/FloatingContact';

// Import các trang
import Home from './pages/Home';
// import ProductList from './features/products/ProductList';
// import ProductDetail from './features/products/ProductDetail';
import About from "./features/about/About";
// import Contact from "./features/contact/Contact";
import Login from "./features/login/Login";
import Register from "./features/login/Register";
import ChangePassword from "./features/login/ChangePassword";

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

          {/* <Route path="/products" element={<ProductList />} /> */}
          {/* <Route path="/product/:id" element={<ProductDetail />} /> */}
          <Route path="/san-pham" element={<Navigate to="/products" replace />} />

          <Route path="/about" element={<About />} />
          {/* <Route path="/contact" element={<Contact />} /> */}
          <Route path="/lien-he" element={<Navigate to="/contact" replace />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/change-password" element={<ChangePassword />} />

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
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

// import QuoteForm from './features/quotes/QuoteForm';

// function App() {
//   return (
//     <div>
//       <QuoteForm />
//     </div>
//   )
// }

// export default App;