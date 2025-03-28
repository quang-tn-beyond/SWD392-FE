
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
      height: "300px",
    }}
  />
);

const ComicDetails = () => {
  const { comicId } = useParams();
  const [comic, setComic] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(null);

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
    const sortedChapters = [...chapters].sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
    const chapterIndex = sortedChapters.findIndex((chap) => chap.chapterId === chapter.chapterId);
    const chapterNumber = sortedChapters.length - chapterIndex;

    setSelectedChapter({ ...chapter, chapterNumber });
    setShowPurchaseModal(true);
  };


  const addToCart = () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const newItem = {
      chapterId: selectedChapter.chapterId,
      title: selectedChapter.chapterName,
      name: selectedChapter.chapterNumber,
      price: 999,
      coverUrl: comic.coverUrl
    };

    cart.push(newItem);
    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Đã thêm vào giỏ hàng!");
    console.log("Selected Chapter:", selectedChapter);
  };


  // Lấy danh sách chapter đã mua từ localStorage
  const purchasedChapters = JSON.parse(localStorage.getItem("purchasedChapters")) || [];


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
                  [...chapters]
                    .sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate)) // Sắp xếp từ mới nhất đến cũ nhất
                    .map((chapter, index, sortedChapters) => {
                      const chapterNumber = sortedChapters.length - index; // Đánh số chapter theo thứ tự
                      const isLocked = sortedChapters.length >= 6 && index < 2; // Chỉ khóa nếu có từ 6 chapter trở lên (2 chapter mới nhất)

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
                ) : (
                  <p>Chưa có chapter nào</p>
                )}
              </div>
            </div>
            <Review />
          </div>
        </div>
      </div>

      {showPurchaseModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>Purchase Chapter</h4>
            <p>{selectedChapter?.title}</p> <span>999 xu</span>
            <div className="modal-buttons">
              <button className="cart-btn" onClick={addToCart}>Add to Cart</button>
            </div>
            <button className="close-btn" onClick={() => setShowPurchaseModal(false)}>Close</button>
          </div>
        </div>
      )}

    </section>
  );
};

export default ComicDetails;
