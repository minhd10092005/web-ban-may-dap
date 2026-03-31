import React from 'react';
import './AboutSection.css';
import factoryImg from '../../../assets/imgs/building.jpg';
// 1. Import hook useTranslation
import { useTranslation } from 'react-i18next';

const AboutSection = () => {
    // 2. Khởi tạo hàm t
    const { t } = useTranslation();

    return (
        <section className="about-section">
            <div className="about-content">
                {/* Khối chữ màu xám bị vát góc */}
                <div className="text-side">
                    <h2 className="about-title">
                        {/* 3. Thay text cứng bằng hàm t() dựa trên file vi.json của bro */}
                        {t('home.aboutSection.titleLine1')} <br />
                        {t('home.aboutSection.titleLine2')}
                    </h2>

                    <div className="quote-box">
                        <span className="quote-mark left">“</span>
                        <p>
                            {t('home.aboutSection.quoteText')}
                        </p>
                        <span className="quote-mark right">”</span>
                    </div>

                    <p className="main-desc">
                        {t('home.aboutSection.mainDesc')}
                    </p>

                    <p className="sub-desc">
                        {t('home.aboutSection.subDesc')}
                    </p>

                    <button className="btn-view-more">
                        <span className="arrow-icon">▶</span> {t('home.aboutSection.btnViewMore')}
                    </button>
                </div>

                {/* Khối hình ảnh nhà máy */}
                <div className="image-side">
                    {/* Bro có thể dịch nốt thẻ alt nếu muốn chuẩn SEO quốc tế */}
                    <img src={factoryImg} alt="Tiến Tuấn Factory" />
                </div>
            </div>
        </section>
    );
};

export default AboutSection;