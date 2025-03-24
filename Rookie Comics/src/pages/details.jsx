import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getComicsById } from "../utils/ComicService";
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
  const { comicId } = useParams(); // Lấy comicId từ URL
  const [comic, setComic] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  useEffect(() => {
    if (comicId) {
      console.log("Fetching comic details for:", comicId);
      getComicsById(comicId)
        .then((response) => {
          console.log("API Response:", response.data);
          setComic(response.data);
        })
        .catch((error) => console.error("Lỗi khi tải chi tiết truyện:", error));
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
                    to={() => {
                      if (!comic?.chapters?.length) return "#";
                      const chapterOne = comic.chapters.find(chap =>
                        chap.title.match(/\d+/) && parseInt(chap.title.match(/\d+/)[0], 10) === 1
                      );
                      return chapterOne ? `/reading/${comic.comicId}/1` : "#";
                    }}
                    className="read-btn"
                  >
                    <span>Read Now</span> <i className="fa fa-angle-right"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Review />
      </div>

    </section>
  );
};

export default ComicDetails;
