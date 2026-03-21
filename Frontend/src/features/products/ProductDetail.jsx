import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProductById, fetchProducts } from '../../services/api';
import './css/ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);

    // State quản lý slider ảnh chính
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // ==========================================
    // CÁC HÀM CHO SLIDER SẢN PHẨM LIÊN QUAN
    // ==========================================
    const relatedSliderRef = useRef(null);

    const scrollLeft = () => {
        if (relatedSliderRef.current) relatedSliderRef.current.scrollBy({ left: -250, behavior: 'smooth' });
    };

    const scrollRight = () => {
        if (relatedSliderRef.current) relatedSliderRef.current.scrollBy({ left: 250, behavior: 'smooth' });
    };
    // ==========================================

    useEffect(() => {
        // Cuộn lên đầu trang mỗi khi đổi sản phẩm
        window.scrollTo(0, 0);

        // 1. Gọi API lấy chi tiết 1 máy
        fetchProductById(id)
            .then(data => setProduct(data))
            .catch(error => console.error('Lỗi khi tải chi tiết:', error));

        // 2. Gọi API lấy danh sách để làm mục "Sản phẩm liên quan"
        fetchProducts()
            .then(data => {
                const productArray = data.products || data.Products || [];
                
                // Lọc bỏ sản phẩm hiện tại, để lại tất cả các máy khác để trượt
                const filtered = productArray.filter(p => p.id !== parseInt(id));
                setRelatedProducts(filtered);
            })
            .catch(error => console.error('Lỗi khi tải sản phẩm liên quan:', error));
    }, [id]);

    useEffect(() => {
        // Nếu chưa có product, dừng lại không chạy slider
        if (!product) return;

        // Xử lý tạo mảng ảnh để đếm độ dài cho slider
        const productImages = product.gallery && product.gallery.length > 0
            ? product.gallery
            : [product.imageUrl || "https://placehold.co/500x500?text=No+Image"];

        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % productImages.length);
        }, 1000);

        return () => clearInterval(interval);
    }, [product]);

    // Màn hình chờ khi đang fetch API
    if (!product) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Đang tải dữ liệu...</div>;

    // Khởi tạo lại biến này ngoài render để dùng chung cho slider và dots
    const productImages = product.gallery && product.gallery.length > 0
        ? product.gallery
        : [product.imageUrl || "https://placehold.co/500x500?text=No+Image"];

    return (
        <div className="product-detail-container">

            {/* --- PHẦN 1: ẢNH VÀ THÔNG SỐ KỸ THUẬT --- */}
            <div className="detail-top">
                <div className="detail-image-box">
                    {/* Cấu trúc Slider */}
                    <div className="slider-container">
                        <div
                            className="slider-wrapper"
                            style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                        >
                            {productImages.map((img, index) => (
                                <img
                                    key={index}
                                    src={img}
                                    alt={`${product.name} ${index + 1}`}
                                    className="detail-main-image"
                                />
                            ))}
                        </div>
                    </div>

                    <div className="slider-dots">
                        {productImages.map((_, index) => (
                            <span
                                key={index}
                                className={`dot ${index === currentImageIndex ? 'active' : ''}`}
                                onClick={() => setCurrentImageIndex(index)}
                            ></span>
                        ))}
                    </div>
                </div>

                <div className="detail-info">
                    <h1 className="detail-title">{product.name}</h1>

                    <h3>THÔNG SỐ KỸ THUẬT</h3>
                    <table className="specs-table">
                        <tbody>
                            {product.specs && product.specs.length > 0 ? (
                                product.specs.map((spec, index) => (
                                    <tr key={index}>
                                        <td style={{ fontWeight: 'bold', color: '#555' }}>{spec.specName}</td>
                                        <td>{spec.specValue} {spec.unit}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2">Đang cập nhật thông số kỹ thuật...</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- PHẦN 2: TỔNG QUAN --- */}
            <div className="overview-section">
                <div className="overview-header">
                    <h2>Tổng quan</h2>
                </div>
                <div className="overview-content">
                    {/* HỖ TRỢ CẢ CHỮ HOA CHỮ THƯỜNG CỦA C# */}
                    {(product.overview || product.Overview) ? (
                        (product.overview || product.Overview).split('\n').map((paragraph, index) => (
                            paragraph.trim() !== '' && <p key={index}>{paragraph}</p>
                        ))
                    ) : (
                        <p>Đang cập nhật thông tin tổng quan cho sản phẩm này...</p>
                    )}
                </div>
            </div>

            {/* --- PHẦN 3: SẢN PHẨM LIÊN QUAN --- */}
            <div className="related-section">
                <div className="related-header">
                    <h2>SẢN PHẨM LIÊN QUAN</h2>
                    <div className="nav-buttons">
                        <button onClick={scrollLeft}>◀</button>
                        <button onClick={scrollRight}>▶</button>
                    </div>
                </div>

                {/* Gắn ref vào cái khung này để JS biết đường mà trượt */}
                <div className="related-grid" ref={relatedSliderRef}>
                    {relatedProducts.map(rel => (
<Link to={`/product/${rel.id}`} key={rel.id} style={{ textDecoration: 'none' }}>
                            <div className="related-item">
                                <img
                                    src={rel.imageUrl || `https://placehold.co/180x180?text=${rel.name.replace(/ /g, '+')}`}
                                    alt={rel.name}
                                />
                                <h4>{rel.name}</h4>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default ProductDetail;