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
        <div className="contact-container">

            {/* 4.1 TIÊU ĐỀ TRANG */}
            <div className="contact-header">
                <h1>Liên hệ</h1>
                <p className="description">Chào mừng bạn đến với Tiến Tuấn. Mọi đóng góp của bạn là động lực để chúng tôi phát triển.</p>
            </div>

            {/* 2. BẢN ĐỒ (CÓ GHIM ĐỎ TIẾN TUẤN) */}
            <div className="map-section">
                <iframe
                    title="Công ty TNHH Chế Tạo Máy Dược Phẩm Tiến Tuấn"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.923249137846!2d105.81641017504418!3d21.03575678061529!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab0d127a01e7%3A0xab069cd4eaa76ff2!2zMjg1IMSQ4buZaSBD4bqlbiwgTGnhu4V1IEdpYWksIE5n4buNYyBIw6AsIEjDoCBO4buZaSAxMDAwMDAsIFZpZXRuYW0!5e0!3m2!1sen!2s!4v1775385469622!5m2!1sen!2s1"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>

            <div className="contact-content">
                {/* 4.3 CỘT TRÁI: THÔNG TIN CÔNG TY */}
                <div className="info-card">
                    <h2>Thông tin liên hệ</h2>
                    <div className="info-item">📍 Lô IV-19 (KCN Tân Bình), Quận Tân Phú, TP. HCM</div>
                    <div className="info-item text-red">📞 Hotline: 0903 849 121</div>
                    <div className="info-item">📠 Fax: +84 28 38 152 953</div>
                    <div className="info-item">✉️ ttp@tientuan.com.vn</div>
                </div>

                {/* 4.4 CỘT PHẢI: FORM GỬI PHẢN HỒI */}
                <div className="feedback-form">
                    <h2><span>✉</span> Gửi ý kiến của bạn</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group-row">
                            <input required placeholder="Họ và tên *" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
                            <input required placeholder="Số điện thoại *" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                        </div>
                        <input required type="email" placeholder="Email *" value={formData.emailAddress} onChange={e => setFormData({ ...formData, emailAddress: e.target.value })} />

                        <div className="rating-box">
                            <span>Bạn thấy dịch vụ thế nào?</span>
                            <div className="stars">
                                {[1, 2, 3, 4, 5].map(s => (
                                    <button key={s} type="button" onClick={() => setFormData({ ...formData, rating: s })} className={formData.rating >= s ? 'active' : ''}>★</button>
                                ))}
                            </div>
                        </div>

                        <textarea required placeholder="Nhập nội dung góp ý tại đây..." rows="4" value={formData.comments} onChange={e => setFormData({ ...formData, comments: e.target.value })}></textarea>

                        {/* HIỂN THỊ THÔNG BÁO STATUS (Đã fix lỗi gạch đỏ) */}
                        {status.msg && <p style={{ color: status.isError ? '#e11d48' : '#10b981', fontWeight: 'bold', textAlign: 'center', marginBottom: '10px' }}>{status.msg}</p>}

                        <button disabled={loading} type="submit" className="btn-submit">
                            {loading ? 'ĐANG GỬI...' : 'GỬI PHẢN HỒI NGAY'}
                        </button>
                    </form>
                </div>
            </div>

            {/* 4.5 PHẦN BÌNH LUẬN KHÁCH HÀNG (CÓ LỌC & PHÂN TRANG) */}
            <div className="comments-section" id="comments-area">
                <div className="comments-header-row">
                    <h2 className="comments-title">Ý kiến khách hàng Gần Đây</h2>

                    {/* NÚT LỌC SAO */}
                    <div className="filter-bar">
                        <span>Lọc:</span>
                        {[5, 4, 3, 2, 1].map(s => (
                            <button key={s} className={`filter-btn ${filterRating === s ? 'active' : ''}`} onClick={() => setFilterRating(filterRating === s ? null : s)}>{s} ★</button>
                        ))}
                    </div>
                </div>

                {/* LƯỚI HIỂN THỊ CÁC CARD BÌNH LUẬN */}
                <div className="comments-grid">
                    {currentItems.map(item => (
                        <div key={item.id} className="comment-card-display">
                            <div className="comment-header">
                                <span className="comment-name">{item.fullName}</span>
                                <span className="comment-stars">{'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}</span>
                            </div>
                            <p className="comment-text">{item.comments}</p>
                            <span className="comment-date">{item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : ''}</span>
                        </div>
                    ))}
                </div>

                {/* CÁC NÚT BẤM CHUYỂN TRANG */}
                {totalPages > 1 && (
                    <div className="pagination">
                        <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="page-nav">Trước</button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={`page-number ${currentPage === i + 1 ? 'active' : ''}`}>{i + 1}</button>
                        ))}
                        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} className="page-nav">Sau</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuoteForm;