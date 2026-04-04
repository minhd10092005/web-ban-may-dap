import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            setLoading(true);
            try {
                // 1. Lấy chi tiết sản phẩm hiện tại
                const res = await axios.get(`https://localhost:7263/api/Products/${id}`);
                const currentProduct = res.data;
                setProduct(currentProduct);

                // 2. Lấy sản phẩm gợi ý (Lấy CateId từ productDetail)
                const targetCateId = currentProduct.cateId || currentProduct.productDetail?.cateId;
                
                if (targetCateId) {
                    const relatedRes = await axios.get(`https://localhost:7263/api/Products`);
                    // API phân trang trả về { items: [], totalCount: x }
                    const allProducts = relatedRes.data.items || relatedRes.data;

                    if (Array.isArray(allProducts)) {
                        const filtered = allProducts.filter(p => {
                            // Lấy cateId của từng sản phẩm trong danh sách để so sánh
                            const pCateId = p.cateId || p.productDetail?.cateId;
                            const pId = p.id || p.productId;
                            return pCateId === targetCateId && pId !== parseInt(id);
                        }).slice(0, 4);
                        
                        setRelatedProducts(filtered);
                    }
                }
            } catch (err) {
                console.error("Lỗi Fetch:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [id]);

    // Slider tự động nhảy mỗi 2 giây
    useEffect(() => {
        if (product?.productImages && product.productImages.length > 1) {
            const interval = setInterval(() => {
                setCurrentIndex((prev) => 
                    prev === product.productImages.length - 1 ? 0 : prev + 1
                );
            }, 2000);
            return () => clearInterval(interval);
        } else {
            setCurrentIndex(0); // Reset về ảnh đầu nếu chỉ có 1 ảnh
        }
    }, [product]);

    if (loading) return <div className="status-message">Đang tải cấu hình thiết bị...</div>;
    if (!product) return <div className="status-message error">Thiết bị không tồn tại.</div>;

    return (
        <div className="pd-container">
            <nav className="pd-breadcrumb">
                <Link to="/">TRANG CHỦ</Link> <span>/</span> 
                <strong>{product.productName}</strong>
            </nav>

            <div className="pd-main-content">
                {/* KHỐI TRÁI: SLIDER ẢNH */}
                <div className="pd-image-section">
                    <div className="pd-main-image-wrapper">
                        <img 
                            src={product.productImages?.[currentIndex]?.imageUrl || product.imageUrl || 'https://placehold.co/600x400?text=No+Image'} 
                            alt={product.productName}
                            className="pd-main-image"
                        />
                    </div>
                    <div className="pd-image-dots">
                        {product.productImages?.map((_, index) => (
                            <span 
                                key={index} 
                                className={`pd-dot ${index === currentIndex ? 'active' : ''}`}
                                onClick={() => setCurrentIndex(index)}
                            ></span>
                        ))}
                    </div>
                </div>

                {/* KHỐI PHẢI: THÔNG TIN */}
                <div className="pd-info-section">
                    <h1 className="pd-title">{product.productName}</h1>
                    <div className="pd-meta-group">
                        <p className="pd-meta">Danh mục: <span>{product.cateName || 'Dược phẩm'}</span></p>
                        <p className="pd-meta">Dòng máy: <span>{product.productType}</span></p>
                    </div>
                    <hr className="pd-divider" />
                    <div className="pd-description-box">
                        <h3 className="pd-box-title">MÔ TẢ THÔNG SỐ KỸ THUẬT</h3>
                        <div className="pd-description-content">
                            {product.description || product.productDetail?.description || "Đang cập nhật nội dung..."}
                        </div>
                    </div>
                </div>
            </div>

            {/* SẢN PHẨM TƯƠNG TỰ */}
            {relatedProducts.length > 0 && (
                <div className="related-section">
                    <h2 className="related-main-title">GIẢI PHÁP TƯƠNG TỰ</h2>
                    <div className="related-grid">
                        {relatedProducts.map(item => {
                            const itemKey = item.id || item.productId;
                            return (
                                <Link to={`/product/${itemKey}`} key={itemKey} className="related-card">
                                    <div className="related-img-wrapper">
                                        <img src={item.imageUrl || 'https://placehold.co/200'} alt={item.productName} />
                                    </div>
                                    <div className="related-info">
                                        <p className="related-name">{item.productName}</p>
                                        <span className="related-view">Xem chi tiết →</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetail;