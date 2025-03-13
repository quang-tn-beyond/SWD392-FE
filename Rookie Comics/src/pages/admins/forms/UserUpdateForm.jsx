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
    // Convert role to ID before sending
    let roleAsByte;
    switch (formData.role) {
      case 'Admin':
        roleAsByte = 1;
        break;
      case 'Moderator':
        roleAsByte = 3;
        break;
      case 'StaffPage':
        roleAsByte = 4;
        break;
      case 'Member':
      default:
        roleAsByte = 5; // Default role
    }

    const updatedUser = {
      ...user, // Include the user data
      role: roleAsByte, // Send the role as byte (ID)
    };

    onSave(updatedUser); // Trigger the onSave function to save the role
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
