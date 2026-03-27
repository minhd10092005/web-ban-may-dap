import React from 'react';
import './NavBar.css';
import { FaHome, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const NavBar = () => {
    return (
        <header className="header-wrapper">
            <div className="top-bar">
                <div className="top-links">
                    {/* Đã xóa 3 mục Tin tức, Quy tắc ứng xử, Mua hàng. Chỉ giữ lại Tuyển dụng (Login) */}
                    <Link to="/login" className="hover:text-sky-500 transition cursor-pointer">TUYỂN DỤNG</Link>
                </div>
                <div className="flags">
                    <span>🇻🇳</span>
                    <span>🇬🇧</span>
                    <span>🇷🇺</span>
                </div>
            </div>
            <div className="main-nav">
                <div className="logo-area">
                    <div className="logo-placeholder">
                        TTP
                    </div>
                    <div className="slogan">
                        <p>Tiêu chuẩn Đức</p>
                        <p>Chế tạo tại Việt Nam</p>
                    </div>
                </div>
                <nav className="nav-menu">
                    <Link to="/" className="home-icon"><FaHome /></Link>
                    
                    {/* Đã xóa menu thả xuống, biến thành link bình thường */}
                    <Link to="/about" className="nav-item main-link">VỀ CHÚNG TÔI</Link>
                    <Link to="/services" className="nav-item main-link">DỊCH VỤ</Link>
                    <Link to="/products" className="nav-item main-link">SẢN PHẨM</Link>
                    <Link to="/contact" className="nav-item main-link">LIÊN HỆ</Link>
                    
                    <FaSearch className="search-icon" />
                </nav>
            </div>
        </header>
    );
};

export default NavBar;