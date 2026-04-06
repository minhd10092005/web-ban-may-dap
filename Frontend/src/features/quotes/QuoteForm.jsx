import React, { useState, useEffect } from 'react';
import './QuoteForm.css';

const QuoteForm = () => {
    // ==========================================
    // PHẦN 1: KHAI BÁO CÁC BIẾN (STATE)
    // ==========================================

    // Lưu dữ liệu người dùng nhập vào Form
    const [formData, setFormData] = useState({
        fullName: '', companyName: '', emailAddress: '', phone: '',
        address: '', city: '', state: '', postalCode: '', country: '',
        comments: '', rating: 5
    });

    // Chống Spam: Lưu thời gian của lần gửi cuối cùng
    const [lastSubmitTime, setLastSubmitTime] = useState(0);

    // Quản lý bình luận: Gốc (từ API) và Hiển thị (sau khi lọc)
    const [originalComments, setOriginalComments] = useState([]);
    const [displayedComments, setDisplayedComments] = useState([]);
    const [filterRating, setFilterRating] = useState(null); // Đang lọc mấy sao?

    // Quản lý phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; // Hiện 6 cái mỗi trang

    // Trạng thái gửi Form (Thông báo thành công/lỗi, Xoay vòng loading)
    const [status, setStatus] = useState({ msg: '', isError: false });
    const [loading, setLoading] = useState(false);

    // ==========================================
    // PHẦN 2: LẤY DỮ LIỆU TỪ SERVER (API)
    // ==========================================

    const fetchComments = async () => {
        try {
            const res = await fetch('https://localhost:7263/api/NganQuotes');
            if (res.ok) {
                const data = await res.json();
                // Sắp xếp: Ai mới gửi thì hiện lên đầu (CreatedAt giảm dần)
                const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setOriginalComments(sortedData);
            }
        } catch (err) {
            console.error("Lỗi lấy dữ liệu:", err);
        }
    };

    // Tự động gọi hàm lấy dữ liệu khi vừa mở trang
    useEffect(() => {
        fetchComments();
    }, []);

    // Logic Lọc theo sao: Mỗi khi chọn lọc 1 sao, 2 sao... danh sách sẽ tự đổi
    useEffect(() => {
        let filtered = originalComments;
        if (filterRating !== null) {
            filtered = originalComments.filter(c => c.rating === filterRating);
        }
        setDisplayedComments(filtered);
        setCurrentPage(1); // Reset về trang 1 mỗi khi đổi bộ lọc
    }, [originalComments, filterRating]);

    // ==========================================
    // PHẦN 3: XỬ LÝ GỬI FORM & CHỐNG SPAM
    // ==========================================

    const handleSubmit = async (e) => {
        e.preventDefault();
        const now = Date.now();

        // KIỂM TRA SPAM: Nếu chưa đủ 30 giây kể từ lần gửi trước
        if (now - lastSubmitTime < 30000) {
            const remain = Math.ceil((30000 - (now - lastSubmitTime)) / 1000);
            setStatus({ msg: `⚠️ Spam quá nhanh! Hãy đợi ${remain} giây nữa.`, isError: true });
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('https://localhost:7263/api/NganQuotes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setStatus({ msg: '🎉 Cảm ơn bạn! Phản hồi đã được gửi thành công.', isError: false });
                setLastSubmitTime(Date.now()); // Lưu lại mốc thời gian vừa gửi thành công
                // Reset Form về trống
                setFormData({ fullName: '', companyName: '', emailAddress: '', phone: '', address: '', city: '', state: '', postalCode: '', country: '', comments: '', rating: 5 });
                fetchComments(); // Tải lại danh sách bình luận mới nhất
            } else {
                setStatus({ msg: '❌ Lỗi server, gửi không thành công!', isError: true });
            }
        } catch (err) {
            console.error("Lỗi gửi form:", err);
            setStatus({ msg: '⚠️ Không kết nối được máy chủ!', isError: true });
        } finally {
            setLoading(false);
        }
    };

    // Tính toán số trang
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = displayedComments.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(displayedComments.length / itemsPerPage);

    // ==========================================
    // PHẦN 4: GIAO DIỆN (JSX)
    // ==========================================
    return (
        <div className="page-wrapper">
            {/* Tiêu đề trang sử dụng Page Header chuẩn của bạn */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Liên hệ & Góp ý</h1>
                    <p className="page-subtitle">Chào mừng bạn đến với Tiến Tuấn. Mọi đóng góp của bạn là động lực để chúng tôi phát triển.</p>
                </div>
            </div>

            {/* Bản đồ bọc trong Card để có Radius và Shadow đẹp */}
            <div className="card" style={{ marginBottom: 'var(--sp-8)', overflow: 'hidden', height: '400px' }}>
                <iframe
                    title="Bản đồ"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.066487504368!2d106.6111306!3d10.8062323!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752be351336187%3A0x6335134700d89f8!2sTi%E1%BA%BFn%20Tu%E1%BA%A5n%20Pharmaceutical%20Machinery!5e0!3m2!1svi!2s!4v1712410000000!5m2!1svi!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                ></iframe>
            </div>

            <div className="toolbar" style={{ alignItems: 'stretch', gap: 'var(--sp-6)' }}>
                {/* Cột Trái: Thông tin liên hệ (Dùng Card) */}
                <div className="card" style={{ flex: '1', padding: 'var(--sp-6)', background: 'var(--accent)', color: 'white' }}>
                    <h2 style={{ marginBottom: 'var(--sp-4)', fontSize: '1.25rem' }}>Thông tin liên hệ</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
                        <p>📍 Lô IV-19 (KCN Tân Bình), Quận Tân Phú, TP. HCM</p>
                        <p style={{ fontWeight: 'bold' }}>📞 Hotline: 0903 849 121</p>
                        <p>📠 Fax: +84 28 38 152 953</p>
                        <p>✉️ ttp@tientuan.com.vn</p>
                    </div>
                </div>

                {/* Cột Phải: Form (Dùng Card và Field chuẩn) */}
                <div className="card" style={{ flex: '1.5', padding: 'var(--sp-6)' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
                        <div style={{ display: 'flex', gap: 'var(--sp-4)' }}>
                            <div className="field" style={{ flex: 1 }}>
                                <label className="field-label">Họ và tên <span className="req">*</span></label>
                                <input className="field-input" required value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
                            </div>
                            <div className="field" style={{ flex: 1 }}>
                                <label className="field-label">Số điện thoại <span className="req">*</span></label>
                                <input className="field-input" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                            </div>
                        </div>

                        <div className="field">
                            <label className="field-label">Email <span className="req">*</span></label>
                            <input className="field-input" type="email" required value={formData.emailAddress} onChange={e => setFormData({ ...formData, emailAddress: e.target.value })} />
                        </div>

                        <div className="field">
                            <label className="field-label">Đánh giá dịch vụ</label>
                            <div style={{ display: 'flex', gap: 'var(--sp-2)', fontSize: '1.5rem' }}>
                                {[1, 2, 3, 4, 5].map(s => (
                                    <span
                                        key={s}
                                        onClick={() => setFormData({ ...formData, rating: s })}
                                        style={{ cursor: 'pointer', color: formData.rating >= s ? '#fbbf24' : '#e5e7eb' }}
                                    >★</span>
                                ))}
                            </div>
                        </div>

                        <div className="field">
                            <label className="field-label">Nội dung góp ý <span className="req">*</span></label>
                            <textarea className="field-input field-textarea" required rows="4" value={formData.comments} onChange={e => setFormData({ ...formData, comments: e.target.value })}></textarea>
                        </div>

                        {status.msg && (
                            <div className={status.isError ? "field-error" : ""} style={{ color: status.isError ? 'var(--danger)' : 'var(--success)' }}>
                                {status.msg}
                            </div>
                        )}

                        <button disabled={loading} type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                            {loading ? <div className="spinner" style={{ width: '18px', height: '18px', margin: 0 }}></div> : 'GỬI PHẢN HỒI'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Phần Bình luận khách hàng */}
            <div style={{ marginTop: 'var(--sp-10)' }}>
                <div className="page-header">
                    <h2 className="page-title">Ý kiến khách hàng gần đây</h2>
                    <div className="header-actions">
                        {[5, 4, 3, 2, 1].map(s => (
                            <button
                                key={s}
                                className={`page-btn ${filterRating === s ? 'active' : ''}`}
                                onClick={() => setFilterRating(filterRating === s ? null : s)}
                            >{s} ★</button>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--sp-4)' }}>
                    {currentItems.map(item => (
                        <div key={item.id} className="card" style={{ padding: 'var(--sp-5)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--sp-2)' }}>
                                <span className="col-name">{item.fullName}</span>
                                <span style={{ color: '#fbbf24' }}>{'★'.repeat(item.rating)}</span>
                            </div>
                            <p className="td-description" style={{ color: 'var(--text-secondary)', marginBottom: 'var(--sp-3)' }}>{item.comments}</p>
                            <span className="state-hint">{item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : ''}</span>
                        </div>
                    ))}
                </div>

                {/* Pagination sử dụng Class chuẩn của bạn */}
                {totalPages > 1 && (
                    <div className="pagination-bar" style={{ marginTop: 'var(--sp-6)' }}>
                        <div className="pagination-controls">
                            <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="page-btn">‹</button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}>{i + 1}</button>
                            ))}
                            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} className="page-btn">›</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuoteForm;