export default function CandidateDashboard() {
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
