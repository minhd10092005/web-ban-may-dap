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
    <div className="min-h-screen bg-neutral-100 text-neutral-900 flex flex-col justify-center p-6">
      <div className="max-w-md w-full mx-auto bg-white p-10 rounded-3xl shadow-lg">
        <h2 className="text-center text-4xl font-bold mb-10 text-neutral-900">
          ĐĂNG NHẬP HỆ THỐNG
        </h2>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1.5 text-neutral-700">
              Email
            </label>
            <input
              type="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-5 py-3.5 rounded-xl border border-neutral-300 bg-neutral-50 
              focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1.5 text-neutral-700">
              Mật khẩu
            </label>
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-5 py-3.5 rounded-xl border border-neutral-300 bg-neutral-50 
              focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full px-5 py-3.5 rounded-xl bg-sky-600 text-white font-semibold text-lg 
            hover:bg-sky-700 transition shadow-md"
          >
            Đăng Nhập
          </button>
        </form>

        {/* Message */}
        {message && (
          <div className="mt-6 text-center bg-red-100 text-red-800 p-3 rounded-lg text-sm">
            {message}
          </div>
        )}

        {/* Register */}
        <p className="mt-10 text-center text-neutral-600">
          Chưa có tài khoản?{" "}
          <Link
            to="/register"
            className="text-sky-600 font-medium hover:text-sky-700 transition underline underline-offset-4"
          >
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}