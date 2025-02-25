import React, { useState, useContext, useRef, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { Link } from "react-router-dom";
import { Avatar, Menu, MenuItem, Typography, Divider, IconButton, Box } from "@mui/material";
import { Logout, AccountCircle, ShoppingCart, History } from "@mui/icons-material";

const ProfileMenu = ({ onLogout }) => {
  const { user, logout, isLoggedIn } = useContext(AuthContext);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const defaultAvatarUrl = "/assets/img/default-avatar.png"; // Đường dẫn ảnh mặc định nếu không có avatar

  // Toggle menu (hiện/ẩn menu)
  const handleToggleMenu = () => {
    setShowMenu((prev) => !prev);
    console.log("Toggle menu", !showMenu);
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
            width: 200,
            mt: 1,
            border: "1px solid #ddd",
            padding: "10px",
            maxWidth: 200, // Đảm bảo menu không rộng quá
            whiteSpace: "normal", // Đảm bảo email sẽ xuống dòng khi cần thiết
            wordWrap: "break-word", // Cho phép dòng vượt quá chiều rộng và xuống dòng
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontWeight: "bold",
              overflow: "hidden",
              textOverflow: "ellipsis", // Nếu email quá dài, 3 dấu chấm sẽ xuất hiện
              whiteSpace: "nowrap", // Ngăn email xuống dòng
            }}
          >
            {user?.email}
          </Typography>
          <Typography variant="body2" sx={{ color: "gray", whiteSpace: "nowrap" }}>
            {user?.role}
          </Typography>
          <Divider sx={{ my: 1 }} />
          {isLoggedIn ? (
            <>
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
