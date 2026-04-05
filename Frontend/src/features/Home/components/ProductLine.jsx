import React from 'react';
import './ProductLine.css';
import { Link } from 'react-router-dom';
// 1. Import hook dịch thuật
import { useTranslation } from 'react-i18next';

// Import ảnh
import img1 from '../../../assets/imgs/sp1.jpg';
import img2 from '../../../assets/imgs/sp2.jpg';
import img3 from '../../../assets/imgs/sp3.jpg';
import img4 from '../../../assets/imgs/sp4.jpg';
import img5 from '../../../assets/imgs/sp5.jpg';
import img6 from '../../../assets/imgs/sp6.jpg';

const ProductLine = () => {
    // 2. Khai báo hàm t
    const { t } = useTranslation();

    // 3. Đưa hàm t vào mảng dữ liệu để tên sản phẩm tự đổi theo ngôn ngữ
    const products = [
        { id: 1, name: t('home.productLine.categories.cat1'), img: img1 },
        { id: 2, name: t('home.productLine.categories.cat2'), img: img2 },
        { id: 3, name: t('home.productLine.categories.cat3'), img: img3 },
        { id: 4, name: t('home.productLine.categories.cat4'), img: img4 },
        { id: 5, name: t('home.productLine.categories.cat5'), img: img5 },
        { id: 6, name: t('home.productLine.categories.cat6'), img: img6 }
    ];

    return (
        <section className="product-line-section">
            {/* Chữ in chìm khổng lồ - Lấy từ JSON luôn cho đồng bộ */}
            <div className="watermark-text">{t('home.productLine.watermark')}</div>

            <div className="product-line-container">
                <div className="section-header">
                    {/* Dịch tiêu đề và phụ đề */}
                    <h2>{t('home.productLine.title')}</h2>
                    <div className="title-line"></div>
                    <p>
                        {t('home.productLine.subtitle1')} <br />
                        {t('home.productLine.subtitle2')}
                    </p>
                </div>

                <div className="product-grid">
                    {products.map((item) => (
                        <Link
                            to={`/products?categoryId=${item.id}`}
                            key={item.id}
                            className="product-card-wrapper"
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            <div className="product-card">
                                <div className="card-image">
                                    {/* Dịch nốt thẻ alt của ảnh cho chuẩn SEO */}
                                    <img src={item.img} alt={item.name} />
                                </div>

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