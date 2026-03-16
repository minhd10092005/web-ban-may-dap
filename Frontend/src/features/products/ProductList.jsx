import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './css/ProductList.css'; 

const ProductList = () => {
    // Các State quản lý dữ liệu
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // State cho Thanh tìm kiếm, Lọc và Phân trang
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Hàm gọi API với các tham số truyền vào
    const fetchProductsData = async () => {
        setLoading(true);
        try {
            // ĐIỀN ĐÚNG PORT CỦA C# VÀO ĐÂY (Ví dụ: 7263)
            const url = `https://localhost:7263/api/products?search=${searchTerm}&categoryId=${categoryId}&page=${currentPage}&pageSize=6`;
            
            const response = await fetch(url);
            if (!response.ok) throw new Error('Lỗi khi tải dữ liệu');
            
            const data = await response.json();
            
            // Bóc tách dữ liệu từ C# trả về (hỗ trợ cả chữ hoa chữ thường)
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

    // Tự động gọi API khi đổi trang
    useEffect(() => {
        fetchProductsData();
        window.scrollTo(0, 0); 
    }, [currentPage]); 

    // Xử lý khi bấm nút "Tìm kiếm"
    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1); // Trở về trang 1 khi tìm kiếm mới
        fetchProductsData();
    };

    return (
        <div className="product-catalog-container">
            <h1 style={{textAlign: 'center', marginBottom: '30px', color: '#333'}}>
                DANH MỤC THIẾT BỊ DƯỢC PHẨM
            </h1>

            {/* --- THANH TÌM KIẾM VÀ LỌC --- */}
            <form onSubmit={handleSearch} className="search-filter-bar">
                <input 
                    type="text" 
                    placeholder="Nhập tên máy cần tìm (VD: Profill...)" 
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

                <button type="submit" className="search-btn">Tìm kiếm</button>
            </form>

            {/* --- DANH SÁCH SẢN PHẨM --- */}
            {loading ? (
                <div style={{ textAlign: 'center', marginTop: '50px' }}>Đang tải dữ liệu...</div>
            ) : products && products.length > 0 ? (
                <div className="product-grid">
                    {Array.isArray(products) && products.map(product => (
                        <div key={product.id} className="product-item">
                            <Link to={`/products/${product.id}`} className="product-link">
                                <div className="product-image-container">
                                    <img 
                                        src={product.imageUrl} 
                                        alt={product.name} 
                                        className="product-image"
                                    />
                                </div>
                            </Link>
                            
                            <Link to={`/products/${product.id}`} className="product-link">
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

            {/* --- PHÂN TRANG (PAGINATION) --- */}
            {totalPages > 1 && (
                <div className="pagination-container">
                    <button 
                        disabled={currentPage === 1} 
                        onClick={() => setCurrentPage(prev => prev - 1)}
                        className="page-btn"
                    >
                        &laquo; Trước
                    </button>
                    
                    <span className="page-info">
                        Trang {currentPage} / {totalPages}
                    </span>

                    <button 
                        disabled={currentPage === totalPages} 
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        className="page-btn"
                    >
                        Sau &raquo;
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProductList;