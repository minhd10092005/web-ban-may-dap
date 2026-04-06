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
    <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: 'var(--sp-8)' }}>

        {/* Title Section */}
        <div className="page-header" style={{ textAlign: 'center', marginBottom: 'var(--sp-8)', display: 'block' }}>
          <h2 className="page-title" style={{ fontSize: '1.75rem', textAlign: 'center' }}>
            Đăng nhập hệ thống
          </h2>
          <p className="page-subtitle" style={{ textAlign: 'center' }}>
            Vui lòng nhập thông tin để truy cập quản trị
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>

          {/* Email Field */}
          <div className="field">
            <label className="field-label">
              Email <span className="req">*</span>
            </label>
            <input
              type="email"
              placeholder="Nhập email của bạn..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="field-input"
            />
          </div>

          {/* Password Field */}
          <div className="field">
            <label className="field-label">
              Mật khẩu <span className="req">*</span>
            </label>
            <input
              type="password"
              placeholder="Nhập mật khẩu..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="field-input"
            />
          </div>

          {/* Error Message - Sử dụng style danger của bạn */}
          {message && (
            <div className="field-error" style={{
              background: 'var(--danger-bg)',
              padding: 'var(--sp-3)',
              borderRadius: 'var(--r-md)',
              border: '1px solid #fca5a5'
            }}>
              <span style={{ fontSize: '1.2rem' }}>⚠️</span>
              {message}
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: 'var(--sp-2)', padding: '12px' }}
          >
            Đăng nhập vào hệ thống
          </button>
          <Link 
          to="/loginAdmin" 
          className="btn btn-ghost" 
          style={{ width: '100%', justifyContent: 'center', fontSize: '0.875rem' }}
        >
          🔑 Truy cập quyền Quản trị
        </Link>
        </form>

        {/* Register Link */}
        <div style={{ marginTop: 'var(--sp-6)', textAlign: 'center' }}>
          <p className="page-subtitle">
            Chưa có tài khoản?{" "}
            <Link
              to="/register"
              style={{
                color: 'var(--accent)',
                fontWeight: '600',
                textDecoration: 'none'
              }}
              onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
              onMouseOut={(e) => e.target.style.textDecoration = 'none'}
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}