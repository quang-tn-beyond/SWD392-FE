import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getComicsById } from "../utils/ComicService";
import { getAllChapters } from "../utils/ChapterService";
import { storage } from "../firebase/firebase";
import { getMetadata, ref } from "firebase/storage";
import Review from "../wrapper/comics/review";

const ReadingPage = () => {
  const { comicId, chapterNumber } = useParams();
  const [comic, setComic] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [currentChapter, setCurrentChapter] = useState(null);

  useEffect(() => {
    const fetchComicAndChapters = async () => {
      try {
        console.log("Fetching comic and chapters...");

        // Lấy thông tin truyện
        const comicResponse = await getComicsById(comicId);
        console.log("✅ Comic data:", comicResponse.data);
        setComic(comicResponse.data);

        // Lấy danh sách chương của truyện này
        const chapterResponse = await getAllChapters(comicId);
        console.log("✅ Chapters for this comic:", chapterResponse.data);

        if (Array.isArray(chapterResponse.data)) {
          const sortedChapters = chapterResponse.data.sort(
            (a, b) => new Date(a.publishedDate) - new Date(b.publishedDate)
          );
          setChapters(sortedChapters);

          // Tìm chương hiện tại dựa vào chapterNumber
          const foundChapter = sortedChapters.find(
            (chap) => chap.chapterId == chapterNumber
          );
          if (foundChapter) {
            setCurrentChapter(foundChapter);
            console.log("✅ Found current chapter:", foundChapter);
          } else {
            console.error("Chapter not found in list!");
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchComicAndChapters();
  }, [comicId, chapterNumber]);

  // Lấy metadata của mỗi ảnh và sắp xếp
  const fetchImageMetadata = async (imageURLs) => {
    const imagesWithMetadata = await Promise.all(
      imageURLs.map(async (image) => {
        const imageRef = ref(storage, image.imageURL); // Lấy reference tới ảnh
        let metadata = null;

        try {
          metadata = await getMetadata(imageRef); // Lấy metadata của ảnh
        } catch (error) {
          console.error("Error fetching metadata for image:", image.imageURL, error);
        }

        return { ...image, metadata }; // Gộp metadata vào ảnh (có thể là null nếu không lấy được metadata)
      })
    );

    // Sắp xếp ảnh theo tên file (1.jpg, 2.jpg, 10.jpg, 11.jpg...)
    return imagesWithMetadata.sort((a, b) => {
      const fileNameA = a.imageURL.split('/').pop().split('?')[0];
      const fileNameB = b.imageURL.split('/').pop().split('?')[0];
      const orderA = parseInt(fileNameA.replace(/\D/g, ''), 10);
      const orderB = parseInt(fileNameB.replace(/\D/g, ''), 10);
      return orderA - orderB;
    });
  };

  useEffect(() => {
    if (currentChapter) {
      fetchImageMetadata(currentChapter.chapterImages || []).then((sortedImages) => {
        setCurrentChapter((prevChapter) => ({
          ...prevChapter,
          chapterImages: sortedImages, // Cập nhật ảnh đã được sắp xếp
        }));
      });
    }
  }, [currentChapter]);

  if (!comic || !currentChapter) return <div>Loading...</div>;

  return (
    <section>
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">
            <i className="fas fa-home"></i>
          </Link>
          <Link to={`/comic-detail/${comic.comicId}`}>
            {comic.comicName}
          </Link>
          <span className="current-chapter">{currentChapter.chapterName}</span>
        </div>

        {/* Title */}
        <div className="chapter-title">
          <h1>{comic.comicName} - {currentChapter.chapterName}</h1>
        </div>

        {/* Chapter Controls */}
        <div className="chapter-controls">
          {/* Previous Chapter */}
          <button disabled={!chapters[0] || chapters[0].chapterId === currentChapter.chapterId}>
            {chapters[0] && (
              <Link to={`/reading/${comic.comicId}/${chapters[0].chapterId}`}>
                <i className="fas fa-arrow-left"></i>
              </Link>
            )}
          </button>

          {/* Select Chapter */}
          <select
            className="scroll"
            value={`/reading/${comic.comicId}/${currentChapter.chapterId}`}
            onChange={(e) => window.location.href = e.target.value}
          >
            {chapters.map((chapter, index) => (
              <option key={chapter.chapterId} value={`/reading/${comic.comicId}/${chapter.chapterId}`}>
                Chapter {index + 1}
              </option>
            ))}
          </select>

          {/* Next Chapter */}
          <button disabled={!chapters[chapters.length - 1] || chapters[chapters.length - 1].chapterId === currentChapter.chapterId}>
            {chapters[chapters.length - 1] && (
              <Link to={`/reading/${comic.comicId}/${chapters[chapters.length - 1].chapterId}`}>
                <i className="fas fa-arrow-right"></i>
              </Link>
            )}
          </button>
        </div>

        {/* Comic Page */}
        <div className="comic-container">
          {currentChapter.chapterImages?.map((image, index) => (
            <img key={index} src={image.imageURL} className="comic-images" />
          ))}
        </div>

        {/* Review */}
        <Review />
      </div>
    </section>
  );
};

export default ReadingPage;
