import React, { useState } from 'react';
import axios from 'axios';

const ChangePassword = () => {
    // 1. Khai báo State để quản lý Form
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [loading, setLoading] = useState(false);

    // 2. Hàm xử lý khi nhập liệu
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 3. Hàm xử lý gửi Form (Gọi API trực tiếp tại đây)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: '', msg: '' });

        // Kiểm tra khớp mật khẩu mới (Validate nhẹ ở Frontend)
        if (formData.newPassword !== formData.confirmPassword) {
            setStatus({ type: 'error', msg: 'Mật khẩu mới không khớp!' });
            return;
        }

        setLoading(true);
        try {
            // Lấy token từ localStorage
            const token = localStorage.getItem('token');

            // Gọi thẳng API bằng Axios
            const res = await axios.post(
                "https://localhost:7263/api/ChangePassword",
                {
                    oldPassword: formData.oldPassword,
                    newPassword: formData.newPassword
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setStatus({ type: 'success', msg: res.data.message });
            setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' }); // Reset form
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Đã có lỗi xảy ra!";
            setStatus({ type: 'error', msg: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    // 4. Giao diện (CSS Inline cho nhanh)
    return (
        <div style={containerStyle}>
            <h2 style={{ textAlign: 'center' }}>🔐 Đổi mật khẩu</h2>

            <form onSubmit={handleSubmit}>
                <div style={groupStyle}>
                    <label>Mật khẩu hiện tại</label>
                    <input type="password" name="oldPassword" required style={inputStyle}
                        value={formData.oldPassword} onChange={handleInputChange} />
                </div>

                <div style={groupStyle}>
                    <label>Mật khẩu mới</label>
                    <input type="password" name="newPassword" required style={inputStyle}
                        value={formData.newPassword} onChange={handleInputChange} />
                </div>

                <div style={groupStyle}>
                    <label>Xác nhận mật khẩu mới</label>
                    <input type="password" name="confirmPassword" required style={inputStyle}
                        value={formData.confirmPassword} onChange={handleInputChange} />
                </div>

                {status.msg && (
                    <div style={{ ...alertStyle, backgroundColor: status.type === 'success' ? '#28a745' : '#dc3545' }}>
                        {status.msg}
                    </div>
                )}

                <button type="submit" disabled={loading} style={buttonStyle}>
                    {loading ? 'Đang xử lý...' : 'Cập nhật mật khẩu'}
                </button>
            </form>
        </div>
    );
};

// --- CSS Styles ---
const containerStyle = { maxWidth: '400px', margin: '50px auto', padding: '25px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: '12px', background: '#fff' };
const groupStyle = { marginBottom: '15px' };
const inputStyle = { width: '100%', padding: '10px', marginTop: '5px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' };
const alertStyle = { padding: '10px', marginBottom: '15px', borderRadius: '6px', color: '#fff', textAlign: 'center', fontSize: '14px' };
const buttonStyle = { width: '100%', padding: '12px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };

export default ChangePassword;