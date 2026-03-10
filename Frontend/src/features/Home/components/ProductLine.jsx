import React from 'react';
import './ProductLine.css';

// Import ảnh (Bro nhớ sửa lại tên file cho đúng với ảnh thực tế trong máy nhé)
import img1 from '../../../assets/imgs/1.jpg';
import img2 from '../../../assets/imgs/2.jpg';
import img3 from '../../../assets/imgs/3.jpg';
import img4 from '../../../assets/imgs/4.jpg';
import img5 from '../../../assets/imgs/5.jpg';
import img6 from '../../../assets/imgs/3.jpg';

const ProductLine = () => {
    const products = [
        { id: 1, name: "Cốm nguyên liệu", img: img1 },
        { id: 2, name: "Cốm tạo hạt", img: img2 },
        { id: 3, name: "Hạt pellet", img: img3 },
        { id: 4, name: "Viên nén", img: img4 },
        { id: 5, name: "Viên nang", img: img5 },
        { id: 6, name: "Vỉ- Hộp", img: img6 }
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
                        <div className="product-card" key={item.id}>
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
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductLine;