import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:5298/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error("Lỗi kết nối Backend:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axiosClient;