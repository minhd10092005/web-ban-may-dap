import { useState } from "react";
import axios from "axios";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  Link,
} from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// ==========================================
// 1. GIAO DIỆN DÀNH CHO ADMIN
// ==========================================
function AdminDashboard() {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-center items-center p-6 text-center">
      <h1 className="text-5xl font-extrabold text-neutral-900 flex items-center gap-4">
        <span role="img" aria-label="crown" className="text-6xl">
          👑
        </span>
        KHU VỰC QUẢN TRỊ (ADMIN)
      </h1>
      <p className="text-xl text-neutral-600 mt-6 max-w-2xl">
        Chào mừng sếp! Tại đây sếp có thể quản lý hệ thống, duyệt ứng viên, và
        xem báo cáo. Hệ thống đang sẵn sàng cho lệnh của sếp.
      </p>
      <button
        onClick={() => {
          localStorage.clear();
          window.location.href = "/";
        }}
        className="mt-12 px-10 py-4 bg-red-600 text-white font-semibold text-lg rounded-2xl shadow-md hover:bg-red-700 transition"
      >
        Đăng Xuất
      </button>
    </div>
  );
}

// ==========================================
// 2. GIAO DIỆN DÀNH CHO CANDIDATE
// ==========================================
function CandidateDashboard() {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-center items-center p-6 text-center">
      <h1 className="text-5xl font-extrabold text-neutral-900 flex items-center gap-4">
        <span
          role="img"
          aria-label="candidate"
          className="text-6xl text-purple-600"
        >
          👤
        </span>
        KHU VỰC ỨNG VIÊN
      </h1>
      <p className="text-xl text-neutral-600 mt-6 max-w-2xl">
        Chào bạn! Rất vui được gặp lại bạn. Hãy cập nhật hồ sơ cá nhân và kiểm
        tra các thông báo mới nhất nhé.
      </p>
      <button
        onClick={() => {
          localStorage.clear();
          window.location.href = "/";
        }}
        className="mt-12 px-10 py-4 bg-sky-600 text-white font-semibold text-lg rounded-2xl shadow-md hover:bg-sky-700 transition"
      >
        Đăng Xuất
      </button>
    </div>
  );
}

// ==========================================
// 3. GIAO DIỆN ĐĂNG KÝ (TẠO TÀI KHOẢN MỚI)
// ==========================================
function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("❌ Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      const response = await axios.post(
        "https://localhost:7263/api/Auth/register",
        {
          email: email,
          password: password,
        },
      );

      setMessage("✅ Đăng ký thành công! Đang chuyển về trang Đăng nhập...");

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        "❌ Đăng ký thất bại. Vui lòng thử lại!";
      setMessage(errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 flex flex-col justify-center p-6">
      <div className="max-w-md w-full mx-auto bg-white p-10 rounded-3xl shadow-lg">
        <h2 className="text-center text-4xl font-bold mb-10 text-neutral-900">
          ĐĂNG KÝ TÀI KHOẢN
        </h2>

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="relative">
            <label className="block text-sm font-medium mb-1.5 text-neutral-700">
              Email
            </label>
            <input
              type="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-5 py-3.5 rounded-xl border border-neutral-300 bg-neutral-50 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium mb-1.5 text-neutral-700">
              Mật khẩu
            </label>
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-5 py-3.5 rounded-xl border border-neutral-300 bg-neutral-50 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium mb-1.5 text-neutral-700">
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-5 py-3.5 rounded-xl border border-neutral-300 bg-neutral-50 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
            />
          </div>
          <button
            type="submit"
            className="w-full px-5 py-3.5 rounded-xl bg-sky-600 text-white font-semibold text-lg hover:bg-sky-700 transition flex items-center justify-center gap-2 shadow-md"
          >
            Đăng Ký
          </button>
        </form>

        {message && (
          <div
            className={`mt-6 text-center p-3 rounded-lg text-sm ${message.includes("✅") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
          >
            {message}
          </div>
        )}

        <p className="mt-10 text-center text-neutral-600">
          Đã có tài khoản?{" "}
          <Link
            to="/"
            className="text-sky-600 font-medium hover:text-sky-700 transition underline underline-offset-4"
          >
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
}

// ==========================================
// 4. GIAO DIỆN ĐĂNG NHẬP (TRANG CHỦ)
// ==========================================
function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://localhost:7263/api/Auth/login",
        {
          email: email,
          password: password,
        },
      );

      const token = response.data.token;
      localStorage.setItem("token", token);

      const decoded = jwtDecode(token);
      const userRole =
        decoded[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ] || decoded.role;

      if (userRole === "Admin" || userRole === "admin") {
        navigate("/admin");
      } else {
        navigate("/candidate");
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        "❌ Đăng nhập thất bại. Vui lòng kiểm tra lại!";
      setMessage(errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 flex flex-col justify-center p-6">
      <div className="max-w-md w-full mx-auto bg-white p-10 rounded-3xl shadow-lg">
        <h2 className="text-center text-4xl font-bold mb-10 text-neutral-900">
          ĐĂNG NHẬP HỆ THỐNG
        </h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <label className="block text-sm font-medium mb-1.5 text-neutral-700">
              Email
            </label>
            <input
              type="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-5 py-3.5 rounded-xl border border-neutral-300 bg-neutral-50 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium mb-1.5 text-neutral-700">
              Mật khẩu
            </label>
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-5 py-3.5 rounded-xl border border-neutral-300 bg-neutral-50 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
            />
          </div>
          <button
            type="submit"
            className="w-full px-5 py-3.5 rounded-xl bg-sky-600 text-white font-semibold text-lg hover:bg-sky-700 transition flex items-center justify-center gap-2 shadow-md"
          >
            Đăng Nhập
          </button>
        </form>

        {message && (
          <div className="mt-6 text-center bg-red-100 text-red-800 p-3 rounded-lg text-sm">
            {message}
          </div>
        )}

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

// ==========================================
// 5. BỘ ĐỊnh TUYẾN CHÍNH (APP ROUTER)
// ==========================================
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/candidate" element={<CandidateDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
