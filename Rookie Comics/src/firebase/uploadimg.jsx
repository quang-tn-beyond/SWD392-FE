import React, { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

function UploadImage() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [order, setOrder] = useState(1); // Biến để theo dõi thứ tự ảnh

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (file) {
      const storageRef = ref(storage, `images/${order}_${file.name}`);

      // Tạo metadata tùy chỉnh
      const metadata = {
        customMetadata: {
          order: `${order}`, // Lưu trữ thứ tự của ảnh
          uploadedAt: new Date().toISOString(), // Lưu trữ thời gian upload
        },
      };

      const uploadTask = uploadBytesResumable(storageRef, file, metadata);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progressPercentage =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progressPercentage);
        },
        (error) => {
          console.error("Error uploading file:", error);
        },
        () => {
          // Lấy URL của ảnh sau khi upload thành công
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
            setOrder(order + 1); // Tăng thứ tự ảnh sau khi upload thành công
          });
        }
      );
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {progress > 0 && <p>Upload Progress: {progress}%</p>}
    </div>
  );
}

export default UploadImage;
