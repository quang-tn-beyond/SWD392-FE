import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Grid,
  TextField,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useParams } from "react-router-dom";
import {
  getAllChapters,
  deleteChapterById,
  getChapterById,
} from "../../../utils/ChapterService";
import Layout from "../layout";
import ChapterForm from "../forms/ChapterForm";

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

const mapTypeToString = (type) => (type === 0 ? "FREE" : "PAID");

const ChapterManagement = () => {
  const { comicId } = useParams();
  const [chapters, setChapters] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  // Hàm này có thể gọi để lấy lại danh sách chương sau khi thêm/chỉnh sửa/xóa
  const fetchChapters = async () => {
    try {
      const response = await getAllChapters(); // API lấy tất cả chapter
      console.log("Dữ liệu API trả về:", response.data); // Kiểm tra dữ liệu API
  
      const filteredChapters = response.data.filter(
        (chapter) => chapter.comicId === comicId // So sánh trực tiếp chuỗi
      );
  
      console.log("Chapter sau khi lọc:", filteredChapters); // Kiểm tra dữ liệu sau khi lọc
      setChapters(filteredChapters);
    } catch (error) {
      console.error("Error fetching chapters:", error);
    }
  };
  

  useEffect(() => {
    fetchChapters();
  }, [comicId]);

  const handleViewImages = async (chapterId) => {
    try {
      const response = await getChapterById(chapterId);
      setSelectedImages(response.data.chapterImages?.map((img) => img.imageURL) || []);
      setOpenImageDialog(true);
    } catch (error) {
      console.error("Error fetching chapter images:", error);
    }
  };

  const handleDeleteChapter = async (chapterId) => {
    if (window.confirm("Bạn có chắc muốn xóa chương này?")) {
      try {
        await deleteChapterById(chapterId);
        setChapters(chapters.filter((chapter) => chapter.chapterId !== chapterId));
      } catch (error) {
        console.error("Error deleting chapter:", error);
      }
    }
  };

  return (
    <Layout>
      <div style={{ padding: "20px" }}>
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
          <Grid item xs={12} md={3}>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              onClick={() => setOpenDialog(true)}
            >
              Thêm Chương
            </Button>
          </Grid>
        </Grid>

        <TableContainer component={Paper} style={{ marginTop: "20px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tên chương</TableCell>
                <TableCell>Ngày xuất bản</TableCell>
                <TableCell>Mô tả</TableCell>
                <TableCell>Loại</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {chapters.map((chapter) => (
                <TableRow key={chapter.chapterId}>
                  <TableCell>{chapter.chapterName}</TableCell>
                  <TableCell>{chapter.publishedDate}</TableCell>
                  <TableCell>{chapter.description}</TableCell>
                  <TableCell>{mapTypeToString(chapter.type)}</TableCell>
                  <TableCell>{mapStatusToString(chapter.status)}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleDeleteChapter(chapter.chapterId)}>
                      <DeleteIcon />
                    </IconButton>
                    <IconButton onClick={() => handleViewImages(chapter.chapterId)}>
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Dialog thêm chương */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>Thêm Chương</DialogTitle>
          <DialogContent>
            <ChapterForm
              comicId={comicId}
              onClose={() => {
                setOpenDialog(false);
                fetchChapters();
              }}
            />
          </DialogContent>
        </Dialog>

        {/* Dialog hiển thị ảnh */}
        <Dialog open={openImageDialog} onClose={() => setOpenImageDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>Danh Sách Ảnh</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              {selectedImages.length > 0 ? (
                selectedImages.map((url, index) => (
                  <Grid item xs={6} md={4} key={index}>
                    <img src={url} alt={`Chapter Image ${index + 1}`} style={{ width: "100%", borderRadius: "8px" }} />
                  </Grid>
                ))
              ) : (
                <p>Không có ảnh nào</p>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenImageDialog(false)} color="secondary">
              Đóng
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </Layout>
  );
};

export default ChapterManagement;
