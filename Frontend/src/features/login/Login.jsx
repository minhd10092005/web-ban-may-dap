import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // ✅ FIX: chỉ check token khi đang ở trang login + check expire
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || location.pathname !== "/login") return;

    try {
      const decoded = jwtDecode(token);

      const currentTime = Date.now() / 1000;

      // ❌ token hết hạn → xoá
      if (decoded.exp < currentTime) {
        localStorage.removeItem("token");
        return;
      }

      const userRole =
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
        decoded.role;

      // ✅ redirect đúng role
      if (userRole === "Admin" || userRole === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/candidate", { replace: true });
      }
      // eslint-disable-next-line no-unused-vars
    } catch (e) {
      localStorage.removeItem("token");
    }
  }, [navigate, location]);

  // ✅ LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axios.post(
        "https://localhost:7263/api/Auth/login",
        {
          Email: email,
          Password: password,
        }
      );

      const token = response.data.token;
      localStorage.setItem("token", token);

      const decoded = jwtDecode(token);

      const userRole =
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
        decoded.role;

      // ✅ redirect sau login
      if (userRole === "Admin" || userRole === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/candidate", { replace: true });
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      setMessage("❌ Đăng nhập thất bại. Kiểm tra lại Email/Mật khẩu!");
    }
  };

  return (
<div className="min-h-screen pt-24 bg-gradient-to-br from-sky-100 via-white to-blue-200 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/30">

        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Đăng nhập hệ thống
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Nhập email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white/70
            focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500
            transition shadow-sm"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu
            </label>
            <input
              type="password"
              placeholder="Nhập mật khẩu..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white/70
            focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500
            transition shadow-sm"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 
          text-white font-semibold text-lg shadow-lg
          hover:from-sky-600 hover:to-blue-700
          active:scale-[0.97] transition-all"
          >
            Đăng nhập
          </button>
        </form>

        {/* Error */}
        {message && (
          <div className="mt-5 text-center bg-red-100 text-red-700 py-2 px-3 rounded-lg text-sm">
            {message}
          </div>
        )}

        {/* Register */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Chưa có tài khoản?{" "}
          <Link
            to="/register"
            className="text-sky-600 font-semibold hover:underline"
          >
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}