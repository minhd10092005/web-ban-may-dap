import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CandidateDashboard.css"; 

export default function CandidateDashboard() {
  const [formData, setFormData] = useState({
    email: "", 
    full_name: "",
    phone: "",
    address: "",
    resume_url: "",
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false); 
  const navigate = useNavigate();

  // 1. LẤY DỮ LIỆU TỪ BACKEND
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      console.log("Token hiện tại khi vào trang:", token);
      if (!token) { navigate("/login"); return; }

      try {
        const response = await axios.get(
          "https://localhost:7263/api/Candidate/profile",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = response.data;
        console.log("Dữ liệu thực tế Backend trả về:", data); // Bro bật F12 xem cái này sẽ thấy nó viết HOA

        // CHUẨN HÓA DỮ LIỆU TẠI ĐÂY (Hứng cả Hoa và Thường)
        const fetchedData = {
          email: data.email || data.Email || "",
          full_name: data.fullName || data.FullName || data.full_name || "",
          phone: data.phone || data.Phone || "",
          address: data.address || data.Address || "",
          resume_url: data.resumeUrl || data.ResumeUrl || data.resume_url || "",
        };

        setFormData(fetchedData);

        // NẾU ĐÃ CÓ TÊN -> TẮT CHẾ ĐỘ SỬA, HIỆN BẢNG THÔNG TIN
        if (fetchedData.full_name) {
          setIsEditing(false);
        } else {
          setIsEditing(true);
        }

      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
        setMessage("❌ Không thể tải thông tin hồ sơ.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  // 2. XỬ LÝ NHẬP LIỆU
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 3. LƯU HỒ SƠ
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    // TẠO OBJECT MỚI VỚI KEY VIẾT HOA ĐỂ KHỚP VỚI DTO BACKEND
    const dataToSubmit = {
      FullName: formData.full_name,
      Phone: formData.phone,
      Address: formData.address,
      ResumeUrl: formData.resume_url
    };

    try {
      await axios.post(
        "https://localhost:7263/api/Candidate/update-profile",
        dataToSubmit, // Gửi cái dataToSubmit này thay vì formData
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("✅ Cập nhật hồ sơ thành công!");
      setIsEditing(false);
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error(error.response?.data); // In lỗi chi tiết ra console để check nếu vẫn tạch
      setMessage("❌ Lưu thất bại. Vui lòng thử lại.");
    }
  };

  // 4. HÀM GIẢ LẬP GỬI CV (Chưa gọi API)
  const handleSendCVToAdmin = () => {
    if (!formData.resume_url) {
      setMessage("⚠️ Bạn cần cập nhật Link CV trước khi gửi cho Admin!");
      setTimeout(() => setMessage(""), 3000); 
      return;
    }

    const isConfirm = window.confirm("Bạn có chắc chắn muốn nộp CV này cho Admin xét duyệt không?");
    if (isConfirm) {
      // Tạm thời chỉ hiển thị thông báo giả lập thành công
      setMessage("✅ Đã ghi nhận yêu cầu gửi CV (Đang chờ gắn API thực tế)!");
      setTimeout(() => setMessage(""), 5000); 
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <div className="dashboard-header">
          <div className="avatar-circle">🧑‍💻</div>
          <h1 className="dashboard-title">HỒ SƠ ỨNG VIÊN</h1>
          <p className="dashboard-subtitle">Quản lý thông tin tài khoản TTP của bạn</p>
        </div>

        {message && (
          <div className={`alert-message ${message.includes("✅") ? "alert-success" : (message.includes("⚠️") ? "alert-warning" : "alert-error")}`}>
            {message}
          </div>
        )}

        {isLoading ? (
          <div className="loading-container"><div className="spinner"></div></div>
        ) : !isEditing ? (
          
          /* --- GIAO DIỆN XEM (VIEW MODE) --- */
          <div className="animate-fade-in">
            <div className="profile-view-box">
              <div className="profile-row">
                <span className="profile-label">Email đăng ký</span>
                <span className="profile-value" style={{ color: '#0284c7', fontWeight: 'bold' }}>{formData.email}</span>
              </div>
              <div className="profile-row">
                <span className="profile-label">Họ và tên</span>
                <span className="profile-value">{formData.full_name || "Chưa cập nhật"}</span>
              </div>
              <div className="profile-row">
                <span className="profile-label">Số điện thoại</span>
                <span className="profile-value">{formData.phone || "Chưa cập nhật"}</span>
              </div>
              <div className="profile-row">
                <span className="profile-label">Địa chỉ</span>
                <span className="profile-value">{formData.address || "Chưa cập nhật"}</span>
              </div>
              <div className="profile-row">
                <span className="profile-label">Hồ sơ CV</span>
                {formData.resume_url ? (
                  <a href={formData.resume_url} target="_blank" rel="noreferrer" className="link-cv">Xem CV đã nộp &rarr;</a>
                ) : <span className="text-danger">Chưa cập nhật link CV</span>}
              </div>
            </div>
            
            <div className="button-group">
              <button onClick={() => setIsEditing(true)} className="btn btn-dark">Chỉnh sửa hồ sơ</button>
              
              {/* NÚT "GỬI CV" NẰM Ở ĐÂY */}
              <button 
                onClick={handleSendCVToAdmin} 
                className="btn btn-primary" 
                style={{ backgroundColor: '#10b981', color: 'white', border: 'none' }} 
              >
                Gửi CV cho Admin
              </button>
              
                <button
                  onClick={() => navigate("/change-password")}
                  className="btn btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}
                >
                  🔒 Đổi mật khẩu
                </button>

              <button onClick={handleLogout} className="btn btn-danger-light">Đăng xuất</button>
            </div>
          </div>

        ) : (

          /* --- GIAO DIỆN SỬA (EDIT MODE) --- */
          <form onSubmit={handleFormSubmit} className="animate-fade-in">
            <div className="form-group">
              <label className="form-label">Email (Không thể thay đổi)</label>
              <input 
                type="text" 
                value={formData.email} 
                readOnly 
                className="form-input" 
                style={{ backgroundColor: '#f3f4f6', color: '#6b7280', cursor: 'not-allowed' }} 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Họ và tên</label>
              <input type="text" name="full_name" value={formData.full_name} onChange={handleInputChange} required className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Số điện thoại</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Địa chỉ</label>
              <input type="text" name="address" value={formData.address} onChange={handleInputChange} required className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Link CV (Drive/TopCV)</label>
              <input type="url" name="resume_url" value={formData.resume_url} onChange={handleInputChange} className="form-input" placeholder="https://..." />
            </div>
            <div className="button-group">
              <button type="button" onClick={() => setIsEditing(false)} className="btn btn-secondary">Hủy bỏ</button>
              <button type="submit" className="btn btn-primary">Lưu thay đổi</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}