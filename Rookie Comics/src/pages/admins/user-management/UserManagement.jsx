// src/pages/UserManagement.jsx
import React, { useState } from "react";
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
  } from "@mui/material"; // Updated to @mui/material for Material-UI v5
  
  import EditIcon from "@mui/icons-material/Edit"; // Updated to @mui/icons-material
  import DeleteIcon from "@mui/icons-material/Delete"; // Updated to @mui/icons-material
import Layout from "../layout";
  


const UserManagement = () => {
  // State quản lý tìm kiếm, phân trang và dialog cập nhật người dùng
  const [searchValue, setSearchValue] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [open, setOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);

  // Giả sử có mảng dữ liệu người dùng
  const users = [
    {
      userId: 1,
      fullName: "Nguyễn Văn A",
      dob: "1990-01-01",
      gender: "Nam",
      phone: "0123456789",
      role: "Admin",
      status: "Active",
    },
    {
      userId: 2,
      fullName: "Trần Thị B",
      dob: "1992-05-10",
      gender: "Nữ",
      phone: "0987654321",
      role: "Staff",
      status: "Inactive",
    },
    // Thêm các người dùng khác...
  ];

  // Lọc người dùng theo tìm kiếm và vai trò
  const displayedUsers = users.filter((user) => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchValue.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  // Phân trang dữ liệu
  const paginatedUsers = displayedUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Các hàm xử lý
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

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditUser = (user) => {
    setEditUser(user);
    setOpen(true);
  };

  const handleDelete = (userId) => {
    // Thực hiện xóa người dùng tại đây
    console.log("Delete user with ID:", userId);
  };

  const handleClose = () => {
    setOpen(false);
    setEditUser(null);
  };

  const handleSave = (updatedUser) => {
    // Thực hiện lưu thông tin người dùng cập nhật tại đây
    console.log("Save user:", updatedUser);
    setOpen(false);
    setEditUser(null);
  };

  return (
    <Layout>
    <div className="user-management-container" style={{ padding: "20px" }}>
      <h1>Quản lý người dùng</h1>
      <Grid container spacing={2} alignItems="center" className="user-management-controls">
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
              <MenuItem value="Staff">Nhân viên</MenuItem>
              <MenuItem value="Member">Thành viên</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <TableContainer component={Paper} className="user-management-table-container" style={{ marginTop: "20px" }}>
        <Table className="user-management-table">
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
            {paginatedUsers.map((user) => (
              <TableRow key={user.userId}>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.dob}</TableCell>
                <TableCell>{user.gender}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.status}</TableCell>
                <TableCell className="user-management-actions">
                  <IconButton onClick={() => handleEditUser(user)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(user.userId)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
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
          className="user-management-pagination"
        />
      </TableContainer>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Cập Nhật Người Dùng</DialogTitle>
        <DialogContent>
          {/* <UserForm onSave={handleSave} initialUser={editUser} /> */}
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
