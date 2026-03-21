import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// 1. Import các component của Swiper React
import { Swiper, SwiperSlide } from 'swiper/react';

// 2. Import Swiper styles (bắt buộc)
import 'swiper/css';
import 'swiper/css/pagination'; // Nếu muốn dùng dấu chấm chuyển trang
import 'swiper/css/navigation'; // Nếu muốn dùng mũi tên Trái/Phải

// 3. Import các module cần thiết
import { Pagination, Navigation, Autoplay } from 'swiper/modules';

// Import CSS custom của bro (sẽ sửa ở Bước 3)
import './FeaturedProducts.css';

const FeaturedProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Giữ nguyên logic fetch data thật từ API của nhóm trưởng
    useEffect(() => {
        // NHỚ THAY 'https://localhost:7263' bằng đúng port Backend của bro nhé!
        fetch('https://localhost:7263/api/products?page=1&pageSize=12') // Tăng pageSize lên để slider có nhiều ảnh mà trượt
            .then(res => res.json())
            .then(data => {
                // Ta lấy mảng 'products' ra từ data thật
                setProducts(data.products || []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Lỗi API (Check CORS/Cổng):", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="loading-text">Đang tải máy móc...</div>;

    // Nếu không có sản phẩm nào, ẩn section này đi
    if (products.length === 0) return null;

    return (
        <section className="featured-products-section swiper-style-section">
            <div className="container">
                <div className="section-header">
                    <h2>MÁY MÓC TIÊU BIỂU</h2>
                    <p>Tiến Tuấn - "Tiêu chuẩn Đức" trong từng thiết bị dược phẩm</p>
                </div>

                {/* 4. Cấu hình Swiper Slider ở đây */}
                <Swiper
                    modules={[Pagination, Navigation, Autoplay]}
                    loop={true}

                    spaceBetween={30}

                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                    }}

                    // dấu chấm chuyển trang và mũi tên navigation
                    // pagination={{ clickable: true }}
                    // navigation={true}

                    // --- CẤU HÌNH RESPONSIVE (SỐ ẢNH HIỆN THEO MÀN HÌNH) ---
                    breakpoints={{
                        // Khi màn hình >= 320px (Mobile)
                        320: {
                            slidesPerView: 1, // Hiện 1 ảnh
                        },
                        // Khi màn hình >= 768px (Tablet)
                        768: {
                            slidesPerView: 2, // Hiện 2 ảnh
                        },
                        // Khi màn hình >= 1024px (PC/Laptop)
                        1024: {
                            slidesPerView: 4,
                        },
                    }}
                    className="featured-products-swiper"
                >
                    {/* 5. Duyệt qua mảng sản phẩm và nhét vào SwiperSlide */}
                    {products.map((item) => (
                        <SwiperSlide key={item.id}>
                            <div className="product-card">
                                <div className="card-image">
                                    <img src={item.imageUrl} alt={item.name} />
                                </div>
                                <div className="card-body">
                                    <span className="model-tag">
                                        Model: {item.modelNumber !== "N/A" ? item.modelNumber : "Đang cập nhật"}
                                    </span>
                                    <h3>{item.name}</h3> 
                                    {/* Link nhảy sang trang Chi tiết */}
                                    <Link to={`/product/${item.id}`} className="view-detail-btn">
                                        XEM CHI TIẾT
                                    </Link>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default FeaturedProducts;