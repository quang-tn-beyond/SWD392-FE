import { useParams } from "react-router-dom"; // Import useParams để lấy ID và số chương
import Review from "../wrapper/comics/review";
import { comics } from "../data"; // Import danh sách truyện
import { Link } from "react-router-dom";

const ReadingPage = () => {
    const { comicId, chapterNumber } = useParams(); // Lấy ID truyện và số chương từ URL
    const comic = comics.find(c => c.id === comicId); // Tìm truyện theo ID
    const chapterIndex = parseInt(chapterNumber, 10) - 1; // Chuyển đổi số chương thành index
    const currentChapter = comic?.chapters[chapterIndex]; // Lấy chương hiện tại

    return (
        <section>
            <div className="container">
                {/* Breadcrumb */}
                <div className="breadcrumb">
                    <Link to="/">
                        <i className="fas fa-home"></i>
                    </Link>
                    <Link to={`/comic-detail/${comic?.id}`}>
                        {comic?.title}
                    </Link>
                    <span className="current-chapter">{currentChapter?.title}</span>
                </div>

                {/* Title */}
                <div className="chapter-title">
                    <h1>{comic?.title} - {currentChapter?.title}</h1>
                </div>

                {/* Chapter Controls */}
                <div className="chapter-controls">
                    <Link to="/">
                        <i className="fas fa-home"></i>
                    </Link>
                    <a href="#"><i className="fas fa-bars"></i></a>
                    <a href="#"><i className="fas fa-undo"></i></a>
                    <button disabled={chapterIndex === 0}>
                        <Link to={`/reading/${comic.id}/${chapterIndex}`}>
                            <i className="fas fa-arrow-left"></i>
                        </Link>
                    </button>
                    <select className="scroll" onChange={(e) => window.location.href = e.target.value}>
                        {comic.chapters.map((chapter, index) => (
                            <option key={index} value={`/reading/${comic.id}/${index + 1}`} selected={index === chapterIndex}>
                                {chapter.title}
                            </option>
                        ))}
                    </select>
                    <button disabled={chapterIndex === comic.chapters.length - 1}>
                        <Link to={`/reading/${comic.id}/${chapterIndex + 2}`}>
                            <i className="fas fa-arrow-right"></i>
                        </Link>
                    </button>
                </div>


                {/* Comic Page */}
                <div className="comic-container">
                    <img src="" alt={`Page 1 of ${currentChapter?.title}`} className="comic-image" />
                </div>

                {/* Review */}
                <Review />
            </div>
        </section>
    );
}

export default ReadingPage;
