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

// Import functions for fetching orders from backend
import { getAllOrders, deleteOrders, updateOrderStatus } from "../../../utils/OrderService";


const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [open, setOpen] = useState(false);
  const [editOrder, setEditOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAllOrders()
      .then((response) => {
        console.log("All Orders:", response.data); // Log order data
        setOrders(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
        setError("Có lỗi khi tải dữ liệu đơn hàng.");
        setLoading(false);
      });
  }, []);

  const displayedOrders = orders.filter((order) => {
    const matchesSearch = order.orderId.toLowerCase().includes(searchValue.toLowerCase());
    const matchesStatus = selectedStatus === "all" || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const paginatedOrders = displayedOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
    setPage(0);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleEditOrder = (order) => {
    setEditOrder(order);
    setOpen(true); // Open modal for editing
  };

  const handleDelete = (orderId) => {
    deleteOrders(orderId)
      .then((response) => {
        console.log("Deleted Order successfully:", response.data);
        setOrders(orders.filter((order) => order.orderId !== orderId));
      })
      .catch((error) => {
        console.error("Error deleting order:", error);
      });
  };

  const handleClose = () => {
    setOpen(false);
    setEditOrder(null);
  };

  const handleSave = (updatedOrder) => {
    updateOrderStatus(updatedOrder.orderId, updatedOrder.status)
      .then((response) => {
        console.log("Order status updated successfully:", response.data);
        setOpen(false);
        setEditOrder(null);
      })
      .catch((error) => {
        console.error("Error updating order status:", error);
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
      <div className="order-management-container" style={{ padding: "20px" }}>
        <h1>Quản lý đơn hàng</h1>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={9}>
            <TextField
              label="Tìm đơn hàng"
              variant="outlined"
              value={searchValue}
              onChange={handleSearchChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={selectedStatus}
                onChange={handleStatusChange}
                label="Trạng thái"
              >
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="1">Chưa xác nhận</MenuItem>
                <MenuItem value="2">Đã xác nhận</MenuItem>
                <MenuItem value="3">Đang giao</MenuItem>
                <MenuItem value="4">Hoàn thành</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <TableContainer component={Paper} style={{ marginTop: "20px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mã đơn hàng</TableCell>
                <TableCell>Ngày đặt</TableCell>
                <TableCell>Số lượng</TableCell>
                <TableCell>Tổng giá</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedOrders.map((order) => (
                <TableRow key={order.orderId}>
                  <TableCell>{order.orderId}</TableCell>
                  <TableCell>{order.orderTime}</TableCell>
                  <TableCell>{order.quantity}</TableCell>
                  <TableCell>{order.totalPrice}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditOrder(order)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(order.orderId)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={displayedOrders.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[15, 30, 50]}
          />
        </TableContainer>
        {/* <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>Cập Nhật Đơn Hàng</DialogTitle>
          <DialogContent>
            <OrderUpdateForm order={editOrder} onSave={handleSave} onClose={handleClose} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Hủy
            </Button>
          </DialogActions>
        </Dialog> */}
      </div>
    </Layout>
  );
};

export default OrderManagement;
