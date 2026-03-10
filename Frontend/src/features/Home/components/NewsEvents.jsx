import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import './NewsEvents.css';

// Dùng tạm ảnh có sẵn để không bị lỗi trắng trang
import news1 from '../../../assets/imgs/1.jpg';
import news2 from '../../../assets/imgs/2.jpg';
import news3 from '../../../assets/imgs/3.jpg';

const NewsEvents = () => {
    // Dữ liệu mẫu giống trong ảnh bro gửi
    const newsList = [
        {
            id: 1, img: news1, category: "Sự kiện & Hội chợ",
            title: "LỜI MỜI THAM DỰ PHARMA ASIA 2025",
            desc: "Một trong những triển lãm quốc tế quan trọng nhất về giải pháp sản xuất và chế biến dược phẩm tại Pakistan."
        },
        {
            id: 2, img: news2, category: "Sự kiện & Hội chợ",
            title: "TIẾN TUẤN ĐÃ HOÀN THÀNH KIỂM TRA FAT CHO MÁY ÉP VỈ TỰ ĐỘNG CP-250",
            desc: "Dòng máy được ưa chuộng nhất hiện nay trong ngành dược phẩm, tại nhà máy Tiến Tuấn Pharmaceutical Machinery Co. Ltd..."
        },
        {
            id: 3, img: news3, category: "Sự kiện & Hội chợ",
            title: "FAT THÀNH CÔNG MÁY NGHIỀN BÚA FM-800I – ĐÁP ỨNG YÊU CẦU NGHIÊM NGẶT...",
            desc: "Tiến Tuấn đã hoàn tất buổi FAT cho máy nghiền búa FM-800i chuyên dùng để xay đường trong sản xuất dược phẩm..."
        },
        // Thêm 1 bài nữa để có cái mà trượt
        {
            id: 4, img: news1, category: "Tin tức công ty",
            title: "ĐẠI HỘI CỔ ĐÔNG THƯỜNG NIÊN NĂM 2026",
            desc: "Công ty Tiến Tuấn tổ chức thành công đại hội cổ đông thường niên, đề ra phương hướng phát triển mới..."
        }
    ];

    return (
        <section className="news-section">
            <h2 className="news-title">TIN TỨC & SỰ KIỆN</h2>

            <div className="news-container">
                <Swiper
                    modules={[Navigation]}
                    spaceBetween={30}
                    slidesPerView={3} // Hiển thị 3 cột
                    // Link 2 nút custom của mình vào chức năng điều hướng của Swiper
                    navigation={{
                        prevEl: '.news-nav-prev',
                        nextEl: '.news-nav-next',
                    }}
                    breakpoints={{
                        320: { slidesPerView: 1 }, // Mobile 1 cột
                        768: { slidesPerView: 2 }, // Tablet 2 cột
                        1024: { slidesPerView: 3 },// PC 3 cột
                    }}
                    className="news-swiper"
                >
                    {newsList.map((item) => (
                        <SwiperSlide key={item.id}>
                            <div className="news-card">
                                <div className="news-image">
                                    <img src={item.img} alt={item.title} />
                                </div>
                                <div className="news-content">
                                    <span className="news-category">{item.category}</span>
                                    <h3>{item.title}</h3>
                                    <p>{item.desc}</p>
                                    <a href="#" className="read-more">Xem thêm</a>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* 2 Nút điều hướng màu xám nằm dưới cùng */}
                <div className="news-custom-nav">
                    <div className="news-nav-prev">◀</div>
                    <div className="news-nav-next">▶</div>
                </div>
            </div>
        </section>
    );
};

export default NewsEvents;