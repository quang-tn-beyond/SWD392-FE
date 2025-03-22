import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Grid, TextField, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteChapterById, updateChapterById, getAllChapters } from '../../../utils/ChapterService';
import Layout from '../layout';

const mapStatusToString = (status) => {
  switch (status) {
    case 0:
      return "PENDING";
    case 1:
      return "LOCKED";
    case 2:
      return "UNLOCKED";
    case 3:
      return "DELETED";
    default:
      return "PENDING";
  }
};

const mapStatusToByte = (status) => {
  switch (status) {
    case "PENDING":
      return 0;
    case "LOCKED":
      return 1;
    case "UNLOCKED":
      return 2;
    case "DELETED":
      return 3;
    default:
      return 0;
  }
};

const ChapterManagement4Mod = () => {
  const { comicId } = useParams();
  const navigate = useNavigate();
  const [chapters, setChapters] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("PENDING");

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await getAllChapters(comicId);
        setChapters(response.data.filter(chapter => mapStatusToString(chapter.status) === "PENDING"));
      } catch (error) {
        console.error('Error fetching chapters:', error);
      }
    };
    fetchChapters();
  }, [comicId]);

  const handleEditChapter = (chapter) => {
    setCurrentChapter(chapter);
    setSelectedStatus(mapStatusToString(chapter.status));
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSaveStatus = async () => {
    if (currentChapter) {
      try {
        await updateChapterById(currentChapter.chapterId, { status: mapStatusToByte(selectedStatus) });
        setChapters(chapters.map(chapter => chapter.chapterId === currentChapter.chapterId ? { ...chapter, status: mapStatusToByte(selectedStatus) } : chapter));
        handleCloseDialog();
      } catch (error) {
        console.error('Error updating chapter status:', error);
      }
    }
  };

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

  return (
    <Layout>
      <div style={{ padding: '20px' }}>
        <h2>Quản lý Chương</h2>
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
              {chapters.map((chapter) => (
                <TableRow key={chapter.chapterId}>
                  <TableCell>{chapter.chapterName}</TableCell>
                  <TableCell>{chapter.publishedDate}</TableCell>
                  <TableCell>{mapStatusToString(chapter.status)}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditChapter(chapter)}>
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

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Chỉnh sửa trạng thái chương</DialogTitle>
          <DialogContent>
            <FormControl fullWidth>
              <InputLabel>Trạng thái</InputLabel>
              <Select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                <MenuItem value="PENDING">PENDING</MenuItem>
                <MenuItem value="LOCKED">LOCKED</MenuItem>
                <MenuItem value="UNLOCKED">UNLOCKED</MenuItem>
                <MenuItem value="DELETED">DELETED</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="secondary">Hủy</Button>
            <Button onClick={handleSaveStatus} color="primary">Lưu</Button>
          </DialogActions>
        </Dialog>
      </div>
    </Layout>
  );
};

export default ChapterManagement4Mod;