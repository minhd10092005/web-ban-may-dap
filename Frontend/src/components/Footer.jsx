import React from 'react';
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt, FaGlobe, FaYoutube, FaTwitter, FaFacebookF, FaLinkedinIn, FaVk } from 'react-icons/fa';
import './Footer.css';

// Bro tải cái logo Bộ Công Thương (tick xanh) về lưu vào thư mục imgs nhé
import bctLogo from '../assets/imgs/bct.png';

const Footer = () => {
    return (
        <footer className="footer-section">
            {/* Thanh xám đen: Đăng ký nhận tin & Mạng xã hội */}
            <div className="footer-top">
                <div className="newsletter">
                    <span className="newsletter-label">Đăng ký nhận tin</span>
                    <div className="input-group">
                        <input type="email" placeholder="" />
                        <button type="button">Gửi</button>
                    </div>
                </div>

                <div className="social-links">
                    <span className="social-label">FOLLOW US</span>
                    <a href="#" className="social-icon"><FaYoutube /></a>
                    <a href="#" className="social-icon"><FaTwitter /></a>
                    <a href="#" className="social-icon"><FaFacebookF /></a>
                    <a href="#" className="social-icon"><FaLinkedinIn /></a>
                    <a href="#" className="social-icon"><FaVk /></a>
                </div>
            </div>

            {/* Phần thông tin công ty nền trắng */}
            <div className="footer-main">
                <div className="company-info">
                    <h3>CÔNG TY TNHH CHẾ TẠO MÁY DƯỢC PHẨM TIẾN TUẤN</h3>
                    <ul>
                        <li><FaMapMarkerAlt className="info-icon" /> Lô IV-19 (KCN Tân Bình) Đường Tây Thạnh, Phường Tây Thạnh, TP. Hồ Chí Minh</li>
                        <li><FaEnvelope className="info-icon" /> ttp@tientuan.com.vn</li>
                        <li><FaPhoneAlt className="info-icon" /> Hotline kinh doanh: 0903 849 121</li>
                        <li><FaPhoneAlt className="info-icon" /> Kinh doanh: 0902 314 079 - 0906 859 300 - 0934 098 856</li>
                        <li><FaPhoneAlt className="info-icon" /> Nhân sự: 028 38 152 951 (Ext: 200, 202)</li>
                        <li><FaPhoneAlt className="info-icon" /> Mua hàng: 028 38 152 951 (Ext: 604, 602)</li>
                        <li><FaGlobe className="info-icon" /> +84 28 38 152 953</li>
                        <li><FaGlobe className="info-icon" /> http://tientuan.com.vn</li>
                    </ul>
                </div>

                <div className="bct-logo">
                    {/* Tạm thời dùng thẻ img, bro nhớ thay ảnh thật nhé */}
                    <img src={bctLogo} alt="Đã thông báo Bộ Công Thương" onError={(e) => e.target.style.display = 'none'} />
                </div>
            </div>

            {/* Dòng Copyright dưới cùng */}
            <div className="footer-bottom">
                <p>Copyrights © 2006 Tien Tuan Pharmaceutical Machinery Co.Ltd . All right reserved</p>
                <p>Mã số Doanh Nghiệp: 03 01 47 86 32 - Cấp ngày 31/08/1998</p>
            </div>
        </footer>
    );
};

export default Footer;