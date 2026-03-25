import React from 'react';
import './NavBar.css';
import { FaHome, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // Đã thêm thư viện Link

const NavBar = () => {
    return (
        <header className="header-wrapper">
            <div className="top-bar">
                <div className="top-links">
                    <span>TIN TỨC</span>
                    <span>QUY TẮC ỨNG XỬ</span>
                    <span>MUA HÀNG</span>
                    {/* Đã sửa thành Link trỏ tới form Đăng nhập */}
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
                    <div className="nav-item has-dropdown">
                        <Link to="/about" className="main-link">VỀ CHÚNG TÔI</Link>
                        <div className="dropdown-menu">
                            <a href="#"><span>&rsaquo;</span> Giới thiệu chung</a>
                            <a href="#"><span>&rsaquo;</span> Quá trình phát triển</a>
                            <a href="#"><span>&rsaquo;</span> Hệ thống chất lượng</a>
                            <a href="#"><span>&rsaquo;</span> Chính sách bảo mật</a>
                        </div>
                    </div>

                    <Link to="/services" className="nav-item main-link">DỊCH VỤ</Link>
                    <div className="nav-item has-dropdown">
                        <Link to="/products" className="main-link">SẢN PHẨM</Link>
                        <div className="dropdown-menu">
                            <a href="#"><span>&rsaquo;</span> Xử lý nguyên liệu</a>
                            <a href="#"><span>&rsaquo;</span> Tạo hạt cốm</a>
                            <a href="#"><span>&rsaquo;</span> Tạo hạt pellet</a>
                            <a href="#"><span>&rsaquo;</span> Giải pháp trộn khô</a>
                            <a href="#"><span>&rsaquo;</span> Định hình sản phẩm</a>
                            <a href="#"><span>&rsaquo;</span> Đóng gói</a>
                            <a href="#"><span>&rsaquo;</span> Trung chuyển nguyên liệu</a>
                            <a href="#"><span>&rsaquo;</span> Giải pháp phòng độc</a>
                            <a href="#"><span>&rsaquo;</span> Giải pháp vệ sinh</a>
                            <a href="#"><span>&rsaquo;</span> Mạng Scada</a>
                            <a href="#"><span>&rsaquo;</span> Giải pháp trọn gói</a>
                        </div>
                    </div>
                    <Link to="/contact" className="nav-item main-link">LIÊN HỆ</Link>
                    <FaSearch className="search-icon" />
                </nav>
            </div>
        </header>
    );
};

export default NavBar;