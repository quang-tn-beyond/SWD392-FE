import React, { useState, useEffect, useContext } from 'react';
import { TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem, DialogActions, Divider } from '@mui/material';
import { getAllGenres } from '../../../utils/GenreService';
// import { createComic } from '../../../utils/ComicService'; // Import hàm createComic
import { storage, ref, uploadBytesResumable, getDownloadURL } from '../../../firebase/firebase';
import { AuthContext } from '../../../components/AuthContext';

const ComicForm = ({ onSave, initialComic, onClose }) => {
  const { user } = useContext(AuthContext);  // Access the logged-in user from AuthContext

  const [comicData, setComicData] = useState({
    comicName: '',
    genresId: '', // genresId to store selected genre's ID
    userId: '',   // userId of the current logged-in user
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

        let data = [];
        if (response && response.data && Array.isArray(response.data)) {
          data = response.data;
        } else if (Array.isArray(response)) {
          data = response;
        } else {
          console.error('Dữ liệu trả về không hợp lệ hoặc không phải mảng:', response);
          return;
        }

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
      userId: user ? user.email : '', // Get the userId (email or user identifier) from AuthContext
    }));
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
    const payload = {
      comicName: comicData.comicName,
      userId: comicData.userId, // Ensure userId is set from AuthContext
      createdDate: comicData.createdDate,
      quantityChap: comicData.quantityChap || 0,  // If not provided, default to 0
      coverUrl: comicData.coverUrl,
      description: comicData.description || '',  // If no description, default to ''
      status: comicData.status === 'active' ? 1 : 0,  // Convert 'active'/'inactive' to 1/0
      view: comicData.view || 0,  // Default to 0 if no view count
      genresId: comicData.genresId,
    };

    console.log('Payload to send:', payload);

    try {
      const response = await createComic(payload);
      console.log('Comic created:', response.data);
      onSave(response.data);
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
                  {genre.genresName} {/* Display genre name */}
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
            disabled // Disable the field as it's automatically set from AuthContext
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="Ngày phát hành"
            variant="outlined"
            type="date"
            fullWidth
            value={comicData.createdDate ? comicData.createdDate.slice(0, 10) : ''}  // Display date as yyyy-MM-dd
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
