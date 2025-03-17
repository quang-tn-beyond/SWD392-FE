import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Grid, TextField, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { getAllComics, deleteComicById } from '../../../utils/ComicService';
import Layout from '../layout';

const ComicManagement = () => {
  const [comicsList, setComicsList] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComics = async () => {
      try {
        const response = await getAllComics();
        // Giả sử API trả về data là mảng các đối tượng comic
        // Nếu backend chưa join thêm genresName và tác giả,
        // bạn có thể xử lý thêm mapping dựa trên genresId và userId
        setComicsList(response.data);
      } catch (error) {
        console.error('Error fetching comics:', error);
      }
    };

    fetchComics();
  }, []);

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleEditComic = (comic) => {
    navigate(`/comic/edit/${comic.id}`);
  };

  const handleDelete = async (comicId) => {
    if (window.confirm('Bạn có chắc muốn xóa truyện này?')) {
      try {
        await deleteComicById(comicId);
        setComicsList(comicsList.filter((comic) => comic.id !== comicId));
      } catch (error) {
        console.error('Error deleting comic:', error);
      }
    }
  };

  const handleManageChapters = (comicId) => {
    navigate(`/comic/${comicId}/chapters`);
  };

  const filteredComics = comicsList.filter((comic) =>
    comic.comicName.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <Layout>
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
        </Grid>

        <TableContainer component={Paper} style={{ marginTop: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tên truyện</TableCell>
                <TableCell>Thể loại</TableCell>
                <TableCell>Tác giả</TableCell>
                <TableCell>Mô tả</TableCell>
                <TableCell>Ảnh bìa</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredComics.map((comic) => (
                <TableRow key={comic.id}>
                  <TableCell>{comic.comicName}</TableCell>
                  {/* Nếu API trả về genresName thay vì genresId */}
                  <TableCell>{comic.genresName || comic.genresId}</TableCell>
                  {/* Nếu API trả về thông tin tác giả (firstName, lastName) hoặc authorName */}
                  <TableCell>{comic.authorName || comic.userId}</TableCell>
                  <TableCell>{comic.description}</TableCell>
                  <TableCell>
                    <img src={comic.coverUrl} alt={comic.comicName} width="50" />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditComic(comic)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(comic.id)}>
                      <DeleteIcon />
                    </IconButton>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleManageChapters(comic.id)}
                    >
                      Quản lý Chapter
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Layout>
  );
};

export default ComicManagement;
