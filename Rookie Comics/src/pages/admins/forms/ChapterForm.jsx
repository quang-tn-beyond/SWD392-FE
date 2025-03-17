import React, { useState, useEffect, useContext } from 'react';
import { TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem, DialogActions, Divider } from '@mui/material';
import { getAllComics } from '../../../utils/ComicService';  // Giả sử bạn có hàm này để lấy danh sách truyện
import { createChapter } from '../../../utils/ChapterService';  // Giả sử bạn có hàm này để tạo chương
import { AuthContext } from '../../../components/AuthContext';

const ChapterForm = ({ onSave, initialChapter, onClose }) => {
  const { user } = useContext(AuthContext); // Lấy thông tin user từ AuthContext

  const [chapterData, setChapterData] = useState({
    chapterName: '',
    comicId: '',    // ID của truyện sẽ được chọn từ Select
    description: '',
    publishedDate: '', // Ngày phát hành
    status: 'active', // Trạng thái
    type: 1,          // Type 1 hoặc 0
  });
  const [comics, setComics] = useState([]); // Lưu danh sách truyện
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    // Lấy danh sách truyện
    const fetchComics = async () => {
      try {
        const response = await getAllComics(); // Giả sử bạn có API để lấy danh sách truyện
        let data = [];
        if (response && response.data && Array.isArray(response.data)) {
          data = response.data;
        } else {
          console.error('Dữ liệu trả về không hợp lệ hoặc không phải mảng:', response);
        }
        setComics(data);
      } catch (error) {
        console.error('Error fetching comics:', error);
      }
    };

    fetchComics();

    // Nếu có initialChapter, thiết lập dữ liệu ban đầu
    if (initialChapter) {
      setChapterData({
        chapterName: initialChapter.chapterName,
        comicId: initialChapter.comicId,
        description: initialChapter.description,
        publishedDate: initialChapter.publishedDate,
        status: initialChapter.status === 1 ? 'active' : 'inactive',
        type: initialChapter.type,
      });
      setIsEdit(true);
    }

  }, [initialChapter]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setChapterData({
      ...chapterData,
      [name]: value,
    });
  };

  const handleSave = async () => {
    const payload = {
      chapterName: chapterData.chapterName,
      comicId: chapterData.comicId,
      description: chapterData.description || '',
      publishedDate: chapterData.publishedDate,
      status: chapterData.status === 'active' ? 1 : 0,
      type: chapterData.type,
    };

    console.log('Payload to send:', payload);

    try {
      const response = await createChapter(payload); // Gửi yêu cầu tạo chương mới
      console.log('Chapter created:', response.data);
      onSave(response.data); // Thực hiện callback để lưu dữ liệu
    } catch (error) {
      console.error('Error creating chapter:', error);
    }
    onClose();
  };

  return (
    <form>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Tên chương"
            name="chapterName"
            variant="outlined"
            fullWidth
            value={chapterData.chapterName}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Truyện</InputLabel>
            <Select
              name="comicId"
              value={chapterData.comicId}
              onChange={handleChange}
              label="Truyện"
            >
              {(comics || []).map((comic) => (
                <MenuItem key={comic.comicId} value={comic.comicId}>
                  {comic.comicName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Mô tả"
            name="description"
            variant="outlined"
            fullWidth
            value={chapterData.description}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Ngày phát hành"
            name="publishedDate"
            variant="outlined"
            type="date"
            fullWidth
            value={chapterData.publishedDate ? chapterData.publishedDate.slice(0, 10) : ''}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              name="status"
              value={chapterData.status}
              onChange={handleChange}
              label="Trạng thái"
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              name="type"
              value={chapterData.type}
              onChange={handleChange}
              label="Type"
            >
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={0}>0</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Hủy
        </Button>
        <Button type="button" onClick={handleSave} color="primary">
          {isEdit ? 'Cập nhật' : 'Thêm'} Chương
        </Button>
      </DialogActions>
    </form>
  );
};

export default ChapterForm;
