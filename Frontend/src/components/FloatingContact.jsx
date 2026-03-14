import React from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import './FloatingContact.css';

const FloatingContact = () => {
    return (
        <div className="floating-contact-bar">
            {/* Nút Gọi điện */}
            <a href="tel:0903849121" className="contact-item">
                <div className="contact-content">
                    <span className="contact-label">0903 849 121</span>
                    <div className="icon-wrapper"><FaPhoneAlt /></div>
                </div>
            </a>

            {/* Nút Zalo */}
            <a href="https://zalo.me/0903849121" target="_blank" rel="noreferrer" className="contact-item">
                <div className="contact-content">
                    <span className="contact-label">Chat Zalo ngay</span>
                    <div className="icon-wrapper zalo-icon"><span>Zalo</span></div>
                </div>
            </a>

            {/* Nút Email */}
            <a href="mailto:ttp@tientuan.com.vn" className="contact-item">
                <div className="contact-content">
                    <span className="contact-label">ttp@tientuan.com.vn</span>
                    <div className="icon-wrapper"><FaEnvelope /></div>
                </div>
            </a>

            {/* Nút Bản đồ */}
            <a href="#" className="contact-item">
                <div className="contact-content">
                    <span className="contact-label">Xem bản đồ</span>
                    <div className="icon-wrapper"><FaMapMarkerAlt /></div>
                </div>
            </a>
        </div>
    );
};

export default FloatingContact;