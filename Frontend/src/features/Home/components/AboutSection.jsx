import React from 'react';
import './AboutSection.css';
import factoryImg from '../../../assets/imgs/building.avif'; // Nhớ đường dẫn ảnh nha bro

const AboutSection = () => {
    return (
        <section className="about-section">
            <div className="about-content">
                {/* Khối chữ màu xám bị vát góc */}
                <div className="text-side">
                    <h2 className="about-title">
                        CUNG CẤP <br />
                        GIẢI PHÁP TRỌN GÓI
                    </h2>

                    <div className="quote-box">
                        <span className="quote-mark left">“</span>
                        <p>
                            Tư vấn - Thiết kế - Sản xuất - Cung cấp giải pháp cho dây chuyền sản xuất thuốc viên rắn trong ngành dược.
                        </p>
                        <span className="quote-mark right">”</span>
                    </div>

                    <p className="main-desc">
                        Công ty TNHH Chế Tạo Máy Dược Phẩm Tiến Tuấn chuyên tư vấn - thiết kế - chế tạo máy móc thiết bị tự động và cung cấp giải pháp trọn gói cho nhà máy sản xuất thuốc viên theo tiêu chuẩn cGMP, GAMP, EU-GMP, PIC/S của ngành dược.
                    </p>

                    <p className="sub-desc">
                        Với chính sách chất lượng "Tiêu chuẩn Đức - chế tạo tại Việt Nam" thiết kế hiện đại, tiên tiến, quy trình sản xuất và kiểm tra sản phẩm nghiêm ngặt...
                    </p>

                    <button className="btn-view-more">
                        <span className="arrow-icon">▶</span> XEM THÊM
                    </button>
                </div>

                {/* Khối hình ảnh nhà máy */}
                <div className="image-side">
                    <img src={factoryImg} alt="Tiến Tuấn Factory" />
                </div>
            </div>
        </section>
    );
};

export default AboutSection;