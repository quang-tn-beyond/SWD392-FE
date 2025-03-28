import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { getComicsById } from "../utils/ComicService";
import { getAllChapters } from "../utils/ChapterService";
import { getAllUsers } from "../utils/UserService";
import { AuthContext } from "../components/AuthContext";
import Review from "../wrapper/comics/review";
import { Dialog, DialogTitle, DialogContent,Typography,DialogActions, Button } from "@mui/material";

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
  const { user } = useContext(AuthContext); // Lấy thông tin người dùng từ AuthContext
  const [comic, setComic] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [isFollowing, setIsFollowing] = useState(false);
  const [openAddToCartDialog, setOpenAddToCartDialog] = useState(false);
const [lockedChapter, setLockedChapter] = useState(null); // Để lưu thông tin của chapter bị khóa


  useEffect(() => {
    console.log("Role from AuthContext: ", user?.role); // Kiểm tra role từ AuthContext
  }, [user?.role]);

  const getStatusLabel = (status) => {
    const statusMap = {
      0: "Đã Xóa",
      1: "Đang Xử Lý",
      2: "Đang Phát Hành",
      3: "Hoàn Thành",
      4: "Đã Dừng",
      5: "Đã Duyệt",
      6: "Bị Từ Chối",
    };
    return statusMap[status] || "Không Xác Định";
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        if (Array.isArray(response.data)) {
          const mapping = response.data.reduce((acc, user) => {
            acc[user.userId] = `${user.lastName} ${user.firstName}`;
            return acc;
          }, {});
          setUsersMap(mapping);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (comicId) {
      getComicsById(comicId)
        .then((response) => {
          setComic(response.data);
        })
        .catch((error) => console.error("Lỗi khi tải chi tiết truyện:", error));

      getAllChapters()
        .then((response) => {
          if (Array.isArray(response.data)) {
            const filteredChapters = response.data.filter(
              (chap) => chap.comicId === comicId && chap.status !== 0 && chap.status !== 3
            );
            setChapters(filteredChapters);
          }
        })
        .catch((error) => console.error("Lỗi khi tải danh sách chapter:", error));
    }
  }, [comicId]);

  useEffect(() => {
    const followedComics = JSON.parse(localStorage.getItem("followedComics")) || [];
    setIsFollowing(followedComics.includes(comicId));
  }, [comicId]);

  const handleLockedChapterClick = (chapter) => {
    setLockedChapter(chapter); // Lưu lại chapter bị khóa vào state
    setOpenAddToCartDialog(true); // Mở dialog
  };
  
  const handleAddToCart = () => {
    // Logic để thêm truyện vào giỏ hàng (Ví dụ: lưu vào localStorage hoặc state giỏ hàng)
    console.log(`Thêm truyện ${lockedChapter?.title} vào giỏ hàng`);
    setOpenAddToCartDialog(false); // Đóng dialog sau khi thêm
  };
  
  const handleCancel = () => {
    setOpenAddToCartDialog(false); // Đóng dialog nếu người dùng hủy
  };
  

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

  const isChapterLocked = (chapter, index) => {
    // Kiểm tra nếu chapter là FREE (type === 0)
    if (chapter.type === 0) {
      return false; // Không khóa chapter
    }

    // Kiểm tra nếu role là CUSTOMER_NORMAL (5) hoặc CUSTOMER_AUTHOR (7) và chapter là PAID
    if ((user?.role === 5 || user?.role === 7) && index >= 1) {
      return true; // Khóa từ chapter thứ 2 trở đi
    }

    // Kiểm tra nếu role là CUSTOMER_READER (6) hoặc CUSTOMER_VIP (8), không khóa chapter nào
    if (user?.role === 6 || user?.role === 8) {
      return false; // Không khóa chapter nào
    }

    // Các role còn lại không bị khóa chapter
    return false;
  };

  if (!comic) return <div>Loading...</div>;

  const authorName = comic.authorId ? usersMap[comic.authorId] || "Không xác định" : "Không xác định";

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
                        <li><span>Author:</span> {authorName}</li>
                        <li><span>Date aired:</span> {comic.createdDate}</li>
                        <li><span>Trạng thái:</span> {getStatusLabel(comic.status)}</li>
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
                    .sort((a, b) => new Date(a.publishedDate) - new Date(b.publishedDate))
                    .map((chapter, index) => (
                      <div key={chapter.chapterId} className="chapter-item">
                        {isChapterLocked(chapter, index) ? (
                          <div className="locked-chapter"
                          onClick={() => handleLockedChapterClick(chapter)}>
                            <span className="title">Chapter {index + 1}</span>
                            <i className="fa fa-lock chapter-icon"></i>
                          </div>
                        ) : (
                          <Link to={`/reading/${comicId}/${chapter.chapterId}`} className="chapter-item">
                            Chapter {index + 1}
                          </Link>
                        )}
                      </div>
                    ))
                ) : (
                  <p>Chưa có chapter nào</p>
                )}
              </div>
            </div>
            <Review />
          </div>
          <Dialog open={openAddToCartDialog} onClose={handleCancel}>
  <DialogTitle>Thêm truyện vào giỏ hàng</DialogTitle>
  <DialogContent>
    <Typography variant="body1">
      Bạn muốn thêm truyện <strong>{lockedChapter?.title}</strong> vào giỏ hàng không?
    </Typography>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCancel} color="primary">
      Hủy
    </Button>
    <Button onClick={handleAddToCart} color="primary">
      Thêm vào giỏ hàng
    </Button>
  </DialogActions>
</Dialog>

        </div>
      </div>
    </section>
  );
};

export default ComicDetails;
