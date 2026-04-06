import React from 'react';
import './NavBar.css';
import { FaHome, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// 1. CHỈ CẦN import hook useTranslation từ react-i18next
import { useTranslation } from 'react-i18next';

const NavBar = () => {
    // 2. Khai báo t và i18n từ hook
    const { t, i18n } = useTranslation();

    // 3. Hàm xử lý đổi ngôn ngữ
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <header className="header-wrapper">
            <div className="top-bar">
                <div className="top-links">
                    {/* 4. Sử dụng t() để lấy nội dung từ file json */}
                    <Link to="/login" className="hover:text-sky-500 transition cursor-pointer">
                        {t('navbar.recruitment')}
                    </Link>
                </div>
                <div className="flags">
                    {/* 5. Sự kiện onClick gọi hàm changeLanguage */}
                    <span onClick={() => changeLanguage('vi')} style={{ cursor: 'pointer', margin: '0 5px' }} title="Tiếng Việt">🇻🇳</span>
                    <span onClick={() => changeLanguage('en')} style={{ cursor: 'pointer', margin: '0 5px' }} title="English">🇬🇧</span>
                    <span onClick={() => changeLanguage('hi')} style={{ cursor: 'pointer', margin: '0 5px' }} title="हिन्दी">🇮🇳</span>
                </div>
            </div>
            <div className="main-nav">
                <div className="logo-area">
                    <div className="logo-placeholder">
                        TTP
                    </div>
                    <div className="slogan">
                        <p>{t('navbar.sloganLine1')}</p>
                        <p>{t('navbar.sloganLine2')}</p>
                    </div>
                </div>
                <nav className="nav-menu">
                    <Link to="/" className="home-icon"><FaHome /></Link>

                    <Link to="/about" className="nav-item main-link">{t('navbar.menuAbout')}</Link>
                    <Link to="/services" className="nav-item main-link">{t('navbar.menuServices')}</Link>
                    <Link to="/products" className="nav-item main-link">{t('navbar.menuProducts')}</Link>
                    <Link to="/quote" className="nav-item main-link">{t('navbar.menuContact')}</Link>

                    <FaSearch className="search-icon" />
                </nav>
            </div>
        </header>
    );
};

export default NavBar;