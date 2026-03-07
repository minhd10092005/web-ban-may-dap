// File: Frontend/src/services/api.js
import axios from 'axios';

// Thay cổng 5000 bằng cổng thực tế của Back-end khi bro chạy .NET
const api = axios.create({
    baseURL: 'https://localhost:7001',
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;