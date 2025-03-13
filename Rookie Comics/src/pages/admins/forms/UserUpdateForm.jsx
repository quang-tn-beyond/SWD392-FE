import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';

const UserUpdateForm = ({ user, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    role: 'MEMBER', // Default role
  });

  useEffect(() => {
    if (user) {
      setFormData({
        role: user.role || 'MEMBER', // Only the role is being passed here
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    onSave(formData); // Trigger the onSave function to save only the role
  };

  return (
    <form>
      <FormControl fullWidth variant="outlined" margin="normal">
        <InputLabel>Vai trò</InputLabel>
        <Select
          name="role"
          value={formData.role}
          onChange={handleChange}
          label="Vai trò"
        >
            <MenuItem value="all">Tất cả</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="StaffPage">Nhân viên</MenuItem>
            <MenuItem value="Moderator">Moderator</MenuItem>
            <MenuItem value="Member">Member</MenuItem>
        </Select>
      </FormControl>
      <Button
        onClick={handleSubmit}
        color="primary"
        variant="contained"
        fullWidth
        style={{ marginTop: '20px' }}
      >
        Lưu
      </Button>
    </form>
  );
};

export default UserUpdateForm;
