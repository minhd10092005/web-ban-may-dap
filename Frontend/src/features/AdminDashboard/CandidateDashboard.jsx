import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CandidateDashboard.css"; 

export default function CandidateDashboard() {
  const [formData, setFormData] = useState({
    email: "", // Lưu email để hiển thị
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
      if (!token) { navigate("/login"); return; }

      try {
        const response = await axios.get(
          "https://localhost:7263/api/Candidate/profile",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = response.data;
        setFormData({
          email: data.email || "",
          full_name: data.full_name || "",
          phone: data.phone || "",
          address: data.address || "",
          resume_url: data.resume_url || "",
        });

        // Nếu là tài khoản mới (chưa có tên), bắt mở Form sửa luôn
        if (!data.full_name) setIsEditing(true);

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

  // 2. XỬ LÝ NHẬP LIỆU (Dùng chung cho tất cả các ô)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 3. LƯU HỒ SƠ
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "https://localhost:7263/api/Candidate/update-profile",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("✅ Cập nhật hồ sơ thành công!");
      setIsEditing(false);
      setTimeout(() => setMessage(""), 3000); 
    } catch  {
      setMessage("❌ Lưu thất bại. Vui lòng thử lại.");
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
          <div className={`alert-message ${message.includes("✅") ? "alert-success" : "alert-error"}`}>
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