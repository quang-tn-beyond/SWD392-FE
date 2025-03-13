import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem, DialogActions, DialogContent, Divider } from '@mui/material';
import { getAllGenres } from '../../../utils/GenreService';
import { storage, ref, uploadBytesResumable, getDownloadURL } from '../../../firebase/firebase';

const ComicForm = ({ onSave, initialComic, onClose }) => {
  const [comicData, setComicData] = useState({
    title: '',
    genre: 'Action',
    author: '',
    releaseDate: '',
    imageUrl: '',
  });
  const [genres, setGenres] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [imagePreview, setImagePreview] = useState(null); // For image preview

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await getAllGenres(); // Lấy thể loại từ API
        setGenres(response.data);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    if (initialComic) {
      setComicData({
        title: initialComic.title,
        genre: initialComic.genre,
        author: initialComic.author,
        releaseDate: initialComic.releaseDate,
        imageUrl: initialComic.imageUrl,
      });
      setIsEdit(true);
    }

    fetchGenres();
  }, [initialComic]);

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
      reader.readAsDataURL(file); // Read the file as a data URL

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
              imageUrl: downloadURL, // Save the image URL to the comicData
            });
          });
        }
      );
    }
  };

  const handleSave = () => {
    onSave(comicData);
    onClose();
  };

  return (
    <form>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Tên truyện"
            name="title"
            variant="outlined"
            fullWidth
            value={comicData.title}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Thể loại</InputLabel>
            <Select
              name="genre"
              value={comicData.genre}
              onChange={handleChange}
              label="Thể loại"
            >
              {genres.map((genre) => (
                <MenuItem key={genre.id} value={genre.name}>
                  {genre.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Tác giả"
            name="author"
            variant="outlined"
            fullWidth
            value={comicData.author}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Ngày phát hành"
            name="releaseDate"
            variant="outlined"
            type="date"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            value={comicData.releaseDate}
            onChange={handleChange}
          />
        </Grid>
        <Divider />
        <Grid item xs={12} md={6}>
          <input
            type="file"
            name="imageUrl"
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
        <Button onClick={handleSave} color="primary">
          {isEdit ? 'Cập nhật' : 'Thêm'} Truyện
        </Button>
      </DialogActions>
    </form>
  );
};

export default ComicForm;
