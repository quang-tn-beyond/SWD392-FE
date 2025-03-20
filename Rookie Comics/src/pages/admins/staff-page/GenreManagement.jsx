import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Button,
} from "@mui/material";
import GenreForm from "../forms/GenreForm";
import Layout from "../layout";
import { getAllGenres, addGenre } from "../../../utils/GenreService";

const GenreManagement = ({ onSave = () => {} }) => {
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [openDialog, setOpenDialog] = useState(false);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await getAllGenres();
        console.log("API getAllGenres response:", response.data); // Kiểm tra phản hồi từ API
  
        // Kiểm tra nếu response.data là mảng
        if (Array.isArray(response.data)) {
          setGenres(response.data);
        } else {
          console.error("Dữ liệu không phải là mảng:", response.data);
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách thể loại:', error);
      }
    };
  
    fetchGenres();
  }, []);
  
  const searchedGenres = genres.filter((genre) =>
    genre.genresName.toLowerCase().includes(searchValue.toLowerCase())
  );

  const filteredGenres = searchedGenres.filter(
    (genre) => selectedStatus === "all" || genre.status === parseInt(selectedStatus, 10)
  );

  const paginatedGenres = filteredGenres.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSaveGenre = async (newGenre) => {
    try {
      const savedGenre = await addGenre(newGenre);
      setGenres((prevGenres) => [...prevGenres, savedGenre]);
      onSave(savedGenre);
      setOpenDialog(false);
    } catch (error) {
      console.error("Error saving genre:", error);
    }
  };

  const statusLabel = (status) => {
    switch (status) {
      case 1:
        return "Đã xóa";
      case 2:
        return "Đã sửa";
      case 3:
        return "Có sẵn";
      default:
        return "UNKNOWN";
    }
  };

  return (
    <Layout>
      <div style={{ padding: "20px" }}>
        <h1>Quản lý Thể Loại</h1>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              label="Tìm thể loại"
              variant="outlined"
              value={searchValue}
              onChange={handleSearchChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              select
              label="Trạng thái"
              variant="outlined"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              fullWidth
              SelectProps={{ native: true }}
            >
              <option value="all">Tất cả</option>
              <option value="1">Đã xóa</option>
              <option value="2">Đã sửa</option>
              <option value="3">Có sẵn</option>
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button variant="contained" color="primary" fullWidth onClick={() => setOpenDialog(true)}>
              Thêm Thể Loại
            </Button>
          </Grid>
        </Grid>

        {loading ? (
          <p>Loading genres...</p>
        ) : (
          <TableContainer component={Paper} style={{ marginTop: "20px" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Thể loại</TableCell>
                  <TableCell align="center">Mô tả</TableCell>
                  <TableCell align="center">Trạng thái</TableCell>
                  <TableCell align="center">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedGenres.map((genre) => (
                  <TableRow key={genre.genresId}>
                    <TableCell align="center">{genre.genresName}</TableCell>
                    <TableCell align="center">{genre.genresDescription}</TableCell>
                    <TableCell align="center">{statusLabel(genre.status)}</TableCell>
                    <TableCell align="center">
                      <Button variant="contained" color="primary">
                        Quản lý
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={filteredGenres.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[15, 30, 50]}
            />
          </TableContainer>
        )}
      </div>
      <GenreForm open={openDialog} onClose={() => setOpenDialog(false)} onSave={handleSaveGenre} />
    </Layout>
  );
};

export default GenreManagement;
