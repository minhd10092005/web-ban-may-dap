// Thay port 7263 bằng đúng port Backend đang chạy của bạn nhé
const BASE_URL = 'https://localhost:7263/api';

// Hàm lấy danh sách sản phẩm
export const fetchProducts = async () => {
    const response = await fetch(`${BASE_URL}/products`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

// Hàm lấy chi tiết một sản phẩm theo ID
export const fetchProductById = async (id) => {
    const response = await fetch(`${BASE_URL}/products/${id}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};