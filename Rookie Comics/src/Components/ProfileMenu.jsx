import React, { useState, useContext, useRef, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { Link } from "react-router-dom";
import { Avatar, Menu, MenuItem, Typography, Divider, IconButton, Box, Button } from "@mui/material";
import { Logout, AccountCircle, ShoppingCart, History } from "@mui/icons-material";

const ProfileMenu = ({ onLogout }) => {
  const { user, logout, isLoggedIn } = useContext(AuthContext);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const defaultAvatarUrl = "/assets/img/default-avatar.png"; // Đường dẫn ảnh mặc định nếu không có avatar

  // Toggle menu (hiện/ẩn menu)
  const handleToggleMenu = () => {
    setShowMenu((prev) => !prev);
  };

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Xử lý đăng xuất
  const handleLogout = () => {
    logout();
    if (onLogout) onLogout(); // gọi onLogout nếu có
    setShowMenu(false); // Đóng menu khi đăng xuất
  };

  // Chuyển đến lịch sử giao dịch
  const handleTransactionHistory = () => {
    // Thực hiện điều hướng tới trang lịch sử giao dịch
    console.log("Navigate to Transaction History");
  };

  return (
    <div ref={menuRef} style={{ display: "inline-block" }}>
      <IconButton onClick={handleToggleMenu}>
        <Avatar
          alt="Profile"
          src={user?.avatar || defaultAvatarUrl} // Nếu không có avatar thì dùng ảnh mặc định
          sx={{ width: 40, height: 40, cursor: "pointer" }}
        />
      </IconButton>

      {/* Hiển thị menu */}
      {showMenu && (
        <Box
          sx={{
            position: "absolute",
            top: "100%",
            right: 0,
            backgroundColor: "#fff",
            boxShadow: 2,
            borderRadius: 1,
            zIndex: 100,
            width: 250,
            mt: 1,
            border: "1px solid #ddd",
            padding: "15px",
            maxWidth: 250, // Đảm bảo menu không rộng quá
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontWeight: "bold",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              marginBottom: 1,
            }}
          >
            {user?.fullName || "Tên người dùng"} {/* Hiển thị fullName hoặc một giá trị mặc định */}
          </Typography>
          <Typography variant="body2" sx={{ color: "gray", marginBottom: 2 }}>
            {user?.role}
          </Typography>

          {/* Số dư tài khoản */}
          <Typography variant="body2" sx={{ fontWeight: "bold", marginBottom: 2 }}>
            Số dư: <span style={{ color: "green" }}>{user?.coinBalance} Coin</span>
          </Typography>

          <Divider sx={{ my: 1 }} />
          
          {isLoggedIn ? (
            <>
              <MenuItem onClick={handleTransactionHistory}>
                <History sx={{ mr: 1 }} /> Lịch sử giao dịch
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Logout sx={{ mr: 1 }} /> Đăng xuất
              </MenuItem>
            </>
          ) : (
            <MenuItem>
              <Link to="/login" style={{ textDecoration: "none", color: "inherit" }}>
                Đăng nhập
              </Link>
            </MenuItem>
          )}
        </Box>
      )}
    </div>
  );
};

export default ProfileMenu;
