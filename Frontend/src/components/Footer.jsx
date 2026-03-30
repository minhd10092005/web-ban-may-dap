import React from 'react';
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt, FaGlobe, FaYoutube, FaTwitter, FaFacebookF, FaLinkedinIn, FaVk } from 'react-icons/fa';
import './Footer.css';
// 1. Import hook dịch thuật
import { useTranslation } from 'react-i18next';

// Nhớ kiểm tra đường dẫn ảnh bct.png nhé bro
import bctLogo from '../assets/imgs/bct.png';

const Footer = () => {
    // 2. Khai báo hàm t
    const { t } = useTranslation();

    return (
        <footer className="footer-section">
            {/* Thanh xám đen: Đăng ký nhận tin & Mạng xã hội */}
            <div className="footer-top">
                <div className="newsletter">
                    <span className="newsletter-label">{t('footer.newsletterLabel')}</span>
                    <div className="input-group">
                        <input type="email" placeholder="" />
                        <button type="button">{t('footer.btnSend')}</button>
                    </div>
                </div>

                <div className="social-links">
                    <span className="social-label">{t('footer.followUs')}</span>
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
                    {/* 3. Thay text bằng hàm t() */}
                    <h3>{t('footer.companyName')}</h3>
                    <ul>
                        <li><FaMapMarkerAlt className="info-icon" /> {t('footer.address')}</li>
                        <li><FaEnvelope className="info-icon" /> ttp@XYZ.com.vn</li>
                        <li><FaPhoneAlt className="info-icon" /> {t('footer.hotlineSales')} 0123456789</li>
                        <li><FaPhoneAlt className="info-icon" /> {t('footer.sales')} 0987654321 - 0123456789 - 09999999999</li>
                        <li><FaPhoneAlt className="info-icon" /> {t('footer.hr')} 0987654321 (Ext: 200, 202)</li>
                        <li><FaPhoneAlt className="info-icon" /> {t('footer.purchasing')} 0987654322 (Ext: 604, 602)</li>
                        <li><FaGlobe className="info-icon" /> +84 23456789</li>
                        <li><FaGlobe className="info-icon" /> http://XYZ.com.vn</li>
                    </ul>
                </div>

                <div className="bct-logo">
                    <img
                        src={bctLogo}
                        alt={t('footer.bctAlt')}
                        onError={(e) => e.target.style.display = 'none'}
                    />
                </div>
            </div>

            {/* Dòng Copyright dưới cùng */}
            <div className="footer-bottom">
                <p>{t('footer.copyright')}</p>
                <p>{t('footer.businessLicense')}</p>
            </div>
        </footer>
    );
};

export default Footer;