import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import các trang đã tách từ thư mục
import Login from "./features/login/Login";
import Register from "./features/login/Register";
import AdminDashboard from "./features/login/AdminDashboard";
import CandidateDashboard from "./features/login/CandidateDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/candidate" element={<CandidateDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
