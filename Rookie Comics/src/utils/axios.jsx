import axios from 'axios';

// Tạo một axios instance với cấu hình cơ bản
const request = axios.create({
  baseURL: 'http://localhost:8080/',  // URL của backend
  timeout: 5000,  // Thời gian timeout mặc định
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để thêm Bearer token cho tất cả các yêu cầu
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token'); // Lấy token từ localStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Thêm Authorization header
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default request;
