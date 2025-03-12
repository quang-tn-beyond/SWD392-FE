import axios from 'axios';

// Cấu hình mặc định cho axios
const request = axios.create({
  baseURL: 'http://localhost:8080/api/', // Đặt URL cơ sở cho backend
  timeout: 500, // Đặt thời gian timeout mặc định (5000ms = 5 giây)
  headers: {
    'Content-Type': 'application/json', // Đặt header Content-Type cho các yêu cầu POST, PUT
  },
});

export default request;
