import React from 'react';
import './NavBar.css';
import { FaHome, FaSearch } from 'react-icons/fa';

const NavBar = () => {
    return (
        <header className="header-wrapper">

            { }
            <div className="top-bar">
                <div className="top-links">
                    <span>TIN TỨC</span>
                    <span>QUY TẮC ỨNG XỬ</span>
                    <span>MUA HÀNG</span>
                    <span>TUYỂN DỤNG</span>
                </div>
                <div className="flags">
                    { }
                    <span>🇻🇳</span>
                    <span>🇬🇧</span>
                    <span>🇷🇺</span>
                </div>
            </div>

            { }
            <div className="main-nav">

                { }
                <div className="logo-area">
                    <div className="logo-placeholder">
                        { }
                        TTP
                    </div>
                    <div className="slogan">
                        <p>Tiêu chuẩn Đức</p>
                        <p>Chế tạo tại Việt Nam</p>
                    </div>
                </div>
                { }
                <nav className="nav-menu">
                    <a href="/" className="home-icon"><FaHome /></a>
                    <a href="/about">VỀ CHÚNG TÔI</a>
                    <a href="/services">DỊCH VỤ</a>
                    <a href="/products">SẢN PHẨM</a>
                    <a href="/contact">LIÊN HỆ</a>
                    <FaSearch className="search-icon" />
                </nav>

            </div>

        </header>
    );
};

export default NavBar;