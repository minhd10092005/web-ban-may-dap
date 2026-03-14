import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import './QualitySystem.css';

// Import ảnh của bro
import certPed from '../../../assets/imgs/1.jpg';
import certEx from '../../../assets/imgs/1.jpg';
import certTuv from '../../../assets/imgs/1.jpg';
import certCe from '../../../assets/imgs/1.jpg';

const QualitySystem = () => {
    const certs = [
        { id: 1, img: certPed, alt: "Chứng nhận PED" },
        { id: 2, img: certEx, alt: "Chứng nhận EX" },
        { id: 3, img: certTuv, alt: "Chứng nhận TUV" },
        { id: 4, img: certCe, alt: "Chứng nhận CE" },
        { id: 5, img: certPed, alt: "Chứng nhận PED" },
        { id: 6, img: certEx, alt: "Chứng nhận EX" }
    ];

    return (
        <section className="quality-section">
            <div className="quality-header">
                <h2>HỆ THỐNG QUẢN LÝ CHẤT LƯỢNG</h2>
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