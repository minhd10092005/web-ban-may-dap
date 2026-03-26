import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CandidateDashboard.css"; // Nhúng file CSS vào đây

export default function CandidateDashboard() {
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    address: "",
    resume_url: "",
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          "https://localhost:7263/api/Candidate/profile",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data && response.data.full_name) {
          setFormData({
            full_name: response.data.full_name,
            phone: response.data.phone,
            address: response.data.address,
            resume_url: response.data.resume_url,
          });
          setIsEditing(false);
        } else {
          setIsEditing(true);
        }
      } catch (error) {
        console.error("❌ Lỗi khi lấy thông tin hồ sơ:", error);
        setMessage("❌ Không thể tải thông tin. Vui lòng thử lại.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    setMessage("");

    try {
      await axios.post(
        "https://localhost:7263/api/Candidate/update-profile",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("✅ Cập nhật hồ sơ thành công!");
      setIsEditing(false);
      setTimeout(() => setMessage(""), 3000); 
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật hồ sơ:", error);
      setMessage(error.response?.data?.message || "❌ Cập nhật thất bại.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="dashboard-container">
      <button onClick={handleLogout} className="btn btn-danger-light">
        Đăng xuất
      </button>
      <div className="dashboard-card">
        
        {/* HEADER */}
        <div className="dashboard-header">
          <div className="avatar-circle">
            <span role="img" aria-label="candidate">🧑‍💻</span>
          </div>
          <h1 className="dashboard-title">HỒ SƠ ỨNG VIÊN</h1>
          <p className="dashboard-subtitle">Nơi quản lý thông tin tuyển dụng TTP của bạn</p>
        </div>

        {/* THÔNG BÁO */}
        {message && (
          <div className={`alert-message ${message.includes("✅") ? "alert-success" : "alert-error"}`}>
            {message}
          </div>
        )}

        {/* NỘI DUNG CHÍNH */}
        {isLoading ? (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        ) : !isEditing ? (
          
          /* --- GIAO DIỆN 1: TRANG CÁ NHÂN (CHỈ XEM) --- */
          <div>
            <div className="profile-view-box">
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
                  <a href={formData.resume_url} target="_blank" rel="noreferrer" className="link-cv">
                    Xem CV đã nộp &rarr;
                  </a>
                ) : (
                  <span className="text-danger">Chưa có link CV</span>
                )}
              </div>
            </div>

            <div className="button-group">
              <button onClick={() => setIsEditing(true)} className="btn btn-dark">
                Chỉnh sửa hồ sơ
              </button>
              <button onClick={handleLogout} className="btn btn-danger-light">
                Đăng xuất
              </button>
            </div>
          </div>

        ) : (

          /* --- GIAO DIỆN 2: FORM CHỈNH SỬA --- */
          <form onSubmit={handleFormSubmit}>
            <div className="form-note">
              Vui lòng điền thông tin chính xác để bộ phận HR dễ dàng liên hệ với bạn nhé!
            </div>

            <div className="form-group">
              <label className="form-label">Tên đầy đủ</label>
              <input type="text" name="full_name" value={formData.full_name} onChange={handleInputChange} required className="form-input" placeholder="Nguyễn Văn A" />
            </div>
            
            <div className="form-group">
              <label className="form-label">Số điện thoại</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required className="form-input" placeholder="0912345678" />
            </div>

            <div className="form-group">
              <label className="form-label">Địa chỉ thường trú</label>
              <input type="text" name="address" value={formData.address} onChange={handleInputChange} required className="form-input" placeholder="Số 123 Đường Lê Lợi..." />
            </div>

            <div className="form-group">
              <label className="form-label">Đường dẫn CV (Google Drive, TopCV...)</label>
              <input type="url" name="resume_url" value={formData.resume_url} onChange={handleInputChange} className="form-input" placeholder="https://..." />
            </div>

            <div className="button-group">
              <button type="button" onClick={() => setIsEditing(false)} className="btn btn-secondary">
                Hủy bỏ
              </button>
              <button type="submit" className="btn btn-primary">
                Lưu thay đổi
              </button>
            </div>
          </form>

        )}
      </div>
    </div>
  );
}