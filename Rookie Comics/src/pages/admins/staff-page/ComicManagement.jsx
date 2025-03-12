import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Grid, TextField, IconButton, Dialog, DialogTitle, DialogContent } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { comics } from '../../../data';
import ComicForm from '../forms/ComicForm';

const ComicManagement = () => {
  const [comicsList, setComicsList] = useState([]);  // Renamed state to comicsList
  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [open, setOpen] = useState(false);
  const [initialComic, setInitialComic] = useState(null);

  const navigate = useNavigate();

  // Use mock data instead of fetching from an API
  useEffect(() => {
    const fetchComics = () => {
      setComicsList(comics);  // Set comics state from mock data
    };

    fetchComics();
  }, []);

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleAddComic = () => {
    setInitialComic(null);
    setOpen(true);
  };

  const handleEditComic = (comic) => {
    setInitialComic(comic);
    setOpen(true);
  };

  const handleDelete = (comicId) => {
    if (window.confirm('Bạn có chắc muốn xóa truyện này?')) {
      setComicsList(comicsList.filter((comic) => comic.id !== comicId));
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    setOpen(false);
  };

  const filteredComics = comicsList.filter((comic) =>
    comic.title.toLowerCase().includes(searchValue.toLowerCase())
  );

  const paginatedComics = filteredComics.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Quản lý Truyện Tranh</h1>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={9}>
          <TextField
            label="Tìm truyện"
            variant="outlined"
            value={searchValue}
            onChange={handleSearchChange}
            fullWidth
          />
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddComic}
          >
            Thêm Truyện Tranh
          </Button>
        </Grid>
      </Grid>

      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên truyện</TableCell>
              <TableCell>Thể loại</TableCell>
              <TableCell>Tác giả</TableCell>
              <TableCell>Ngày phát hành</TableCell>
              <TableCell>Ảnh bìa</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedComics.map((comic) => (
              <TableRow key={comic.id}>
                <TableCell>{comic.title}</TableCell>
                <TableCell>{comic.genre}</TableCell>
                <TableCell>{comic.author}</TableCell>
                <TableCell>{comic.releaseDate}</TableCell>
                <TableCell><img src={comic.imageUrl} alt={comic.title} width="50" /></TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditComic(comic)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(comic.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>{initialComic ? 'Cập nhật Truyện' : 'Thêm Truyện'}</DialogTitle>
        <DialogContent>
          <ComicForm onSave={handleSave} initialComic={initialComic} onClose={handleClose} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ComicManagement;
