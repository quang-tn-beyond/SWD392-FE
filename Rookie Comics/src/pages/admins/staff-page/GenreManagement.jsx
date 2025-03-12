// src/pages/GenreManagement.jsx
import React, { useState } from "react";
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, TablePagination, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const GenreManagement = () => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  const navigate = useNavigate();

  // Giả lập dữ liệu thể loại, bạn có thể thay thế bằng API hoặc dữ liệu động.
  const genres = [
    "Action",
    "Fantasy",
    "Sci-fi",
    "Thriller",
    "Adventure",
    "Horror",
    "Mystery",
    "Romance"
  ];

  // Lọc thể loại theo tìm kiếm
  const filteredGenres = genres.filter((genre) =>
    genre.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Phân trang dữ liệu
  const paginatedGenres = filteredGenres.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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

  return (
    <div style={{ padding: "20px" }}>
      <h1>Quản lý Thể Loại</h1>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={9}>
          <TextField
            label="Tìm thể loại"
            variant="outlined"
            value={searchValue}
            onChange={handleSearchChange}
            fullWidth
          />
        </Grid>
      </Grid>

      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Thể loại</TableCell>
              <TableCell align="center">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedGenres.map((genre, index) => (
              <TableRow key={index}>
                <TableCell align="center">{genre}</TableCell>
                <TableCell align="center">
                  <Button variant="contained" color="primary" onClick={() => { /* Thực hiện thao tác với thể loại */ }}>
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
    </div>
  );
};

export default GenreManagement;
