import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Breadcrumbs, Link, Typography } from "@mui/material";
import { comics } from "../../../data";
import Layout from "../layout";

const ChapterManagement = () => {
  const { comicId } = useParams(); // Lấy comicId từ URL
  const navigate = useNavigate();
  const location = useLocation();

  // Tìm truyện dựa trên comicId
  const comic = comics.find((comic) => comic.id === comicId);

  if (!comic) {
    return <div>Truyện không tồn tại.</div>;
  }

  // Xử lý đường dẫn Breadcrumbs động
  const pathnames = location.pathname.split("/").filter((x) => x);

  const breadcrumbs = (
    <Breadcrumbs aria-label="breadcrumb" style={{ marginBottom: "20px" }}>
      <Link underline="hover" color="inherit" onClick={() => navigate("/")}>
        Trang chủ
      </Link>
      <Link underline="hover" color="inherit" onClick={() => navigate("/admin/comic-management")}>
        Quản lý Truyện Tranh
      </Link>
      <Typography color="text.primary">Quản lý Chương</Typography>
    </Breadcrumbs>
  );

  return (
    <Layout>
    <div style={{ padding: "20px" }}>
      {breadcrumbs}

      <h2>Quản lý Chương - {comic.title}</h2>

      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên chương</TableCell>
              <TableCell>Link</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {comic.chapters.map((chapter, index) => (
              <TableRow key={index}>
                <TableCell>{chapter.title}</TableCell>
                <TableCell>
                  <a href={chapter.link} target="_blank" rel="noopener noreferrer">Đọc chương</a>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => alert(`Quản lý chương ${chapter.title}`)}
                  >
                    Quản lý
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: "20px" }}
        onClick={() => navigate("/admin/comic-management")}
      >
        Quay lại
      </Button>
    </div>
    </Layout>
  );
};

export default ChapterManagement;
