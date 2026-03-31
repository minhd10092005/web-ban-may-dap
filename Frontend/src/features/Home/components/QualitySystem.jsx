import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import './QualitySystem.css';
// 1. Import hook dịch thuật
import { useTranslation } from 'react-i18next';

// Import ảnh của bro
import certPed from '../../../assets/imgs/qualyti01.jpg';
import certEx from '../../../assets/imgs/qualyti02.jpg';
import certTuv from '../../../assets/imgs/qualyti03.jpg';
import certCe from '../../../assets/imgs/qualyti04.jpg';

const QualitySystem = () => {
    // 2. Khai báo hàm t
    const { t } = useTranslation();

    const certs = [
        { id: 1, img: certPed, alt: t('home.qualitySystem.certs.ped') },
        { id: 2, img: certEx, alt: t('home.qualitySystem.certs.ex') },
        { id: 3, img: certTuv, alt: t('home.qualitySystem.certs.tuv') },
        { id: 4, img: certCe, alt: t('home.qualitySystem.certs.ce') },
        // Lặp lại nhưng vẫn dùng hàm t() để đồng bộ
        { id: 5, img: certPed, alt: t('home.qualitySystem.certs.ped') },
        { id: 6, img: certEx, alt: t('home.qualitySystem.certs.ex') }
    ];

    return (
        <section className="quality-section">
            <div className="quality-header">
                {/* 3. Dịch tiêu đề chính */}
                <h2>{t('home.qualitySystem.title')}</h2>
            </div>

            <div className="cert-slider-wrapper">
                <Swiper
                    grabCursor={true}
                    spaceBetween={30}
                    breakpoints={{
                        320: { slidesPerView: 2 },
                        768: { slidesPerView: 3 },
                        1024: { slidesPerView: 4 },
                    }}
                    className="cert-swiper"
                >
                    {certs.map((cert) => (
                        <SwiperSlide key={cert.id}>
                            <div className="cert-card">
                                {/* Thẻ alt giờ đây sẽ thay đổi theo ngôn ngữ */}
                                <img src={cert.img} alt={cert.alt} />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default QualitySystem;