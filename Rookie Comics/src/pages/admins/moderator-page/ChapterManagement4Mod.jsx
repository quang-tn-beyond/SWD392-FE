import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Grid, TextField } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { getAllChapters, reviewChapter } from '../../../utils/ChapterService';
import { getAllComics } from '../../../utils/ComicService'; // Import function to get all comics
import Layout from '../layout';

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

const ChapterManagement4Mod = () => {
  const { comicId } = useParams();
  const [chapters, setChapters] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [comicName, setComicName] = useState(''); // State to store comic name

  useEffect(() => {
    const fetchComicName = async () => {
      try {
        const response = await getAllComics();
        const comic = response.data.find(comic => comic.comicId === comicId);
        if (comic) {
          setComicName(comic.comicName); // Set the comic name based on comicId
        }
      } catch (error) {
        console.error('Error fetching comics:', error);
      }
    };

    const fetchChapters = async () => {
      try {
        const response = await getAllChapters(comicId);
        setChapters(response.data.filter(chapter => mapStatusToString(chapter.status) === "PENDING"));
      } catch (error) {
        console.error('Error fetching chapters:', error);
      }
    };

    fetchComicName(); // Fetch comic name
    fetchChapters(); // Fetch chapters
  }, [comicId]);

  const handleReviewChapter = (chapter, isApproved) => {
    const modComment = isApproved ? "Approved" : "Declined";
    reviewChapter(chapter.chapterId, isApproved, modComment)
      .then(() => {
        // Update the list of chapters after review
        setChapters(chapters.filter(chap => chap.chapterId !== chapter.chapterId)); // Remove reviewed chapter
      })
      .catch((error) => {
        console.error('Error reviewing chapter:', error);
      });
  };

  // Filter chapters based on search value
  const filteredChapters = chapters.filter(chapter => chapter.chapterName.toLowerCase().includes(searchValue.toLowerCase()));

  return (
    <Layout>
      <div style={{ padding: '20px' }}>
        <h2>Kiểm duyệt Chương</h2>
        <h3>{comicName}</h3> {/* Display the comic name */}
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={9}>
            <TextField
              label="Tìm chương"
              variant="outlined"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              fullWidth
            />
          </Grid>
        </Grid>

        <TableContainer component={Paper} style={{ marginTop: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tên chương</TableCell>
                <TableCell>Ngày xuất bản</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredChapters.map((chapter) => (
                <TableRow key={chapter.chapterId}>
                  <TableCell>{chapter.chapterName}</TableCell>
                  <TableCell>{chapter.publishedDate}</TableCell>
                  <TableCell>{mapStatusToString(chapter.status)}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleReviewChapter(chapter, true)} color="primary">
                      Đồng ý duyệt
                    </Button>
                    <Button onClick={() => handleReviewChapter(chapter, false)} color="secondary">
                      Từ chối duyệt
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Layout>
  );
};

export default ChapterManagement4Mod;
