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
import { getUserIdByEmail } from "../utils/UserService";
import EditProfileForm from "./EditProfileForm";
import { getAllWallets, getMainWallet, getPromotionWallet } from "../utils/WalletService";


const ProfileMenu = ({ onLogout }) => {
  const { user, logout, isLoggedIn } = useContext(AuthContext); // Lấy user từ AuthContext
  const [showMenu, setShowMenu] = useState(false);
  const [openDialog, setOpenDialog] = useState(false); // Điều khiển việc mở/đóng dialog thêm truyện
  const [editProfileOpen, setEditProfileOpen] = useState(false); // Điều khiển việc mở/đóng dialog chỉnh sửa hồ sơ
  const [coinBalance, setCoinBalance] = useState(0); // Trạng thái lưu trữ số dư coin
  const [initialComic, setInitialComic] = useState(null); // Đảm bảo giá trị mặc định là null
  const menuRef = useRef(null);
  const navigate = useNavigate(); // Hook điều hướng
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

  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        const userId = await getUserIdByEmail(user?.email); // Lấy userId từ email
        console.log("UserId:", userId); // In ra userId để kiểm tra
  
        if (userId) {
          let mainWalletResponse, promotionWalletResponse;
  
          // Gọi API cho ví chính (cần truyền userId vào API)
          mainWalletResponse = await getMainWallet(userId);
          console.log("Main wallet response:", mainWalletResponse);
  
          // Kiểm tra nếu có dữ liệu ví chính
          if (mainWalletResponse?.data) {
            setCoinBalance(mainWalletResponse.data.balance || 0); // Cập nhật số dư xu từ ví chính
          } else {
            console.log("Không có dữ liệu ví chính.");
            setCoinBalance(0); // Nếu không có dữ liệu ví chính, gán số dư = 0
          }
  
          // Nếu role 7 hoặc 8, gọi thêm ví khuyến mãi
          if (user?.role === 7 || user?.role === 8) {
            promotionWalletResponse = await getPromotionWallet(userId); // Truyền userId vào API
            console.log("Promotion wallet response:", promotionWalletResponse);
  
            // Kiểm tra dữ liệu ví khuyến mãi và cộng dồn vào số dư
            if (promotionWalletResponse?.data) {
              setCoinBalance(prevBalance => prevBalance + (promotionWalletResponse.data.balance || 0));
            }
          }
  
        }
      } catch (error) {
        console.error("Lỗi khi lấy số dư xu:", error);
        setCoinBalance(0); // Nếu có lỗi, cập nhật số dư xu = 0
      }
    };
  
    if (user?.email) {
      fetchWalletBalance(); // Gọi hàm fetchWalletBalance nếu email người dùng có
    }
  }, [user?.email, user?.role]); // Chạy lại khi email hoặc role người dùng thay đổi
  
  
  
  
  
  
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

  // Mở dialog chỉnh sửa hồ sơ
  const handleEditProfile = () => {
    setEditProfileOpen(true); // Mở dialog chỉnh sửa hồ sơ
  };

  // Đóng dialog chỉnh sửa hồ sơ
  const handleCloseEditProfile = () => {
    setEditProfileOpen(false); // Đóng dialog
  };

  // Cập nhật thông tin hồ sơ
  const handleUpdateProfile = (updatedData) => {
    // Thực hiện cập nhật thông tin hồ sơ tại đây (gọi API hoặc xử lý)
    console.log("Profile updated with data: ", updatedData);
    handleCloseEditProfile(); // Đóng dialog sau khi cập nhật
  };

  // Xử lý lưu comic
  const handleSave = (comicData) => {
    console.log("Comic saved:", comicData);
    // Gọi API hoặc thực hiện các hành động cần thiết để lưu comic
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
            <span style={{ color: "green" }}>{coinBalance} Xu</span>
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
              <MenuItem onClick={handleEditProfile}>
                <Button sx={{ width: "100%", textAlign: "left" }}>
                  Sửa Hồ Sơ
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
            onSave={handleSave} // Truyền handleSave vào ComicForm
            initialComic={initialComic} // Truyền initialComic vào ComicForm
            onClose={handleClose}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog chỉnh sửa hồ sơ */}
      <Dialog open={editProfileOpen} onClose={handleCloseEditProfile} fullWidth maxWidth="md">
        <DialogTitle>Chỉnh sửa hồ sơ</DialogTitle>
        <DialogContent>
          <EditProfileForm 
            open={editProfileOpen}
            handleClose={handleCloseEditProfile}
            userData={user}
            handleUpdate={handleUpdateProfile}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileMenu;
