import React, { useState, useEffect, useContext } from "react";
import { TextField, Button, Grid, DialogActions } from "@mui/material";
import { getComicsById } from "../../../utils/ComicService";
import { createChapter, updateChapterById } from "../../../utils/ChapterService";
import { AuthContext } from "../../../components/AuthContext";
import { useParams } from "react-router-dom"; // Import useParams
import { storage, ref, uploadBytesResumable, getDownloadURL } from '../../../firebase/firebase';

const ChapterForm = ({ onSave, initialChapter, onClose }) => {
  const { comicId } = useParams(); // Lấy comicId từ URL
  const { user } = useContext(AuthContext);
  const [chapterData, setChapterData] = useState({
    chapterName: "",
    comicId: comicId, // Đặt comicId lấy từ URL
    modComment: "",
    description: "",
    publishedDate: "", // Ngày phát hành
    status: "PENDING",
    type: 1,
    chapterImages: [],
  });
  const [selectedComicName, setSelectedComicName] = useState(""); // Tên truyện sẽ được lấy từ API
  const [isEdit, setIsEdit] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // Khởi tạo dữ liệu nếu có initialChapter, nếu không gán ngày hiện tại cho publishedDate
  useEffect(() => {
    if (initialChapter) {
      setChapterData({
        chapterName: initialChapter.chapterName,
        comicId: initialChapter.comicId, // comicId phải có trong initialChapter
        modComment: initialChapter.modComment,
        description: initialChapter.description,
        publishedDate: initialChapter.publishedDate
          ? initialChapter.publishedDate.slice(0, 10)
          : "",
        status: mapStatusToString(initialChapter.status),
        type: initialChapter.type,
        chapterImages: initialChapter.chapterImages || [],
      });
      setIsEdit(true);
    } else {
      setChapterData((prevData) => ({
        ...prevData,
        publishedDate: new Date().toISOString().slice(0, 10),
      }));
    }
  }, [initialChapter, comicId]); // Đảm bảo useEffect chạy lại khi comicId thay đổi

  useEffect(() => {
    const fetchComicName = async () => {
      if (chapterData.comicId) {
        try {
          // Gọi API để lấy comicName theo comicId
          const response = await getComicsById(chapterData.comicId);
          if (response && response.data) {
            setSelectedComicName(response.data.comicName);
          } else {
            setSelectedComicName("Truyện không tìm thấy");
          }
        } catch (error) {
          console.error("Lỗi khi lấy truyện theo id:", error);
          setSelectedComicName("Truyện không tìm thấy");
        }
      }
    };

    if (chapterData.comicId) {
      fetchComicName();
    }
  }, [chapterData.comicId]);

  const mapStatusToString = (status) => {
    switch (status) {
      case 0: return "PENDING";
      case 1: return "LOCKED";
      case 2: return "UNLOCKED";
      case 3: return "DELETED";
      default: return "PENDING";
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const uploadPromises = [];
  
      Array.from(files).forEach((file, index) => {
        // Tạo đường dẫn lưu theo tên truyện, tên chương và số thứ tự ảnh
        const sanitizedComicName = selectedComicName.replace(/\s+/g, "_"); // Loại bỏ khoảng trắng
        const chapterName = chapterData.chapterName.replace(/\s+/g, "_"); // Loại bỏ khoảng trắng trong tên chương
  
        const storageRef = ref(storage, `chapters/${sanitizedComicName}/${chapterName}/${file.name}`);
  
        const uploadTask = uploadBytesResumable(storageRef, file);
  
        const uploadPromise = new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            () => {},
            (error) => reject(error),
            async () => {
              try {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                resolve({ imageURL: downloadURL });
              } catch (error) {
                reject(error);
              }
            }
          );
        });
  
        uploadPromises.push(uploadPromise);
      });
  
      Promise.all(uploadPromises)
        .then((uploadedImages) => {
          setChapterData((prevData) => ({
            ...prevData,
            chapterImages: [...prevData.chapterImages, ...uploadedImages],
          }));
        })
        .catch((error) => {
          console.error("Error uploading files:", error);
        });
    }
  };
  
  
  

  const handleSave = async () => {
    const payload = {
      chapterName: chapterData.chapterName,
      comicId: chapterData.comicId,
      modComment: chapterData.modComment || "",
      publishedDate: new Date(chapterData.publishedDate).toISOString(),
      description: chapterData.description || "",
      status: Number(mapStatusToByte(chapterData.status)),
      type: Number(chapterData.type),
      chapterImages: chapterData.chapterImages.map((image) => ({
        imageURL: image.imageURL?.trim() || "",
      })),
    };

    console.log("Payload data gửi về:", JSON.stringify(payload, null, 2));

    try {
      let response;
      if (isEdit) {
        response = await updateChapterById(payload, initialChapter.chapterId);
      } else {
        response = await createChapter(payload);
      }

      
    } catch (error) {
      console.error("Lỗi khi lưu chương:", error.response ? error.response.data : error.message);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setChapterData({ ...chapterData, [name]: value });
  };

  return (
    <form>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Tên chương"
            name="chapterName"
            variant="outlined"
            fullWidth
            value={chapterData.chapterName}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Truyện"
            value={selectedComicName || "Chưa chọn truyện"}
            variant="outlined"
            fullWidth
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Mô tả"
            name="description"
            variant="outlined"
            fullWidth
            value={chapterData.description}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Ngày phát hành"
            variant="outlined"
            type="date"
            fullWidth
            value={chapterData.publishedDate}
            InputLabelProps={{ shrink: true }}
            disabled
          />
        </Grid>
        <Grid item xs={12}>
          <input type="file" multiple accept="image/*" onChange={handleFileChange} />
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            {chapterData.chapterImages.map((image, index) => (
              <img
                key={index}
                src={image.imageURL}
                alt={`chapter-img-${index}`}
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
            ))}
          </div>
        </Grid>
      </Grid>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Hủy
        </Button>
        <Button type="button" onClick={handleSave} color="primary">
          {isEdit ? "Cập nhật" : "Thêm"} Chương
        </Button>
      </DialogActions>
    </form>
  );
};

export default ChapterForm;
