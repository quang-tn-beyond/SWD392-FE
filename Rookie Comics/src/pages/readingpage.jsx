import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getComicsById } from "../utils/ComicService";
import { getAllChapters, getChapterById } from "../utils/ChapterService";
import Review from "../wrapper/comics/review";

const ReadingPage = () => {
    const { comicId, chapterNumber } = useParams();
    const [comic, setComic] = useState(null);
    const [chapters, setChapters] = useState([]);
    const [currentChapter, setCurrentChapter] = useState(null);

    useEffect(() => {
        const fetchComicAndChapters = async () => {
            try {
                console.log(" Fetching comic and chapters...");

                // Lấy thông tin truyện
                const comicResponse = await getComicsById(comicId);
                console.log("✅ Comic data:", comicResponse.data);
                setComic(comicResponse.data);

                // Lấy danh sách chương của truyện này
                const chapterResponse = await getAllChapters(comicId);  // ✅ Truyền comicId vào API
                console.log("✅ Chapters for this comic:", chapterResponse.data);

                if (Array.isArray(chapterResponse.data)) {
                    const sortedChapters = chapterResponse.data
                        .sort((a, b) => new Date(a.publishedDate) - new Date(b.publishedDate));
                    setChapters(sortedChapters);

                    // Tìm chương hiện tại dựa vào chapterNumber
                    const foundChapter = sortedChapters.find(chap => chap.chapterId == chapterNumber);
                    if (foundChapter) {
                        setCurrentChapter(foundChapter);
                        console.log("✅ Found current chapter:", foundChapter);
                    } else {
                        console.error(" Chapter not found in list!");
                    }
                }
            } catch (error) {
                console.error(" Lỗi khi tải dữ liệu:", error);
            }
        };

        fetchComicAndChapters();
    }, [comicId, chapterNumber]);

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
                    <Link to="/">
                        <i className="fas fa-home"></i>
                    </Link>
                    <a href="#"><i className="fas fa-bars"></i></a>
                    <a href="#"><i className="fas fa-undo"></i></a>

                    {/* Nút chương trước */}
                    <button
                        disabled={chapters[0]?.chapterId === currentChapter.chapterId}
                    >
                        <Link to={`/reading/${comic.comicId}/${chapters.find(chap => chap.chapterId < currentChapter.chapterId)?.chapterId}`}>
                            <i className="fas fa-arrow-left"></i>
                        </Link>
                    </button>

                    <select
                        className="scroll"
                        value={`/reading/${comic.comicId}/${currentChapter.chapterId}`}
                        onChange={(e) => window.location.href = e.target.value}
                    >
                        {chapters.map((chapter, index) => {
                            const chapterNumber = index + 1; // Đánh số chương tự động
                            return (
                                <option key={chapter.chapterId} value={`/reading/${comic.comicId}/${chapter.chapterId}`}>
                                    Chapter {chapterNumber}
                                </option>
                            );
                        })}
                    </select>


                    {/* Nút chương sau */}
                    <button
                        disabled={chapters[chapters.length - 1]?.chapterId === currentChapter.chapterId}
                    >
                        <Link to={`/reading/${comic.comicId}/${chapters.find(chap => chap.chapterId > currentChapter.chapterId)?.chapterId}`}>
                            <i className="fas fa-arrow-right"></i>
                        </Link>
                    </button>
                </div>

                {/* Comic Page */}
                <div className="comic-container">
                    {currentChapter.chapterImages?.map((image, index) => (
                        <img key={index} src={image.imageURL} className="comic-image" />
                    ))}
                </div>

                {/* Review */}
                <Review />
            </div>
        </section>
    );
};

export default ReadingPage;
