import React, { useState } from 'react';
import './QuoteForm.css';

const QuoteForm = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        companyName: '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        emailAddress: '',
        phone: '',
        comments: '',
        rating: 0
    });
    const [status, setStatus] = useState({ msg: '', isError: false });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.rating === 0) return setStatus({ msg: "Vui lòng chọn sao đánh giá!", isError: true });

        try {
            const res = await fetch('https://localhost:7263/api/NganQuotes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setStatus({ msg: "Gửi phản hồi thành công! Cảm ơn bạn.", isError: false });
                setFormData({
                    fullName: '', companyName: '', address: '', city: '', state: '',
                    postalCode: '', country: '', emailAddress: '', phone: '', comments: '', rating: 0
                });
            } else {
                setStatus({ msg: "Lỗi gửi dữ liệu. Vui lòng kiểm tra API!", isError: true });
            }
        } catch (err) {
            console.error(err);
            setStatus({ msg: "Không thể kết nối Backend!", isError: true });
        }
    };

    return (
        <div className="quote-container">
            <h2 style={{textAlign: 'center'}}>PHẢN HỒI KHÁCH HÀNG</h2>
            {status.msg && <div className={`msg ${status.isError ? 'error' : 'success'}`}>{status.msg}</div>}
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Họ và Tên *</label>
                    <input name="fullName" value={formData.fullName} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Tên công ty</label>
                    <input name="companyName" value={formData.companyName} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label>Địa chỉ</label>
                    <input name="address" value={formData.address} onChange={handleChange} />
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label>Thành phố</label>
                        <input name="city" value={formData.city} onChange={handleChange} />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label>Bang/Tỉnh</label>
                        <input name="state" value={formData.state} onChange={handleChange} />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label>Mã bưu điện</label>
                        <input name="postalCode" value={formData.postalCode} onChange={handleChange} />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label>Quốc gia</label>
                        <input name="country" value={formData.country} onChange={handleChange} />
                    </div>
                </div>

                <div className="form-group">
                    <label>Email liên hệ *</label>
                    <input name="emailAddress" type="email" value={formData.emailAddress} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Số điện thoại</label>
                    <input name="phone" value={formData.phone} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label>Nội dung bình luận *</label>
                    <textarea name="comments" rows="3" value={formData.comments} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Mức độ hài lòng (Chọn sao) *</label>
                    <div className="star-rating">
                        {[1, 2, 3, 4, 5].map(s => (
                            <span 
                                key={s} 
                                className={`star ${formData.rating >= s ? 'active' : ''}`} 
                                onClick={() => setFormData({ ...formData, rating: s })}
                            >★</span>
                        ))}
                    </div>
                </div>

                <button type="submit" className="submit-btn">GỬI YÊU CẦU BÁO GIÁ</button>
            </form>
        </div>
    );
};

export default QuoteForm;