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
    <div className="min-h-screen pt-24 bg-[#f0f2f5] flex items-center justify-center px-4">

      <div className="w-full max-w-md">

 

        {/* Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">

          <form onSubmit={handleLogin} className="space-y-4">

            {/* Email */}
            <input
              type="email"
              placeholder="Email hoặc số điện thoại"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md 
            text-base focus:outline-none focus:border-blue-500"
            />

            {/* Password */}
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md 
            text-base focus:outline-none focus:border-blue-500"
            />

            {/* Button login */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white text-lg font-semibold 
            py-3 rounded-md hover:bg-blue-700 transition"
            >
              Đăng nhập
            </button>
          </form>

          {/* Error */}
          {message && (
            <div className="mt-4 text-center text-red-500 text-sm">
              {message}
            </div>
          )}

          {/* Divider */}
          <div className="my-4 border-t"></div>

          {/* Register */}
          <div className="text-center">
            <Link
              to="/register"
              className="inline-block bg-green-500 text-white font-semibold 
            px-4 py-2 rounded-md hover:bg-green-600 transition"
            >
              Tạo tài khoản mới
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}