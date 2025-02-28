import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { comics } from "../data"; // Import comics data từ data.jsx
import Review from "../wrapper/comics/review";

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
                <div className="anime__details__rating">
                  <div className="rating">
                    {[...Array(5)].map((_, index) => (
                      <a href="#" key={index}>
                        <i className={index < comic.rating ? "fa fa-star" : "fa fa-star-half-o"}></i>
                      </a>
                    ))}
                  </div>
                  <span>{comic.votes} Votes</span>
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
                          <span>Studios:</span> {comic.studios}
                        </li>
                        <li>
                          <span>Date aired:</span> {comic.airDate}
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
                          <span>Rating:</span> {comic.rating}
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
                  <a href="#" className="read-btn">
                    <span>Read Now</span> <i className="fa fa-angle-right"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Danh sách chapter sử dụng .anime__details__episodes */}
        <div className="anime__details__episodes">
          <h4>Chapters</h4>
          <div className="chapter-list">
            {comic.chapters.map((chapter, index) => (
              <a key={index} href={index >= 5 ? "#" : chapter.link} className={`chapter-item ${index >= 5 ? 'locked' : ''}`} onClick={index >= 5 ? (e) => { e.preventDefault(); handleLockedChapterClick(chapter); } : null} >
                <div className="chapter-item__content">
                  <span className="chapter-item__number">Chapter {index + 1}: </span>
                  <span className="chapter-item__title">{chapter.title}</span>
                </div>
                <i className={index >= 5 ? "fa fa-lock chapter-item__icon" : "fa fa-arrow-right chapter-item__icon"}></i>
              </a>
            ))}

          </div>
        </div>

        <Review />
      </div>
      {showPurchaseModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>Purchase Chapter</h4>
            <p>{selectedChapter?.title}</p>
            <div className="modal-buttons">
              <button className="buy-btn">Buy Chapter</button>
              <button className="cart-btn">Add to Cart</button>
            </div>
            <button className="close-btn" onClick={() => setShowPurchaseModal(false)}>Close</button>
          </div>
        </div>
      )}
    </section>
  );
};

export default ComicDetails;
