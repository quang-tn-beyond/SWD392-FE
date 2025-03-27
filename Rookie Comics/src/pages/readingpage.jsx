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

                    {/* Lấy danh sách chap đã sắp xếp theo thứ tự */}
                    {chapters.length > 0 && (() => {
                        const sortedChapters = [...chapters].sort((a, b) => new Date(a.publishedDate) - new Date(b.publishedDate)); // Sắp xếp chap tăng dần
                        const currentIndex = sortedChapters.findIndex(chap => chap.chapterId === currentChapter.chapterId);

                        const prevChapter = currentIndex > 0 ? sortedChapters[currentIndex - 1] : null;
                        const nextChapter = currentIndex < sortedChapters.length - 1 ? sortedChapters[currentIndex + 1] : null;

                        return (
                            <>
                                {/* Nút chương trước */}
                                <button disabled={!prevChapter}>
                                    {prevChapter && <Link to={`/reading/${comic.comicId}/${prevChapter.chapterId}`}>
                                        <i className="fas fa-arrow-left"></i>
                                    </Link>}
                                </button>

                                {/* Select danh sách chương */}
                                <select
                                    className="scroll"
                                    value={`/reading/${comic.comicId}/${currentChapter.chapterId}`}
                                    onChange={(e) => window.location.href = e.target.value}
                                >
                                    {sortedChapters.map((chapter, index) => (
                                        <option key={chapter.chapterId} value={`/reading/${comic.comicId}/${chapter.chapterId}`}>
                                            Chapter {index + 1}
                                        </option>
                                    ))}
                                </select>

                                {/* Nút chương sau */}
                                <button disabled={!nextChapter}>
                                    {nextChapter && <Link to={`/reading/${comic.comicId}/${nextChapter.chapterId}`}>
                                        <i className="fas fa-arrow-right"></i>
                                    </Link>}
                                </button>
                            </>
                        );
                    })()}
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
