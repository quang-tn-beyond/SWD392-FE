import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getComicsById } from "../utils/ComicService";
import { getAllChapters } from "../utils/ChapterService"; // Thêm API này
import Review from "../wrapper/comics/review";

const BackgroundComponent = ({ imageUrl }) => (
  <div
    style={{
      backgroundImage: `url(${imageUrl})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      width: "100%",
      height: "450px",
    }}
  />
);

const ComicDetails = () => {
  const { comicId } = useParams();
  const [comic, setComic] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  useEffect(() => {
    if (comicId) {
      // Lấy thông tin truyện
      getComicsById(comicId)
        .then((response) => {
          setComic(response.data);
        })
        .catch((error) => console.error("Lỗi khi tải chi tiết truyện:", error));

      // Lấy danh sách chapter của truyện
      getAllChapters()
        .then((response) => {
          if (Array.isArray(response.data)) {
            const filteredChapters = response.data.filter(
              (chap) => chap.comicId === comicId // Lọc chapter theo comicId
            );
            setChapters(filteredChapters);
            console.log("Danh sách chapter:", filteredChapters); // Debug
          }
        })
        .catch((error) => console.error("Lỗi khi tải danh sách chapter:", error));
    }
  }, [comicId]);

  useEffect(() => {
    const followedComics = JSON.parse(localStorage.getItem("followedComics")) || [];
    setIsFollowing(followedComics.includes(comicId));
  }, [comicId]);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    let followedComics = JSON.parse(localStorage.getItem("followedComics")) || [];
    if (!isFollowing) {
      if (!followedComics.includes(comicId)) {
        followedComics.push(comicId);
      }
    } else {
      followedComics = followedComics.filter((id) => id !== comicId);
    }
    localStorage.setItem("followedComics", JSON.stringify(followedComics));
  };


  const handleLockedChapterClick = (chapter) => {
    setShowPurchaseModal(true);
  };


  if (!comic) return <div>Loading...</div>;

  return (
    <section className="anime-details spad">
      <div className="container">
        <div className="anime__details__content">
          <div className="row">
            <div className="col-lg-3">
              <div className="anime__details__pic set-bg">
                <BackgroundComponent imageUrl={comic.coverUrl} />
                <div className="comment">
                  <i className="fa fa-comments"></i> {comic.comments}
                </div>
                <div className="view">
                  <i className="fa fa-eye"></i> {comic.views}
                </div>
              </div>
            </div>
            <div className="col-lg-9">
              <div className="anime__details__text">
                <div className="anime__details__title">
                  <h3>{comic.title}</h3>
                  <span>{comic.subtitle}</span>
                </div>
                <p>{comic.description}</p>
                <div className="anime__details__widget">
                  <div className="row">
                    <div className="col-lg-6 col-md-6">
                      <ul>
                        <li><span>Type:</span> {comic.type}</li>
                        <li><span>Author:</span> {comic.author}</li>
                        <li><span>Date aired:</span> {comic.releaseDate}</li>
                        <li><span>Status:</span> {comic.status}</li>
                        <li><span>Genre:</span> {comic.genre}</li>
                      </ul>
                    </div>
                    <div className="col-lg-6 col-md-6">
                      <ul>
                        <li><span>Scores:</span> {comic.scores}</li>
                        <li><span>Duration:</span> {comic.duration}</li>
                        <li><span>Quality:</span> {comic.quality}</li>
                        <li><span>Views:</span> {comic.views}</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="anime__details__btn">
                  <button
                    className={`follow-btn ${isFollowing ? "following" : ""}`}
                    onClick={handleFollow}
                  >
                    <i className={`fa ${isFollowing ? "fa-heart" : "fa-heart-o"}`}></i>{" "}
                    {isFollowing ? "Following" : "Follow"}
                  </button>
                  <Link

                    to={chapters.length ? `/reading/${comic.comicId}/1` : "#"}
                    className="read-btn"
                  >
                    <span>Read Now</span> <i className="fa fa-angle-right"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Danh sách Chapter */}
        <div className="row">
          <div className="col-lg-8">
            <div className="details__chapters">
              <h4>Chapters</h4>
              <div className="chapter-list">
                {chapters.length > 0 ? (
                  chapters
                    .sort((a, b) => new Date(a.publishedDate) - new Date(b.publishedDate)) // Sắp xếp theo ngày tăng dần
                    .map((chapter, index, sortedChapters) => {
                      const chapterNumber = index + 1; // Đánh số chapter tự động
                      const isLocked = chapterNumber <= sortedChapters.length - 5; // Khóa trừ 5 chap mới nhất

                      return (
                        <Link
                          key={chapter.chapterId}
                          to={isLocked ? "#" : `/reading/${comicId}/${chapter.chapterId}`}
                          className={`chapter-item ${isLocked ? "locked" : ""}`}
                          onClick={isLocked ? (e) => { e.preventDefault(); handleLockedChapterClick(chapter); } : null}
                        >
                          <div className="chapter-item__content">
                            <span className="chapter-item__number">Chapter {chapterNumber}</span>
                          </div>
                          <i className={isLocked ? "fa fa-lock chapter-item__icon" : "fa fa-arrow-right chapter-item__icon"}></i>
                        </Link>
                      );
                    })
                    .reverse() // Đảo ngược danh sách để chap lớn hơn nằm dưới
                ) : (
                  <p>Chưa có chapter nào</p>
                )}
              </div>

            </div>
            <Review />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComicDetails;
