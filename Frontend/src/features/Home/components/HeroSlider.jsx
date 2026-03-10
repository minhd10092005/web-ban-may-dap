import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './HeroSlider.css';

// Import ảnh từ thư mục src/assets/imgs
import img1 from "../../../assets/imgs/1.jpg";
import img2 from "../../../assets/imgs/2.jpg";
import img3 from "../../../assets/imgs/3.jpg";
import img4 from "../../../assets/imgs/4.jpg";
import img5 from "../../../assets/imgs/5.jpg";

const HeroSlider = () => {
    const banners = [
        {
            id: 1,
            image: img1,
            title: "TIÊU CHUẨN ĐỨC",
            desc: "Chế tạo tại Việt Nam - Giải pháp công nghệ dược phẩm hàng đầu."
        },
        {
            id: 2,
            image: img2,
            title: "CÔNG NGHỆ HIỆN ĐẠI",
            desc: "Hệ thống máy dập viên và đóng gói tự động đạt chuẩn GMP."
        },
        { id: 3, image: img3, title: "DỊCH VỤ CHUYÊN NGHIỆP", desc: "Hỗ trợ kỹ thuật và bảo trì 24/7 trên toàn quốc." },
        { id: 4, image: img4, title: "ĐỐI TÁC TIN CẬY", desc: "Đồng hành cùng sự phát triển của ngành dược Việt Nam." },
        { id: 5, image: img5, title: "XUẤT KHẨU TOÀN CẦU", desc: "Sản phẩm Tiến Tuấn đã có mặt tại hơn 20 quốc gia." }
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
                            {/* Ảnh nền slide */}
                            <img src={item.image} alt={`Banner ${item.id}`} className="slider-img" />

                            {/* Lớp phủ đen mờ và nội dung chữ */}
                            <div className="slide-overlay">
                                <div className="slide-content">
                                    <h2 className="animate-title">{item.title}</h2>
                                    <p className="animate-desc">{item.desc}</p>
                                    <button className="btn-detail">XEM CHI TIẾT</button>
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