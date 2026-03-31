import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
// 1. Import hook dịch thuật
import { useTranslation } from 'react-i18next';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './HeroSlider.css';

// Import ảnh
import img1 from "../../../assets/imgs/artboard-3.jpg";
import img2 from "../../../assets/imgs/artboard-8.jpg";
import img3 from "../../../assets/imgs/banner-51.jpg";
import img4 from "../../../assets/imgs/granulation-line-200kg-at1.jpg";
import img5 from "../../../assets/imgs/dc-am-tuong.jpg";

const HeroSlider = () => {
    // 2. Khai báo hàm t
    const { t } = useTranslation();

    const banners = [
        {
            id: 1,
            image: img1,
            title: t('home.heroSlider.slide1.title'),
            desc: t('home.heroSlider.slide1.desc')
        },
        {
            id: 2,
            image: img2,
            title: t('home.heroSlider.slide2.title'),
            desc: t('home.heroSlider.slide2.desc')
        },
        {
            id: 3,
            image: img3,
            title: t('home.heroSlider.slide3.title'),
            desc: t('home.heroSlider.slide3.desc')
        },
        {
            id: 4,
            image: img4,
            title: t('home.heroSlider.slide4.title'),
            desc: t('home.heroSlider.slide4.desc')
        },
        {
            id: 5,
            image: img5,
            title: t('home.heroSlider.slide5.title'),
            desc: t('home.heroSlider.slide5.desc')
        }
    ];

    return (
        <div className="hero-slider-container">
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={0}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                loop={true}
                className="mySwiper"
            >
                {banners.map((item) => (
                    <SwiperSlide key={item.id}>
                        <div className="slide-item">
                            <img src={item.image} alt={`Banner ${item.id}`} className="slider-img" />

                            <div className="slide-overlay">
                                <div className="slide-content">
                                    <h2 className="animate-title">{item.title}</h2>
                                    <p className="animate-desc">{item.desc}</p>
                                    {/* Dịch nốt cái nút bấm */}
                                    <button className="btn-detail">{t('home.heroSlider.btnDetail')}</button>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default HeroSlider;