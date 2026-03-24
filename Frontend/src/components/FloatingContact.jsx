import React from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import './FloatingContact.css';

const FloatingContact = () => {
    return (
        <div className="floating-contact-bar">
            {/* Nút Gọi điện */}
            <a href="tel:0123456789" className="contact-item">
                <div className="contact-content">
                    <span className="contact-label">0123 456 789</span>
                    <div className="icon-wrapper"><FaPhoneAlt /></div>
                </div>
            </a>

            {/* Nút Zalo */}
            <a href="https://zalo.me/0123456789" target="_blank" rel="noreferrer" className="contact-item">
                <div className="contact-content">
                    <span className="contact-label">Chat Zalo ngay</span>
                    <div className="icon-wrapper zalo-icon"><span>Zalo</span></div>
                </div>
            </a>

            {/* Nút Email */}
            <a href="mailto:ttp@tientuan.com.vn" className="contact-item">
                <div className="contact-content">
                    <span className="contact-label">ttp@aptech.com.vn</span>
                    <div className="icon-wrapper"><FaEnvelope /></div>
                </div>
            </a>

            {/* Nút Bản đồ */}
            <a href="https://maps.app.goo.gl/MHMAMVKowUdYBcFK6" className="contact-item" target="_blank" rel="noreferrer">
                <div className="contact-content">
                    <span className="contact-label">Xem bản đồ</span>
                    <div className="icon-wrapper"><FaMapMarkerAlt /></div>
                </div>
            </a>
        </div>
    );
};

export default FloatingContact;