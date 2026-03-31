import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { useTranslation } from 'react-i18next'; // 1. Import hook
import 'swiper/css';
import 'swiper/css/navigation';
import './NewsEvents.css';

// Dùng tạm ảnh
import news1 from '../../../assets/imgs/sp1.jpg';
import news2 from '../../../assets/imgs/sp2.jpg';
import news3 from '../../../assets/imgs/sp3.jpg';

const NewsEvents = () => {
    // 2. Khai báo hàm t
    const { t } = useTranslation();

    const newsList = [
        {
            id: 1,
            img: news1,
            category: t('home.newsEvents.news1.category'),
            title: t('home.newsEvents.news1.title'),
            desc: t('home.newsEvents.news1.desc')
        },
        {
            id: 2,
            img: news2,
            category: t('home.newsEvents.news2.category'),
            title: t('home.newsEvents.news2.title'),
            desc: t('home.newsEvents.news2.desc')
        },
        {
            id: 3,
            img: news3,
            category: t('home.newsEvents.news3.category'),
            title: t('home.newsEvents.news3.title'),
            desc: t('home.newsEvents.news3.desc')
        },
        {
            id: 4,
            img: news1,
            category: t('home.newsEvents.news4.category'),
            title: t('home.newsEvents.news4.title'),
            desc: t('home.newsEvents.news4.desc')
        }
    ];

    return (
        <section className="news-section">
            {/* Dịch tiêu đề section */}
            <h2 className="news-title">{t('home.newsEvents.title')}</h2>

            <div className="news-container">
                <Swiper
                    modules={[Navigation]}
                    spaceBetween={30}
                    slidesPerView={3}
                    navigation={{
                        prevEl: '.news-nav-prev',
                        nextEl: '.news-nav-next',
                    }}
                    breakpoints={{
                        320: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
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
                                    {/* Dịch chữ Xem thêm */}
                                    <a href="#" className="read-more">{t('home.newsEvents.readMore')}</a>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                <div className="news-custom-nav">
                    <div className="news-nav-prev">◀</div>
                    <div className="news-nav-next">▶</div>
                </div>
            </div>
        </section>
    );
};

export default NewsEvents;