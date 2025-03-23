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
    console.log(initialChapter); // Kiểm tra xem initialChapter có đúng không
    if (initialChapter) {
      setChapterData({
        chapterName: initialChapter.chapterName,
        comicId: initialChapter.comicId, // comicId phải có trong initialChapter
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
          console.log("API response:", response); // Kiểm tra dữ liệu trả về

          if (response && response.data) {
            // Lấy comicName từ dữ liệu trả về
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

    // Nếu comicId có sẵn, gọi hàm fetchComicName
    if (chapterData.comicId) {
      fetchComicName();
    }
  }, [chapterData.comicId]); // Khi comicId thay đổi, gọi lại API

  // Các hàm xử lý khác
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

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const uploadPromises = [];
  
      Array.from(files).forEach((file) => {
        const storageRef = ref(storage, `comics/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
  
        // Create a promise for each file upload
        const uploadPromise = new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              // You can add progress tracking here if needed
            },
            (error) => {
              reject(error); // Reject the promise on error
            },
            () => {
              // Get the download URL after the upload is complete
              getDownloadURL(uploadTask.snapshot.ref)
                .then((downloadURL) => {
                  resolve(downloadURL); // Resolve the promise with the download URL
                })
                .catch((error) => {
                  reject(error); // Reject if getting the download URL fails
                });
            }
          );
        });
  
        // Add the upload promise to the array
        uploadPromises.push(uploadPromise);
      });
  
      // Wait for all files to be uploaded and then update the state with the URLs
      Promise.all(uploadPromises)
        .then((urls) => {
          // Add the URLs to the chapterImages array in state
          setChapterData((prevData) => ({
            ...prevData,
            chapterImages: [...prevData.chapterImages, ...urls],
          }));
        })
        .catch((error) => {
          console.error("Error uploading files:", error);
        });
    }
  };
  


  const handleChange = (e) => {
    const { name, value } = e.target;
    setChapterData({ ...chapterData, [name]: value });
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

    console.log("Payload data gửi về:", payload);

    try {
      if (isEdit) {
        const response = await updateChapterById(user.token, payload, initialChapter.chapterId);
        onSave(response.data);
      } else {
        const response = await createChapter(user.token, payload);
        onSave(response.data);
      }
    } catch (error) {
      console.error("Lỗi khi lưu chương:", error);
    }
    onClose();
  };

  const mapStatusToByte = (status) => {
    switch (status) {
      case "PENDING":
        return 0;
      case "LOCKED":
        return 1;
      case "UNLOCKED":
        return 2;
      case "DELETED":
        return 3;
      default:
        return 0;
    }
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
                src={image}
                alt={`chapter-img-${index}`}
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
            ))}
          </div>

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
        <Button type="button" onClick={handleSave} color="primary">
          {isEdit ? "Cập nhật" : "Thêm"} Chương
        </Button>
      </DialogActions>
    </form>
  );
};

export default ChapterForm;
