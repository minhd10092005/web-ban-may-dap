<<<<<<< HEAD
﻿// Thay port 7263 bằng đúng port Backend đang chạy của bạn nhé
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
=======
﻿// quoteService.js

const API_URL = "https://localhost:7263/api/quote"; // sửa nếu khác port

export const getQuotes = async () => {
    const res = await fetch(API_URL);
    return await res.json();
};

export const createQuote = async (data) => {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    return await res.json();
>>>>>>> 01b581039d261a092ea10797170a4308931fac48
};