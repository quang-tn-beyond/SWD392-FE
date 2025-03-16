import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { GoogleLogin } from "@react-oauth/google";

export const AuthContext = createContext();

const ROLE_MAP = {
  1: "ADMIN",
  2: "MANAGER",
  3: "MODERATOR",
  4: "STAFF",
  5: "CUSTOMER_NORMAL",
  6: "CUSTOMER_READER",
  7: "CUSTOMER_AUTHOR",
  8: "CUSTOMER_VIP",
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); // Đảm bảo user được khởi tạo là null

  const checkAuth = () => {
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

        const userData = {
          email: decodedToken.sub,
          role: ROLE_MAP[decodedToken.role] || "UNKNOWN",
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
