import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Grid, TextField, IconButton, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { getAllChapters } from '../../../utils/ChapterService';
import { reviewChapter } from '../../../utils/ChapterService'; // Import reviewChapter function
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
  const [chapters, setChapters] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(null);

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

  const handleReviewChapter = (chapter, isApproved) => {
    setCurrentChapter(chapter);
    // Gọi hàm reviewChapter để duyệt hoặc từ chối chương
    const modComment = isApproved ? "Approved" : "Declined";
    reviewChapter(chapter.chapterId, isApproved, modComment)
      .then(() => {
        // Cập nhật lại danh sách chương sau khi duyệt hoặc từ chối
        setChapters(chapters.filter(chap => chap.chapterId !== chapter.chapterId)); // Xóa chương đã duyệt ra khỏi danh sách
      })
      .catch((error) => {
        console.error('Error reviewing chapter:', error);
      });
  };

  return (
    <Layout>
      <div style={{ padding: '20px' }}>
        <h2>Kiểm duyệt Chương</h2>
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
                    <Button onClick={() => handleReviewChapter(chapter, true)} color="primary">
                      Đồng ý duyệt
                    </Button>
                    <Button onClick={() => handleReviewChapter(chapter, false)} color="secondary">
                      Từ chối duyệt
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

export default ChapterManagement4Mod;
