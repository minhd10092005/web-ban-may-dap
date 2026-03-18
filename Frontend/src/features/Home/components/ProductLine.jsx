import React from 'react';
import './ProductLine.css';
import { Link } from 'react-router-dom';

// Import ảnh (Đảm bảo đường dẫn này khớp với cấu trúc folder assets của bro)
import img1 from '../../../assets/imgs/sp1.jpg';
import img2 from '../../../assets/imgs/sp2.jpg';
import img3 from '../../../assets/imgs/sp3.jpg';
import img4 from '../../../assets/imgs/sp4.jpg';
import img5 from '../../../assets/imgs/sp5.jpg';
import img6 from '../../../assets/imgs/sp6.jpg';

const ProductLine = () => {
    const products = [
        { id: 1, name: "Cốm nguyên liệu", img: img1 },
        { id: 2, name: "Cốm tạo hạt", img: img2 },
        { id: 3, name: "Hạt pellet", img: img3 },
        { id: 4, name: "Viên nén", img: img4 },
        { id: 5, name: "Viên nang", img: img5 },
        { id: 6, name: "Vỉ - Hộp", img: img6 }
    ];

    return (
        <section className="product-line-section">
            {/* Chữ in chìm khổng lồ phía sau */}
            <div className="watermark-text">PRODUCTS</div>

            <div className="product-line-container">
                <div className="section-header">
                    <h2>DÂY CHUYỀN SẢN XUẤT</h2>
                    <div className="title-line"></div>
                    <p>
                        Tiến Tuấn tự hào cung cấp sản phẩm chất lượng cao "Tiêu chuẩn Đức - chế tạo tại Việt Nam" <br />
                        đi khắp thế giới
                    </p>
                </div>

                <div className="product-grid">
                    {products.map((item) => (
                        /* Bọc toàn bộ Card bằng Link để tối ưu trải nghiệm người dùng */
                        <Link
                            to={`/products?categoryId=${item.id}`}
                            key={item.id}
                            className="product-card-wrapper"
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            <div className="product-card">
                                <div className="card-image">
                                    <img src={item.img} alt={item.name} />
                                </div>

                                {/* Thanh tên sản phẩm và nút mũi tên nằm đè lên ảnh */}
                                <div className="card-footer">
                                    <h3>{item.name}</h3>
                                    <div className="arrow-btn">
                                        <span>▶</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductLine;