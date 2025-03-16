import React, { useState } from "react";
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const GenreForm = ({ open, onClose, onSave, genresName = "", genresDescription = "", status = "active" }) => {
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
            status: newGenre.status === "active" ? 1 : 0,
        };

        console.log("📤 Dữ liệu gửi đi:", formattedGenre); // Log dữ liệu trước khi gửi
        onSave(formattedGenre); // Gửi về API
        setNewGenre({ genresName: "", genresDescription: "", status: "active" });
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
