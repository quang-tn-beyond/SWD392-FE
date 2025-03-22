import React, { useState, useEffect, useContext } from "react";
import {
  TextField,
  Button,
  Grid,
  DialogActions,
} from "@mui/material";
import { getAllComics } from "../../../utils/ComicService";
import { createChapter, updateChapterById } from "../../../utils/ChapterService";
import { AuthContext } from "../../../components/AuthContext";

const ChapterForm = ({ onSave, initialChapter, onClose }) => {
  const { user } = useContext(AuthContext);
  const [chapterData, setChapterData] = useState({
    chapterName: "",
    comicId: "",
    description: "",
    publishedDate: "",
    status: "PENDING",
    type: 1,
    chapterImages: [],
  });
  const [comics, setComics] = useState([]);
  const [selectedComicName, setSelectedComicName] = useState("");
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (initialChapter) {
      setChapterData({
        chapterName: initialChapter.chapterName,
        comicId: initialChapter.comicId,
        description: initialChapter.description,
        publishedDate: initialChapter.publishedDate,
        status: mapStatusToString(initialChapter.status),
        type: initialChapter.type,
        chapterImages: initialChapter.chapterImages || [],
      });
      setIsEdit(true);
    }
  }, [initialChapter]);
  
  useEffect(() => {
    const fetchComics = async () => {
      try {
        const response = await getAllComics();
        setComics(response.data || []);
      } catch (error) {
        console.error("Error fetching comics:", error);
      }
    };
  
    fetchComics();
  }, []);
  
  useEffect(() => {
    if (chapterData.comicId && comics.length > 0) {
      const selectedComic = comics.find((c) => c.comicId === chapterData.comicId);
      setSelectedComicName(selectedComic ? selectedComic.comicName : "");
    }
  }, [chapterData.comicId, comics]);
  

  const mapStatusToString = (status) => {
    switch (status) {
      case 0:
        return "PENDING";
      case 1:
        return "LOCKED";
      case 2:
        return "UNLOCKED";
      case 3:
        return "DELETED";
      default:
        return "PENDING";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setChapterData({ ...chapterData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setChapterData((prev) => ({
      ...prev,
      chapterImages: [...prev.chapterImages, ...imageUrls],
    }));
  };

  const handleSave = async () => {
    const payload = {
      chapterName: chapterData.chapterName,
      comicId: chapterData.comicId,
      description: chapterData.description || "",
      publishedDate: chapterData.publishedDate,
      status: mapStatusToByte(chapterData.status),
      type: chapterData.type,
      chapterImages: chapterData.chapterImages,
    };

    try {
      if (isEdit) {
        const response = await updateChapterById(user.token, payload, initialChapter.chapterId);
        onSave(response.data);
      } else {
        const response = await createChapter(user.token, payload);
        onSave(response.data);
      }
    } catch (error) {
      console.error("Error saving chapter:", error);
    }
    onClose();
  };

  const mapStatusToByte = (status) => {
    switch (status) {
      case "PENDING": return 0;
      case "LOCKED": return 1;
      case "UNLOCKED": return 2;
      case "DELETED": return 3;
      default: return 0;
    }
  };

  return (
    <form>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField label="Tên chương" name="chapterName" variant="outlined" fullWidth value={chapterData.chapterName} onChange={handleChange} />
        </Grid>
        <Grid item xs={12} md={6}>
          {/* Display selected comic name instead of a dropdown */}
          <TextField
            label="Truyện"
            value={selectedComicName || "Chưa chọn truyện"}
            variant="outlined"
            fullWidth
            InputProps={{
              readOnly: true, // Make it read-only
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField label="Mô tả" name="description" variant="outlined" fullWidth value={chapterData.description} onChange={handleChange} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField label="Ngày phát hành" name="publishedDate" type="date" variant="outlined" fullWidth value={chapterData.publishedDate.slice(0, 10)} InputLabelProps={{ shrink: true }} onChange={handleChange} />
        </Grid>
        <Grid item xs={12}>
          <input type="file" multiple accept="image/*" onChange={handleImageUpload} />
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            {chapterData.chapterImages.map((image, index) => (
              <img key={index} src={image} alt={`chapter-img-${index}`} style={{ width: "100px", height: "100px", objectFit: "cover" }} />
            ))}
          </div>
        </Grid>
      </Grid>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Hủy</Button>
        <Button type="button" onClick={handleSave} color="primary">{isEdit ? "Cập nhật" : "Thêm"} Chương</Button>
      </DialogActions>
    </form>
  );
};

export default ChapterForm;
