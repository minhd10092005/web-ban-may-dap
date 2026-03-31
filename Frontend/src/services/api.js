
const BASE_URL = 'https://localhost:7263/api';

// Hàm lấy danh sách sản phẩm (có phân trang/tìm kiếm)
export const fetchProducts = async (searchTerm = '', categoryId = '', page = 1, pageSize = 6) => {
    const url = `${BASE_URL}/products?search=${searchTerm}&categoryId=${categoryId}&page=${page}&pageSize=${pageSize}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Không thể tải danh sách sản phẩm');
    return response.json();
};

// Hàm lấy chi tiết một sản phẩm theo ID
export const fetchProductById = async (id) => {
    const response = await fetch(`${BASE_URL}/products/${id}`);
    if (!response.ok) throw new Error('Không thể tải chi tiết sản phẩm');
    return response.json();
};

const QUOTE_API_URL = `${BASE_URL}/quote`;

export const getQuotes = async () => {
    const res = await fetch(QUOTE_API_URL);
    if (!res.ok) throw new Error('Không thể lấy danh sách báo giá');
    return await res.json();
};

export const createQuote = async (data) => {
    const res = await fetch(QUOTE_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Gửi yêu cầu báo giá thất bại');
    return await res.json();
};

export default BASE_URL;