import axios from "axios";

const axiosClient = axios.create({
    baseURL: "https://localhost:7263/api",
    headers: {
        "Content-Type": "application/json"
    },
});

// Gắn Token vào Header mỗi khi gửi yêu cầu
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("admin_token"); 
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Xử lý dữ liệu trả về
axiosClient.interceptors.response.use(
    (response) => {
        // QUAN TRỌNG: Trả về response.data để Component lấy đúng data từ API
        // Thay vì trả về toàn bộ object của Axios
        return response.data; 
    },
    (error) => {
        // Tự động đá ra trang login nếu Token hết hạn (401)
        if (error.response?.status === 401) {
            localStorage.removeItem("admin_token");
            window.location.href = "/loginAdmin";
        }
        
        console.error("Backend Error:", error.response?.status, error.response?.data);
        return Promise.reject(error);
    }
);

export default axiosClient;