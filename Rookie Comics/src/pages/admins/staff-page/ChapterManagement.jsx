import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Grid, TextField, IconButton, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate, useParams } from 'react-router-dom';
import { getChapterById, deleteChapterById } from '../../../utils/ChapterService';
import Layout from '../layout';
import ChapterForm from '../forms/ChapterForm';

const ChapterManagement = () => {
  const { comicId } = useParams(); // Lấy comicId từ URL
  const navigate = useNavigate();
  const [chapters, setChapters] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [openDialog, setOpenDialog] = useState(false); // Trạng thái mở/đóng Dialog
  const [currentChapter, setCurrentChapter] = useState(null); // Chương hiện tại đang chỉnh sửa

  // Lấy danh sách chương theo comicId
  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await getChapterById(comicId);
        setChapters(response.data);
      } catch (error) {
        console.error('Error fetching chapters:', error);
      }
    };
    fetchChapters();
  }, [comicId]);

  // Điều hướng tới trang chỉnh sửa chương
  const handleEditChapter = (chapterId) => {
    navigate(`/chapter/edit/${comicId}/${chapterId}`);
  };

  // Mở dialog thêm chương
  const handleAddChapter = () => {
    setCurrentChapter(null); // Đặt null cho chương mới
    setOpenDialog(true);
  };

  // Đóng dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Xử lý xóa chương
  const handleDeleteChapter = async (chapterId) => {
    if (window.confirm('Bạn có chắc muốn xóa chương này?')) {
      try {
        await deleteChapterById(chapterId);
        setChapters(chapters.filter((chapter) => chapter.chapterId !== chapterId));
      } catch (error) {
        console.error('Error deleting chapter:', error);
      }
    }
  };

  // Lọc chương theo tên chương
  const filteredChapters = chapters.filter((chapter) =>
    chapter.chapterName.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <Layout>
      <div style={{ padding: '20px' }}>
        <h2>Quản lý Chương</h2>

        {/* Tìm kiếm chương */}
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={9}>
            <TextField
              label="Tìm chương"
              variant="outlined"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              fullWidth
            />
          </Grid>
        </Grid>

        {/* Nút thêm chương */}
        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: '20px' }}
          onClick={handleAddChapter}
        >
          Thêm chương
        </Button>

        {/* Bảng danh sách chương */}
        <TableContainer component={Paper} style={{ marginTop: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tên chương</TableCell>
                <TableCell>Ngày xuất bản</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredChapters.map((chapter) => (
                <TableRow key={chapter.chapterId}>
                  <TableCell>{chapter.chapterName}</TableCell>
                  <TableCell>{chapter.publishedDate}</TableCell>
                  <TableCell>{chapter.status === 1 ? 'Active' : 'Inactive'}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditChapter(chapter.chapterId)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteChapter(chapter.chapterId)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Dialog mở form thêm/chỉnh sửa chương */}
        <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
          <DialogTitle>{currentChapter ? 'Cập nhật Chương' : 'Thêm Chương'}</DialogTitle>
          <DialogContent>
            <ChapterForm
              comicId={comicId}
              initialChapter={currentChapter}
              onClose={handleCloseDialog}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Hủy
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </Layout>
  );
};

export default ChapterManagement;
