import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { GoogleLogin } from "@react-oauth/google";
import { getUserById } from "../utils/UserService"; // Import API lấy user

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); // Đảm bảo user được khởi tạo là null

  // Kiểm tra và lấy user từ API
  const checkAuth = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);

        // Kiểm tra token hết hạn
        if (decodedToken.exp * 1000 < Date.now()) {
          console.warn("Token đã hết hạn.");
          logout();
          return;
        }

        // Gọi API để lấy thông tin user
        const response = await getUserById(decodedToken.sub); // sub là email trong token
        console.log("Dữ liệu từ API:", response.data);
        const userData = response.data;

        const formattedUser = {
          userId: userData.userId,
          email: userData.email,
          role: userData.roleEnum, // Sử dụng roleEnum thay vì role
          authorities: Array.isArray(userData.authorities) ? userData.authorities.map((auth) => auth.authority) : [],
        };

        setUser(formattedUser);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin user từ API:", error);
        logout();
      }
    } else {
      setUser(null);
      setIsLoggedIn(false);
    }
  };

  // Xử lý login với Google
  const handleGoogleLoginSuccess = async (response) => {
    const { credential } = response;
    if (!credential) {
      console.error("Không có credential trong response");
      return;
    }

    try {
      const userData = jwtDecode(credential); // Giải mã token để lấy thông tin người dùng
      const { email, given_name, family_name, picture } = userData;

      const user = {
        email,
        firstName: given_name,
        lastName: family_name,
        fullName: `${given_name} ${family_name}`,
        imageUrl: picture,
        role: "CUSTOMER_NORMAL", // Thêm role mặc định hoặc từ token nếu có
      };

      setUser(user);
      setIsLoggedIn(true);
      localStorage.setItem("token", credential); // Lưu token vào localStorage
    } catch (error) {
      console.error("Lỗi khi xử lý login với Google:", error);
    }
  };

  // Xử lý logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsLoggedIn(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, setUser, setIsLoggedIn, checkAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
