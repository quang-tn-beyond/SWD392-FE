import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { comics } from "../data"; // Import comics data từ data.jsx
import Review from "../wrapper/comics/review";
import { Link } from "react-router-dom";

const BackgroundComponent = ({ imageUrl }) => {
  return (
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
};

const ComicDetails = () => {
  const { id } = useParams();
  const [comic, setComic] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(null);

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const addToCart = () => {
    if (!selectedChapter) return; // Nếu chưa chọn chương, thoát luôn

    const newItem = {
      title: selectedChapter.title,
      price: 999, // Giá mặc định
    };

    // Lấy giỏ hàng từ localStorage
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

    // Kiểm tra nếu chương đã có trong giỏ hàng
    if (!existingCart.some(item => item.title === newItem.title)) {
      const updatedCart = [...existingCart, newItem];
      localStorage.setItem("cart", JSON.stringify(updatedCart)); // Lưu lại
      alert("Đã thêm vào giỏ hàng!");
    } else {
      alert("Chương này đã có trong giỏ hàng!");
    }
  };

  // useEffect(() => {
  //   // Gọi API lấy chi tiết comic
  //   const fetchComicDetails = async () => {
  //     try {
  //       const response = await ComicService.getComicDetails(id);
  //       setComic(response.data); // Set dữ liệu comic từ API

  //       // Sau khi có dữ liệu, gọi API để tăng lượt xem
  //       await ComicService.incrementViews(id);
  //     } catch (error) {
  //       console.error("Error fetching comic details:", error);
  //     }
  //   };

  useEffect(() => {
    const comicData = comics.find((comic) => comic.id === id);

    if (comicData) {
      setComic(comicData);
    } else {
      console.error("Comic not found for id:", id);
    }
  }, [id]);

  useEffect(() => {
    const followedComics = JSON.parse(localStorage.getItem("followedComics")) || [];
    setIsFollowing(followedComics.includes(id));
  }, [id]);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);

    let followedComics = JSON.parse(localStorage.getItem("followedComics")) || [];

    if (!isFollowing) {
      if (!followedComics.includes(id)) {
        followedComics.push(id);
      }
    } else {
      followedComics = followedComics.filter((comicId) => comicId !== id);
    }

    localStorage.setItem("followedComics", JSON.stringify(followedComics));
  };

  const handleLockedChapterClick = (chapter) => {
    setSelectedChapter(chapter);
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
                <BackgroundComponent imageUrl={comic.imageUrl} />
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
                        <li>
                          <span>Type:</span> {comic.type}
                        </li>
                        <li>
                          <span>author:</span> {comic.author}
                        </li>
                        <li>
                          <span>Date aired:</span> {comic.releaseDate}
                        </li>
                        <li>
                          <span>Status:</span> {comic.status}
                        </li>
                        <li>
                          <span>Genre:</span> {comic.genre}
                        </li>
                      </ul>
                    </div>
                    <div className="col-lg-6 col-md-6">
                      <ul>
                        <li>
                          <span>Scores:</span> {comic.scores}
                        </li>
                        <li>
                          <span>Duration:</span> {comic.duration}
                        </li>
                        <li>
                          <span>Quality:</span> {comic.quality}
                        </li>
                        <li>
                          <span>Views:</span> {comic.views}
                        </li>
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
                    to={(() => {
                      const chapterOne = comic.chapters.find(chap =>
                        parseInt(chap.title.match(/\d+/)[0], 10) === 1
                      );
                      return chapterOne ? `/reading/${comic.id}/${comic.chapters.indexOf(chapterOne) + 1}` : "#";
                    })()}
                    className="read-btn"
                  >
                    <span>Read Now</span> <i className="fa fa-angle-right"></i>
                  </Link>

                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-8">
            {/* Danh sách chapter sử dụng .anime__details__episodes */}
            <div className="details__chapters">
              <h4>Chapters</h4>
              <div className="chapter-list">
                {comic.chapters.map((chapter, index) => {
                  const chapterNumber = parseInt(chapter.title.match(/\d+/)[0], 10);
                  const isLocked = chapterNumber >= 6;

                  return (
                    <Link
                      key={index}
                      to={isLocked ? "#" : `/reading/${comic.id}/${index + 1}`} // Thay link mới
                      className={`chapter-item ${isLocked ? "locked" : ""}`}
                      onClick={isLocked ? (e) => { e.preventDefault(); handleLockedChapterClick(chapter); } : null}
                    >
                      <div className="chapter-item__content">
                        <span className="chapter-item__number">{chapter.title}</span>
                      </div>
                      <i className={isLocked ? "fa fa-lock chapter-item__icon" : "fa fa-arrow-right chapter-item__icon"}></i>
                    </Link>
                  );
                })}
              </div>
            </div>

            <Review />
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            <div className="product__sidebar">
              <div className="product__sidebar__view">
                <div className="section-title">
                  <h5>Top Views</h5>
                </div>
                <ul className="filter__controls">
                  <li className="active" data-filter="*">
                    Day
                  </li>
                  <li data-filter=".week">Week</li>
                  <li data-filter=".month">Month</li>
                  <li data-filter=".years">Years</li>
                </ul>
                <div className="filter__gallery">
                  {comics.map((comic) => ( // Thay thế trendingComics bằng comics
                    <div
                      key={comic.id}
                      className="product__sidebar__view__item set-bg"
                      style={{
                        backgroundImage: `url(${comic.imageUrl})`,
                      }}
                    >
                      <div className="ep">{comic.episodes}</div>
                      <div className="view">
                        <i className="fa fa-eye"></i> {comic.views}
                      </div>
                      <h5>
                        <Link
                          to={{
                            pathname: `/comic-detail/${comic.id}`,
                            state: { comic }, // Truyền dữ liệu comic qua state
                          }}
                        >
                          {comic.title}
                        </Link>
                      </h5>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {showPurchaseModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>Purchase Chapter</h4>
            <p>{selectedChapter?.title}</p> <span>999 xu</span>
            <div className="modal-buttons">
              <button className="buy-btn" onClick={() => setShowConfirmModal(true)}>Buy Chapter</button>
              <button className="cart-btn" onClick={addToCart}>Add to Cart</button>
            </div>
            <button className="close-btn" onClick={() => setShowPurchaseModal(false)}>Close</button>
          </div>
        </div>
      )}

      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>Are you sure?</h4>
            <div className="modal-buttons">
              <button className="buy-btn">Yes</button>
              <button className="buy-btn" onClick={() => setShowConfirmModal(false)}>No</button>
            </div>
          </div>
        </div>
      )}


    </section>
  );
};

export default ComicDetails;
