import React, { useState } from "react";
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const GenreForm = ({ open, onClose, onSave }) => {
  const [newGenre, setNewGenre] = useState({
    name: "",
    description: "",
    status: "active" // Default to 'active'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGenre((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddGenre = () => {
    if (newGenre.name.trim()) {
      onSave(newGenre); // Pass the full genre data
      setNewGenre({ name: "", description: "", status: "active" }); // Clear form after saving
      onClose(); // Close the dialog
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Thêm Thể Loại Mới</DialogTitle>
      <DialogContent>
        <TextField
          label="Tên Thể Loại"
          variant="outlined"
          fullWidth
          name="name"
          value={newGenre.name}
          onChange={handleInputChange}
          autoFocus
        />
        <TextField
          label="Mô Tả"
          variant="outlined"
          fullWidth
          name="description"
          value={newGenre.description}
          onChange={handleInputChange}
          style={{ marginTop: 20 }}
        />
        <FormControl fullWidth style={{ marginTop: 20 }}>
          <InputLabel>Trạng Thái</InputLabel>
          <Select
            name="status"
            value={newGenre.status}
            onChange={handleInputChange}
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Hủy
        </Button>
        <Button onClick={handleAddGenre} color="primary">
          Thêm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GenreForm;
