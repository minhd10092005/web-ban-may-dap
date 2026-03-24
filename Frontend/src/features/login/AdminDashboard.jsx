export default function AdminDashboard() {
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
