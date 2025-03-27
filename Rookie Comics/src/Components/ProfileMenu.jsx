import React, { useState, useContext, useRef, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { Link, useNavigate } from "react-router-dom";
import {
  Avatar,
  MenuItem,
  Typography,
  Divider,
  IconButton,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { Logout, History } from "@mui/icons-material";
import ComicForm from "../pages/admins/forms/ComicForm";

const ProfileMenu = ({ onLogout }) => {
  const { user, logout, isLoggedIn } = useContext(AuthContext); // Lấy user từ AuthContext
  const [showMenu, setShowMenu] = useState(false);
  const [openDialog, setOpenDialog] = useState(false); // Điều khiển việc mở/đóng dialog
  const [initialComic, setInitialComic] = useState(null); // Truyền comic ban đầu nếu có
  const menuRef = useRef(null);
  const navigate = useNavigate();  // Hook điều hướng
  const defaultAvatarUrl = "/assets/img/default-avatar.png"; // Đường dẫn ảnh mặc định nếu không có avatar

  // Đối tượng ánh xạ các role với tên hiển thị
  const roleMap = {
    1: "ADMIN",
    2: "MANAGER",
    3: "MODERATOR",
    4: "STAFF",
    5: "CUSTOMER_NORMAL",
    6: "CUSTOMER_READER",
    7: "CUSTOMER_AUTHOR",
    8: "CUSTOMER_VIP",
  };

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
    navigate("/login"); // Điều hướng về trang login
  };

  // Chuyển đến lịch sử giao dịch
  const handleTransactionHistory = () => {
    console.log("Navigate to Transaction History");
  };

  // Mở dialog form thêm truyện
  const handleAddComic = () => {
    setInitialComic(null); // Đảm bảo không có comic ban đầu
    setOpenDialog(true); // Mở dialog
  };

  // Đóng dialog
  const handleClose = () => {
    setOpenDialog(false); // Đóng dialog
  };

  const handleSave = () => {
    setOpenDialog(false); // Đóng dialog sau khi lưu
  };

  return (
    <div ref={menuRef} style={{ display: "inline-block" }}>
      <IconButton onClick={handleToggleMenu}>
        <Avatar
          alt="Profile"
          src={user?.imageUrl || defaultAvatarUrl} // Nếu không có avatar thì dùng ảnh mặc định
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
            {`${user?.family_name} ${user?.given_name}`} 
            {/* Hiển thị fullName từ user context */}
          </Typography>
          <Typography variant="body2" sx={{ color: "gray", marginBottom: 2 }}>
            {roleMap[user?.role] || "Chưa xác định"}  {/* Hiển thị role theo quy luật */}
          </Typography>

          {/* Số dư tài khoản */}
          <Typography
            variant="body2"
            sx={{ fontWeight: "bold", marginBottom: 2 }}
          >
            Số dư:{" "}
            <span style={{ color: "green" }}>{user?.coinBalance} Coin</span>
          </Typography>

          <Divider sx={{ my: 1 }} />

          {isLoggedIn ? (
            <>
              <MenuItem onClick={handleTransactionHistory}>
                <History sx={{ mr: 1 }} /> Lịch sử giao dịch
              </MenuItem>
              <MenuItem onClick={handleAddComic}>
                <Button sx={{ width: "100%", textAlign: "left" }}>
                  Thêm Truyện Tranh
                </Button>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Logout sx={{ mr: 1 }} /> Đăng xuất
              </MenuItem>
            </>
          ) : (
            <MenuItem>
              <Link
                to="/login"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                Đăng nhập
              </Link>
            </MenuItem>
          )}
        </Box>
      )}

      {/* Dialog mở form thêm truyện */}
      <Dialog open={openDialog} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>
          {initialComic ? "Cập nhật Truyện" : "Thêm Truyện"}
        </DialogTitle>
        <DialogContent>
          <ComicForm
            onSave={handleSave}
            initialComic={initialComic}
            onClose={handleClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileMenu;
