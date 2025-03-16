import React, { useState, useEffect } from "react";
import { Grid, TextField, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, TablePagination, Button } from "@mui/material";
import GenreForm from "../forms/GenreForm";
import Layout from "../layout";
import { getAllGenres, addGenre } from "../../../utils/GenreService"; // Use addGenre instead of saveGenre

const GenreManagement = ({ onSave = () => {} }) => {  // Default empty function if onSave is not passed
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [openDialog, setOpenDialog] = useState(false);
  const [genres, setGenres] = useState([]); // Initialize genres to an empty array
  const [loading, setLoading] = useState(false);

  // Fetch genres from API on component mount
  useEffect(() => {
    const fetchGenres = async () => {
      setLoading(true);
      try {
        const fetchedGenres = await getAllGenres();
        if (Array.isArray(fetchedGenres)) {
          setGenres(fetchedGenres); // Set to the fetched genres
        } else {
          console.error("Invalid data format for genres:", fetchedGenres);
          setGenres([]); // Set empty if the format is wrong
        }
      } catch (error) {
        console.error("Error fetching genres:", error);
        setGenres([]); // Fallback to empty if there's an error
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  const filteredGenres = (genres || []).filter((genre) =>
    genre?.genresName?.toLowerCase().includes(searchValue.toLowerCase()) // Check for the existence of genre.genresName
  );

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

  const handleSaveGenre = async (newGenre) => {
    try {
      const savedGenre = await addGenre(newGenre); // Use addGenre to add a new genre
      setGenres((prevGenres) => [...prevGenres, savedGenre]); // Update the genres state with the new genre
      onSave(savedGenre); // Optionally notify the parent component
      setOpenDialog(false); // Close the form dialog
    } catch (error) {
      console.error("Error saving genre:", error);
    }
  };

  return (
    <Layout>
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
          <Grid item xs={12} md={3}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => setOpenDialog(true)} // Open the dialog to add a new genre
            >
              Thêm Thể Loại
            </Button>
          </Grid>
        </Grid>

        {loading ? (
          <p>Loading genres...</p> // Show loading message while fetching genres
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
                  <TableRow key={genre.id}>
                    <TableCell align="center">{genre.genresName}</TableCell> {/* Changed name to genresName */}
                    <TableCell align="center">{genre.genresDescription}</TableCell> {/* Changed description to genresDescription */}
                    <TableCell align="center">{genre.status ? "Active" : "Inactive"}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => console.log("Managing books for genre ID:", genre.id)}
                      >
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

      {/* Pass the genres and onSave to GenreForm */}
      <GenreForm open={openDialog} onClose={() => setOpenDialog(false)} onSave={handleSaveGenre} />
    </Layout>
  );
};

export default GenreManagement;
