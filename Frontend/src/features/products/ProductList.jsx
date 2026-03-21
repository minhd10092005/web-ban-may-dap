import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './css/ProductList.css'; 

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // 1. Tách hàm gọi API riêng biệt
    const fetchProductsData = async () => {
        setLoading(true);
        try {
            const url = `https://localhost:7263/api/products?search=${searchTerm}&categoryId=${categoryId}&page=${currentPage}&pageSize=6`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Lỗi khi tải dữ liệu');
            
            const data = await response.json();
            const productArray = data.products || data.Products || [];
            
            setProducts(productArray);
            setTotalPages(data.totalPages || data.TotalPages || 1);
            setCurrentPage(data.currentPage || data.CurrentPage || 1);
        } catch (error) {
            console.error('Lỗi API:', error);
            setProducts([]); 
        } finally {
            setLoading(false);
        }
    };

    // 2. Tự động reset trang về 1 khi từ khóa hoặc danh mục thay đổi
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, categoryId]);

    // 3. Gọi API mỗi khi từ khóa, danh mục HOẶC trang thay đổi
    useEffect(() => {
        // Kỹ thuật Debounce: Tránh gọi API liên tục mỗi khi nhấn 1 phím
        const delayDebounceFn = setTimeout(() => {
            fetchProductsData();
        }, 400); // Đợi 0.4 giây sau khi ngừng gõ mới gọi API

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, categoryId, currentPage]);

    return (
        <div className="product-catalog-container">
            <h1 style={{textAlign: 'center', marginBottom: '30px', color: '#333'}}>
                DANH MỤC THIẾT BỊ DƯỢC PHẨM
            </h1>

            <div className="search-filter-bar">
                <input 
                    type="text" 
                    placeholder="Nhập tên máy cần tìm..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                
                <select 
                    value={categoryId} 
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="filter-select"
                >
                    <option value="">-- Tất cả danh mục --</option>
                    <option value="1">Máy đóng nang (Capsule)</option>
                    <option value="2">Máy dập viên (Tablet)</option>
                    <option value="3">Máy chiết rót (Liquid Filling)</option>
                </select>
                {/* Nút tìm kiếm bây giờ có thể bỏ hoặc để làm cảnh, 
                    vì API sẽ tự gọi khi bạn gõ/chọn */}
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', marginTop: '50px' }}>Đang tải dữ liệu...</div>
            ) : products.length > 0 ? (
                <div className="product-grid">
                    {products.map(product => (
                        <div key={product.id} className="product-item">
                            <Link to={`/products/${product.id}`} className="product-link">
                                <div className="product-image-container">
                                    <img src={product.imageUrl} alt={product.name} className="product-image" />
                                </div>
                                <h3 className="product-title">{product.name}</h3>
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', marginTop: '50px', color: 'red', fontSize: '18px' }}>
                    Không tìm thấy sản phẩm nào phù hợp!
                </div>
            )}

            {totalPages > 1 && (
                <div className="pagination-container">
                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="page-btn">
                        &laquo; Trước
                    </button>
                    <span className="page-info">Trang {currentPage} / {totalPages}</span>
                    <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)} className="page-btn">
                        Sau &raquo;
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProductList;