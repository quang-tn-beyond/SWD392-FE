import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Menu, MenuItem, IconButton, Avatar } from "@mui/material";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const ProfileMenu = ({ onLogout }) => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    // Đọc token từ cookie
    const token = Cookies.get("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken && decodedToken.sub) {
          setUserEmail(decodedToken.sub);  // Lấy email từ token
        }
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    }
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Xóa token khỏi cookie
    Cookies.remove("token");
    onLogout(); // Cập nhật trạng thái đăng nhập của app
    handleMenuClose();
    navigate("/"); // Điều hướng về trang chủ hoặc trang đăng nhập
  };

  if (!userEmail) return null; // Nếu không có email, không render menu

  return (
    <div>
      <IconButton onClick={handleMenuOpen}>
        <Avatar>{userEmail.charAt(0).toUpperCase()}</Avatar>
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem>{userEmail}</MenuItem>  {/* Hiển thị email người dùng */}
        <MenuItem onClick={handleLogout}>Logout</MenuItem>  {/* Nút đăng xuất */}
      </Menu>
    </div>
  );
};

export default ProfileMenu;
