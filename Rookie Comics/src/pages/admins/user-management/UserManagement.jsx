import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  CircularProgress,
  Typography,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Layout from "../layout";

// Import các hàm từ userService đã được định nghĩa
import { getAllUsers, deleteUser, updateUserRole } from "../../../utils/UserService";
import UserUpdateForm from "../forms/UserUpdateForm";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [open, setOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Chuyển đổi role ID thành tên role
  const convertRoleIdToName = (roleId) => {
    switch (roleId) {
      case 1:
      case 2:
        return "Admin";
      case 3:
        return "Moderator";
      case 4:
        return "StaffPage";
      default:
        return "Member";
    }
  };

  useEffect(() => {
    getAllUsers()
      .then((response) => {
        console.log("All Users:", response.data);  // Log dữ liệu người dùng
        const formattedUsers = response.data.map((user) => ({
          ...user,
          role: convertRoleIdToName(user.role),
        }));
        setUsers(formattedUsers);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        setError("Có lỗi khi tải dữ liệu người dùng.");
        setLoading(false);
      });
  }, []);
  

  const displayedUsers = users.filter((user) => {
    const fullName =
      user.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim();
    const matchesSearch = fullName.toLowerCase().includes(searchValue.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const paginatedUsers = displayedUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
    setPage(0);
  };

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleEditUser = (user) => {
    console.log("Editing User before setting:", user);  // Log user trước khi set vào state
    setEditUser(user);  // Đặt user vào state
    setOpen(true);  // Mở modal
  };
  
  

  const handleDelete = (userId) => {
    deleteUser(userId)
      .then((response) => {
        console.log("Xóa người dùng thành công:", response.data);
        setUsers(users.filter((user) => user.userId !== userId));
      })
      .catch((error) => {
        console.error("Lỗi khi xóa người dùng:", error);
      });
  };

  const handleClose = () => {
    setOpen(false);
    setEditUser(null);
  };

  const handleSave = (updatedUser) => {
    console.log("Saving User:", updatedUser);  // Log dữ liệu trước khi gửi API
    if (!updatedUser || !updatedUser.userId) {
      console.error("User ID is missing");
      return;
    }
  
    const roleAsByte = updatedUser.role === "Admin" ? 1 : 
                       updatedUser.role === "Moderator" ? 3 :
                       updatedUser.role === "StaffPage" ? 4 : 5;
  
    updateUserRole(updatedUser.userId, roleAsByte)
      .then((response) => {
        console.log("Cập nhật vai trò thành công:", response.data);
        setOpen(false);  // Đóng modal
        setEditUser(null);  // Reset lại dữ liệu người dùng
      })
      .catch((error) => {
        console.error("Lỗi khi cập nhật vai trò:", error.response?.data || error.message);
      });
  };
  
  
  
  
  
  

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" color="error" align="center">
        {error}
      </Typography>
    );
  }

  return (
    <Layout>
      <div className="user-management-container" style={{ padding: "20px" }}>
        <h1>Quản lý người dùng</h1>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={9}>
            <TextField
              label="Tìm người dùng"
              variant="outlined"
              value={searchValue}
              onChange={handleSearchChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel>Vai trò</InputLabel>
              <Select
                value={selectedRole}
                onChange={handleRoleChange}
                label="Vai trò"
              >
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="StaffPage">Nhân viên</MenuItem>
                <MenuItem value="Moderator">Moderator</MenuItem>
                <MenuItem value="Member">Member</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <TableContainer component={Paper} style={{ marginTop: "20px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tên người dùng</TableCell>
                <TableCell>Ngày sinh</TableCell>
                <TableCell>Giới tính</TableCell>
                <TableCell>Số điện thoại</TableCell>
                <TableCell>Vai trò</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedUsers.map((user) => {
                const fullName = user.fullName || `${user.lastName || ""} ${user.firstName || ""}`.trim();
                return (
                  <TableRow key={user.userId}>
                    <TableCell>{fullName}</TableCell>
                    <TableCell>{user.dob}</TableCell>
                    <TableCell>{user.gender}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{user.status}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEditUser(user)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(user.userId)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={displayedUsers.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[15, 30, 50]}
          />
        </TableContainer>
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>Cập Nhật Người Dùng</DialogTitle>
          <DialogContent>
            <UserUpdateForm
              user={editUser}
              onSave={handleSave}
              onClose={handleClose}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Hủy
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </Layout>
  );
};

export default UserManagement;