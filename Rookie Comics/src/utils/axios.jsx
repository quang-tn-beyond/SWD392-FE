import axios from 'axios';

// Tạo một axios instance với cấu hình cơ bản
const request = axios.create({
  baseURL: 'http://localhost:8080/',  // URL của backend
  timeout: 5000,  // Thời gian timeout mặc định
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm interceptor để log lỗi
request.interceptors.response.use(
  (response) => response, 
  (error) => {
    console.error("Lỗi API:", error.response ? error.response.data : error.message);
    return Promise.reject(error);
  }
);

export default request;
