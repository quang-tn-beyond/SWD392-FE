import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Grid, TextField, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { getAllComics, deleteComicById } from '../../../utils/ComicService';
import { getAllUsers } from '../../../utils/UserService';
import { getAllGenres } from '../../../utils/GenreService';
import Layout from '../layout';

const ComicManagement = () => {
  const [comicsList, setComicsList] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [genresMap, setGenresMap] = useState({});
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();


  
  // Lấy danh sách truyện
  useEffect(() => {
    const fetchComics = async () => {
      try {
        const response = await getAllComics();
        // Giả sử response.data là mảng các đối tượng comic
        setComicsList(response.data);
      } catch (error) {
        console.error('Error fetching comics:', error);
      }
    };
    fetchComics();
  }, []);

  // Lấy danh sách người dùng và tạo mapping theo userId
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        // Giả sử response.data là mảng các đối tượng user với { userId, firstName, lastName }
        const mapping = response.data.reduce((acc, user) => {
          acc[user.userId] = `${user.lastName} ${user.firstName}`;
          return acc;
        }, {});
        setUsersMap(mapping);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  // Lấy danh sách thể loại và tạo mapping theo genresId
 useEffect(() => {
  const fetchGenres = async () => {
    try {
      const response = await getAllGenres();
      console.log("API getAllGenres response:", response.data); // Kiểm tra phản hồi từ API

      // Kiểm tra nếu response.data là mảng
      if (Array.isArray(response.data)) {
        const mapping = response.data.reduce((acc, genre) => {
          acc[genre.genresId] = genre.genresName; // genresId -> genresName
          return acc;
        }, {});
        setGenresMap(mapping);
      } else {
        console.error("Dữ liệu không phải là mảng:", response.data);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách thể loại:', error);
    }
  };

  fetchGenres();
}, []);

 

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleEditComic = (comic) => {
    navigate(`/comic/edit/${comic.comicId}`);
  };

  const handleDelete = async (comicId) => {
    if (window.confirm('Bạn có chắc muốn xóa truyện này?')) {
      try {
        await deleteComicById(comicId);
        setComicsList(comicsList.filter((comic) => comic.comicId !== comicId));
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
                <TableRow key={comic.comicId}>
                  <TableCell>{comic.comicName}</TableCell>
                  <TableCell>{genresMap[comic.genresId] || 'N/A'}</TableCell>
                  <TableCell>{usersMap[comic.userId] || 'N/A'}</TableCell>
                  <TableCell>{comic.description}</TableCell>
                  <TableCell>
                    <img src={comic.coverUrl} alt={comic.comicName} width="50" />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditComic(comic)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(comic.comicId)}>
                      <DeleteIcon />
                    </IconButton>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleManageChapters(comic.comicId)}
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
