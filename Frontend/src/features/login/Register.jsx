import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [step, setStep] = useState(1); // 1: Nhập thông tin, 2: Nhập OTP
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // BƯỚC 1: Gọi API để Gửi OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("❌ Mật khẩu xác nhận không khớp!");
      return;
    }

    setIsLoading(true);
    setMessage("⏳ Đang kiểm tra email và gửi mã... Vui lòng đợi!");

    try {
      const response = await axios.post(
        "https://localhost:7263/api/Auth/send-otp",
        {
          email: email,
        },
      );

      setMessage("✅ " + response.data.message);
      setStep(2); // Chuyển sang màn hình nhập OTP
    } catch (error) {
      setMessage(error.response?.data?.message || "❌ Lỗi hệ thống gửi email!");
    } finally {
      setIsLoading(false);
    }
  };

  // BƯỚC 2: Gửi OTP và Thông tin để Đăng ký
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
await axios.post(
        "https://localhost:7263/api/Auth/register",
        {
          email: email,
          password: password,
          otp: otp,
        },
      );

      setMessage("✅ Đăng ký thành công! Đang chuyển trang...");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "❌ Mã OTP sai hoặc hết hạn!",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 flex flex-col justify-center p-6">
      <div className="max-w-md w-full mx-auto bg-white p-10 rounded-3xl shadow-lg">
        <h2 className="text-center text-4xl font-bold mb-10 text-neutral-900">
          ĐĂNG KÝ TÀI KHOẢN
        </h2>

        {/* FORM BƯỚC 1: NHẬP THÔNG TIN */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div className="relative">
              <label className="block text-sm font-medium mb-1.5 text-neutral-700">
                Email của bạn (Phải là email thật)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-5 py-3.5 rounded-xl border border-neutral-300 bg-neutral-50 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium mb-1.5 text-neutral-700">
                Mật khẩu
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-5 py-3.5 rounded-xl border border-neutral-300 bg-neutral-50 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium mb-1.5 text-neutral-700">
                Xác nhận mật khẩu
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-5 py-3.5 rounded-xl border border-neutral-300 bg-neutral-50 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-5 py-3.5 rounded-xl bg-sky-600 text-white font-semibold text-lg hover:bg-sky-700 disabled:opacity-50 transition shadow-md"
            >
              {isLoading ? "Đang xử lý..." : "Gửi mã OTP"}
            </button>
          </form>
        )}

        {/* FORM BƯỚC 2: NHẬP OTP */}
        {step === 2 && (
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="p-4 bg-sky-50 rounded-xl border border-sky-100 text-center">
              <p className="text-sm text-sky-800">
                Chúng tôi đã gửi một mã gồm 6 chữ số đến email:
              </p>
              <p className="font-bold text-sky-900 mt-1">{email}</p>
            </div>
            <div className="relative">
              <label className="block text-sm font-medium mb-1.5 text-neutral-700 text-center">
                Nhập mã OTP
              </label>
              <input
                type="text"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full px-5 py-3.5 text-center text-2xl tracking-widest font-bold rounded-xl border border-neutral-300 bg-neutral-50 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                placeholder="------"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-5 py-3.5 rounded-xl bg-green-600 text-white font-semibold text-lg hover:bg-green-700 disabled:opacity-50 transition shadow-md"
            >
              Xác nhận & Hoàn tất
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-center text-sm text-neutral-500 hover:text-neutral-800 underline"
            >
              Quay lại chỉnh sửa email
            </button>
          </form>
        )}

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
            className="text-sky-600 font-medium hover:text-sky-700 underline underline-offset-4"
          >
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
