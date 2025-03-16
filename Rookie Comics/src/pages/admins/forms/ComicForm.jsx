import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem, DialogActions, Divider } from '@mui/material';
import { getAllGenres } from '../../../utils/GenreService';
import { createComic } from '../../../utils/ComicService'; // Import hàm createComic
import { storage, ref, uploadBytesResumable, getDownloadURL } from '../../../firebase/firebase';

const ComicForm = ({ onSave, initialComic, onClose }) => {
  const [comicData, setComicData] = useState({
    comicName: '',
    genresId: '', // genresId to store selected genre's ID
    userId: '',
    createdDate: '', // The created date (to be updated with current time in LocalDateTime format)
    coverUrl: '',
    description: '',
    status: 'active',
    view: 0, // Default view count is 0
    quantityChap: 0, // Default chapter count is 0
  });
  const [genres, setGenres] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [imagePreview, setImagePreview] = useState(null); // For image preview

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await getAllGenres();
        console.log('Raw API Response:', response);

        // Nếu API trả về đối tượng có thuộc tính data chứa mảng
        let data = [];
        if (response && response.data && Array.isArray(response.data)) {
          data = response.data;
        } else if (Array.isArray(response)) {
          data = response;
        } else {
          console.error('Dữ liệu trả về không hợp lệ hoặc không phải mảng:', response);
          return;
        }

        // Tạo danh sách genres chỉ chứa các trường cần thiết
        const genresList = data.map(item => ({
          genresId: item.genresId,
          genresName: item.genresName,
        }));
        console.log('Processed genresList:', genresList);
        setGenres(genresList);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres();

    // Set current date as createdDate in LocalDateTime format (without timezone)
    const currentDate = new Date().toISOString().slice(0, 19); // ISO 8601 format without the 'Z' at the end
    setComicData((prevData) => ({
      ...prevData,
      createdDate: currentDate, // Set the current time as createdDate
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setComicData({
      ...comicData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Generate the preview URL for the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Save file to Firebase Storage
      const storageRef = ref(storage, `comics/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on('state_changed',
        (snapshot) => {
          // Handle progress here (optional)
        },
        (error) => {
          console.error('Upload failed', error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setComicData({
              ...comicData,
              coverUrl: downloadURL,
            });
          });
        }
      );
    }
  };

  const handleSave = async () => {
    // Cập nhật payload cho phù hợp với backend
    const payload = {
      comicName: comicData.comicName,
      userId: comicData.userId,
      createdDate: comicData.createdDate,  // Đã tự động lấy thời gian hiện tại ở trên
      quantityChap: comicData.quantityChap || 0,  // Nếu không có giá trị, mặc định là 0
      coverUrl: comicData.coverUrl,
      description: comicData.description || '',  // Nếu không có mô tả, mặc định là ''
      status: comicData.status === 'active' ? 1 : 0,  // Chuyển 'active'/'inactive' thành 1/0
      view: comicData.view || 0,  // Nếu không có, mặc định là 0
      genresId: comicData.genresId,  // genresId phải khớp với backend
    };

    console.log('Payload to send:', payload);

    try {
      const response = await createComic(payload);
      console.log('Comic created:', response.data);
      onSave(response.data);  // Gửi dữ liệu trả về cho component cha nếu cần
    } catch (error) {
      console.error('Error creating comic:', error);
    }
    onClose();
  };

  return (
    <form>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Tên truyện"
            name="comicName"
            variant="outlined"
            fullWidth
            value={comicData.comicName}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Thể loại</InputLabel>
            <Select
              name="genresId"
              value={comicData.genresId}
              onChange={handleChange}
              label="Thể loại"
            >
              {(genres || []).map((genre) => (
                <MenuItem key={genre.genresId} value={genre.genresId}>
                  {genre.genresName} {/* Hiển thị tên thể loại */}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="Tác giả"
            name="userId"
            variant="outlined"
            fullWidth
            value={comicData.userId}
            onChange={handleChange}
          />
        </Grid>
        {/* Ngày phát hành không cần nhập nữa */}
        <Grid item xs={12} md={6}>
          <TextField
            label="Ngày phát hành"
            variant="outlined"
            type="date"
            fullWidth
            value={comicData.createdDate ? comicData.createdDate.slice(0, 10) : ''}  // Hiển thị ngày theo định dạng yyyy-MM-dd
            InputLabelProps={{
              shrink: true,
            }}
            disabled
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Mô tả"
            name="description"
            variant="outlined"
            fullWidth
            value={comicData.description}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              name="status"
              value={comicData.status}
              onChange={handleChange}
              label="Trạng thái"
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Divider />
        <Grid item xs={12} md={6}>
          <input
            type="file"
            name="coverUrl"
            accept="image/*"
            onChange={handleFileChange}
            style={{ width: '100%', padding: '8px', borderRadius: '4px' }}
          />
        </Grid>
        {imagePreview && (
          <Grid item xs={12} md={6}>
            <img
              src={imagePreview}
              alt="Image Preview"
              style={{
                width: '100%',
                height: 'auto',
                marginTop: '10px',
                objectFit: 'cover',
              }}
            />
          </Grid>
        )}
      </Grid>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Hủy
        </Button>
        <Button type="button" onClick={handleSave} color="primary">
          {isEdit ? 'Cập nhật' : 'Thêm'} Truyện
        </Button>
      </DialogActions>
    </form>
  );
};

export default ComicForm;
