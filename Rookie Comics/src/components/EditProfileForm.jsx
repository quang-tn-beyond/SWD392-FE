import React, { useState, useEffect, useContext } from 'react';
import { TextField, Button, Grid, DialogActions } from '@mui/material';
import { AuthContext } from './AuthContext';
import { updateUser } from '../utils/UserService'; // Import updateUser từ service
import { storage, ref, uploadBytesResumable, getDownloadURL } from '../firebase/firebase';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { getUserIdByEmail } from '../utils/UserService'; // Giả sử bạn có hàm này trong service

const EditProfileForm = ({ open, handleClose, userData, handleUpdate }) => {
  const { user } = useContext(AuthContext); // Lấy user từ AuthContext
  const [formData, setFormData] = useState(userData);
  const [avatarUrl, setAvatarUrl] = useState(userData.avatarUrl || ""); // Lưu URL của ảnh avatar
  const [imagePreview, setImagePreview] = useState(null); // Lưu ảnh xem trước

  

  useEffect(() => {
    setFormData(userData); // Cập nhật formData mỗi khi userData thay đổi
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Chỉ lấy file đầu tiên
    if (file) {
      const storageRef = ref(storage, `avatars/${file.name}`); // Sử dụng storage đã import
      const uploadTask = uploadBytesResumable(storageRef, file);
  
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Có thể thêm code để theo dõi tiến độ upload tại đây nếu muốn
        },
        (error) => {
          console.error("Error uploading file:", error);
        },
        async () => {
          // Sau khi upload thành công
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref); // Lấy URL của ảnh đã upload
            setAvatarUrl(downloadURL); // Cập nhật avatarUrl với URL đã tải từ Firebase
            setImagePreview(URL.createObjectURL(file)); // Tạo xem trước ảnh
          } catch (error) {
            console.error("Lỗi khi lấy URL tải về từ Firebase:", error);
          }
        }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Đảm bảo rằng tất cả các trường đều có giá trị trong formData
    const updatedData = {
      ...formData,
      avatarUrl,
      phoneNumber: formData.phoneNumber, // Đảm bảo trường phoneNumber tồn tại
      birthDate: formData.birthDate, // Đảm bảo trường birthDate tồn tại
      gender: formData.gender, // Đảm bảo trường gender tồn tại
      role: formData.role || userData.role, // Giữ nguyên role nếu không thay đổi từ formData
      email: formData.email || userData.email, // Giữ nguyên email nếu không thay đổi
    };
  
    try {
      // Lấy userId từ email thông qua getUserIdByEmail
      const userId = await getUserIdByEmail(user.email);
      
      // Thêm userId vào updatedData
      updatedData.userId = userId;
  
      // In ra dữ liệu payload trước khi gửi
      console.log("Payload data:", updatedData);
  
      // Gửi dữ liệu đã thay đổi đến backend
      const response = await updateUser(userId, updatedData);
      if (response.success) {
        handleUpdate(response.data);
        handleClose();
      } else {
        console.error('Cập nhật thất bại');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật hồ sơ:', error);
    }
  };
  
  

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="First Name"
            variant="outlined"
            fullWidth
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Last Name"
            variant="outlined"
            fullWidth
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Phone Number"
            variant="outlined"
            fullWidth
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Birth Date"
            variant="outlined"
            type="date"
            fullWidth
            name="birthDate"
            value={formData.birthDate}
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12}>
        <FormControl fullWidth>
  <InputLabel>Gender</InputLabel>
  <Select
    name="gender"
    value={formData.gender || ""} // Đảm bảo giá trị không phải undefined hoặc null
    onChange={handleInputChange}
  >
    <MenuItem value="Male">Nam</MenuItem>
    <MenuItem value="Female">Nữ</MenuItem>
    <MenuItem value="Other">Khác</MenuItem>
  </Select>
</FormControl>
        </Grid>
        <Grid item xs={12}>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Avatar Preview"
              style={{ width: '100px', height: '100px', objectFit: 'cover' }}
            />
          )}
          {avatarUrl && !imagePreview && (
            <img
              src={avatarUrl}
              alt="Current Avatar"
              style={{ width: '100px', height: '100px', objectFit: 'cover' }}
            />
          )}
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Cập nhật hồ sơ
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default EditProfileForm;
