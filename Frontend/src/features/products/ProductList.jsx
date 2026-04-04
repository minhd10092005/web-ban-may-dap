import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ProductList.css';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // State tìm kiếm và phân trang
    const [search, setSearch] = useState('');
    const [cateId, setCateId] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 6;

    // Hàm gọi API
    const fetchProducts = async (currentSearch, currentCateId, currentPage) => {
        setLoading(true);
        try {
            const res = await axios.get(`https://localhost:7263/api/Products`, {
                params: { 
                    search: currentSearch, 
                    cateId: currentCateId, 
                    page: currentPage, 
                    pageSize 
                }
            });
            // Lưu ý: res.data.items vì API của ông trả về Object chứa danh sách
            setProducts(res.data.items || []);
            setTotalPages(res.data.totalPages || 1);
        } catch (err) {
            console.error("Lỗi gọi API:", err);
        } finally {
            setLoading(false);
        }
    };

    // LOGIC DEBOUNCE THUẦN REACT
    useEffect(() => {
        // Mỗi khi ông gõ chữ, nó sẽ tạo một cái hẹn giờ 500ms
        const delayDebounceFn = setTimeout(() => {
            // Sau 500ms dừng gõ, nó mới thực hiện gọi API
            fetchProducts(search, cateId, page);
        }, 500);

        // HÀM CLEANUP: Nếu ông gõ chữ tiếp theo trước khi hết 500ms, 
        // cái hẹn giờ cũ sẽ bị hủy để tạo cái mới.
        return () => clearTimeout(delayDebounceFn);
    }, [search, cateId, page]); // Chạy lại khi bất kỳ cái nào thay đổi

    return (
        <div className="pl-container">
            <div className="pl-filter-header">
                <div className="pl-search-box">
                    <input 
                        type="text" 
                        placeholder="Nhập tên máy để tìm nhanh..." 
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1); // Gõ tìm kiếm thì reset về trang 1
                        }}
                    />
                </div>

                <select 
                    className="pl-select"
                    value={cateId} 
                    onChange={(e) => {
                        setCateId(e.target.value);
                        setPage(1);
                    }}
                >
                    <option value="">Tất cả danh mục</option>
                    <option value="1">Máy móc thiết bị (GMP)</option>
                    <option value="2">Dược phẩm / Thuốc</option>
                    <option value="3">Vật tư / Dụng cụ y tế</option>
                </select>
            </div>

            {loading ? (
                <div className="pl-loading">Đang lọc danh sách thiết bị...</div>
            ) : (
                <>
                    <div className="pl-grid">
                        {products.length > 0 ? (
                            products.map((p) => (
                                <Link to={`/product/${p.productId}`} key={p.productId} className="pl-card">
                                    <div className="pl-img-holder">
                                        <img src={p.imageUrl} alt={p.productName} />
                                    </div>
                                    <div className="pl-info">
                                        <span className="pl-tag">{p.cateName}</span>
                                        <h3 className="pl-name">{p.productName}</h3>
                                        <p className="pl-type">{p.productType}</p>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="pl-no-data">Không tìm thấy kết quả nào cho "{search}"</div>
                        )}
                    </div>

                    {/* PHÂN TRANG */}
                    {totalPages > 1 && (
                        <div className="pl-pagination">
                            <button disabled={page === 1} onClick={() => setPage(page - 1)}>&laquo;</button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button 
                                    key={i + 1} 
                                    className={page === i + 1 ? 'active' : ''} 
                                    onClick={() => setPage(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>&raquo;</button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ProductList;