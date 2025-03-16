import React, { useState } from "react";
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const GenreForm = ({ open, onClose, onSave, genresName = "", genresDescription = "", status = 3 }) => {
  const [newGenre, setNewGenre] = useState({
    genresName,
    genresDescription,
    status,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log("Thay đổi giá trị input:", name, value); // Log giá trị thay đổi
    setNewGenre((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddGenre = () => {
    console.log("📝 Dữ liệu từ form trước khi gửi:", newGenre);

    if (newGenre.genresName.trim()) {
        // Chuyển thứ tự của các trường theo yêu cầu của backend
        const formattedGenre = {
            genresDescription: newGenre.genresDescription.trim(),
            genresName: newGenre.genresName.trim(),
            status: newGenre.status,  // Status đã đồng bộ với 1, 2, 3
        };

        console.log("📤 Dữ liệu gửi đi:", formattedGenre); // Log dữ liệu trước khi gửi
        onSave(formattedGenre); // Gửi về API
        setNewGenre({ genresName: "", genresDescription: "", status: 3 }); // Reset form và mặc định status = 3
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
          name="genresName"
          value={newGenre.genresName}
          onChange={handleInputChange}
          autoFocus
        />
        <TextField
          label="Mô Tả"
          variant="outlined"
          fullWidth
          name="genresDescription"
          value={newGenre.genresDescription}
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
            <MenuItem value={1}>DELETED</MenuItem>
            <MenuItem value={2}>EDITED</MenuItem>
            <MenuItem value={3}>AVAILABLE</MenuItem>
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
