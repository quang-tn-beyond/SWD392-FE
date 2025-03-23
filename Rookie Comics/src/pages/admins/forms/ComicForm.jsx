import React, { useState, useEffect, useContext } from 'react';
import { TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem, DialogActions, Divider } from '@mui/material';
import { getAllGenres } from '../../../utils/GenreService';
import { createComic } from '../../../utils/ComicService';
import { storage, ref, uploadBytesResumable, getDownloadURL } from '../../../firebase/firebase';
import { AuthContext } from '../../../components/AuthContext';
import { getUserIdByEmail } from '../../../utils/UserService';


const ComicForm = ({ onSave, initialComic, onClose }) => {
  const { user } = useContext(AuthContext); // Lấy thông tin user từ AuthContext

  const [comicData, setComicData] = useState({
    comicName: '',
    genresId: '',
    userId: '',      // Đây là userId được ánh xạ qua API (sẽ gửi về backend)
    userEmail: '',   // Dùng hiển thị email của tác giả trong form
    createdDate: '',
    coverUrl: '',
    description: '',
    status: 'active',
    view: 0,
    quantityChap: 0,
  });
  const [genres, setGenres] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    // Lấy danh sách thể loại
    const fetchGenres = async () => {
      try {
        const response = await getAllGenres();
        let data = [];
        if (response && response.data && Array.isArray(response.data)) {
          data = response.data;
        } else if (Array.isArray(response)) {
          data = response;
        } else {
          console.error('Dữ liệu trả về không hợp lệ hoặc không phải mảng:', response);
          return;
        }
  
        // Chuyển dữ liệu thành mảng thể loại với genresId và genresName
        const genresList = data.map(item => ({
          genresId: item.genresId,
          genresName: item.genresName,
        }));
        setGenres(genresList);  // Lưu vào state genres
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };
  
    fetchGenres();
  
  }, []);

  useEffect(() => {
    if (user) {
      setComicData((prevData) => ({
        ...prevData,
        userEmail: user.email, // Set the user email from AuthContext
        userId: user.userId,   // Make sure userId is set if needed
        createdDate: new Date().toISOString().slice(0, 19), // ISO format (yyyy-MM-ddTHH:mm:ss)
      }));
    }
  }, [user]);
  
  
  
  

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
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
  
      const storageRef = ref(storage, `comics/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
  
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Xử lý tiến trình upload nếu cần
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
    // Kiểm tra nếu có thông tin user và email
    if (!user || !user.email) {
      console.error('Không có email người dùng để lấy userId');
      return;
    }
  
    // Gọi hàm getUserIdByEmail để lấy userId từ email của người dùng
    const userIdFromApi = await getUserIdByEmail(user.email);
  
    // Kiểm tra nếu không lấy được userId từ API
    if (!userIdFromApi) {
      console.error('Không tìm thấy userId cho email:', user.email);
      return;
    }
  
    // Tạo payload để gửi API
    const payload = {
      comicName: comicData.comicName,
      userId: userIdFromApi,  // Sử dụng userId lấy từ API
      createdDate: comicData.createdDate,
      quantityChap: comicData.quantityChap || 0,
      coverUrl: comicData.coverUrl,
      description: comicData.description || '',
      status: comicData.status === 'active' ? 1 : 0,
      view: comicData.view || 0,
      genresId: comicData.genresId,
    };
  
    console.log('Payload to send:', payload);
  
    try {
      const response = await createComic(payload);
      console.log('Comic created:', response.data);
      onSave(response.data); // Callback khi thành công
    } catch (error) {
      console.error('Error creating comic:', error);
    }
  
    onClose(); // Đóng form sau khi xử lý xong
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
                  {genre.genresName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {/* Hiển thị email ở ô tác giả */}
        <Grid item xs={12} md={6}>
          <TextField
            label="Tác giả"
            name="userEmail"
            variant="outlined"
            fullWidth
            value={comicData.userEmail}
            disabled
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Ngày phát hành"
            variant="outlined"
            type="date"
            fullWidth
            value={comicData.createdDate ? comicData.createdDate.slice(0, 10) : ''}
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
