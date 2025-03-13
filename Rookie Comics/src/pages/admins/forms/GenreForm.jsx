import React, { useState } from "react";
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const GenreForm = ({ open, onClose, onSave, genres_name = "", genres_description = "", status = "active" }) => {
  const [newGenre, setNewGenre] = useState({
    genres_name,
    genres_description,
    status,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGenre((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddGenre = () => {
    console.log("📝 Dữ liệu từ form trước khi gửi:", newGenre);

    if (newGenre.genres_name.trim()) {
        const formattedGenre = {
            genres_name: newGenre.genres_name.trim(),
            genres_description: newGenre.genres_description.trim(),
            status: newGenre.status === "active" ? 1 : 0, 
        };

        console.log("📤 Dữ liệu gửi đi:", formattedGenre); // Log trước khi gửi
        onSave(formattedGenre); // Gửi về API
        setNewGenre({ genres_name: "", genres_description: "", status: "active" });
        onClose();
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
          name="genres_name"
          value={newGenre.genres_name}
          onChange={handleInputChange}
          autoFocus
        />
        <TextField
          label="Mô Tả"
          variant="outlined"
          fullWidth
          name="genres_description"
          value={newGenre.genres_description}
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
