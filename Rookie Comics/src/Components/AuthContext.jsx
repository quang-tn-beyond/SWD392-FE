import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";  // Giải mã token JWT

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);  // Ban đầu là null

  // Kiểm tra và lấy dữ liệu người dùng từ API
  const checkAuth = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token); // Giải mã token

        // Kiểm tra xem token có hết hạn không
        if (decodedToken.exp * 1000 < Date.now()) {
          console.warn("Token đã hết hạn.");
          logout();
          return;
        }

        // Lấy thông tin người dùng từ decoded token
        const userData = {
          email: decodedToken.sub || decodedToken.email,
          role: decodedToken.role,
          family_name: decodedToken.family_name,
          given_name: decodedToken.given_name,
        };

        setUser(userData);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Lỗi khi giải mã token:", error);
        logout();
      }
    } else {
      setUser(null);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    // Kiểm tra lại token khi trang tải
    checkAuth();
  }, []);  // Chỉ chạy 1 lần khi trang được tải lại

  // Đăng xuất
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, setUser, setIsLoggedIn, checkAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
