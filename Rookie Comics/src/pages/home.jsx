import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ComicCollection from "../wrapper/comics/collection";
import { getAllComics } from "../utils/ComicService"; // Import API

export default function Home() {
  const [comics, setComics] = useState([]);

  useEffect(() => {
    getAllComics()
      .then((response) => {
        if (Array.isArray(response.data)) {
          const formattedComics = response.data.map((comic) => ({
            id: comic.comicId,
            title: comic.comicName,
            imageUrl: comic.coverUrl,
            views: comic.view,
            episodes: String(comic.quantityChap), // Ép kiểu số sang chuỗi
          }));
          setComics(formattedComics);
        } else {
          console.error("Dữ liệu API không đúng:", response.data);
          setComics([]);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách truyện:", error);
        setComics([]);
      });
  }, []);

  return (
    <section className="product spad">
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            {/* Các danh mục truyện */}
            <ComicCollection comics={comics} layout="custom-layout-class" title="Trending Comics" />
            <ComicCollection comics={comics} layout="custom-layout-class" title="Popular Comics" />
            <ComicCollection comics={comics} layout="custom-layout-class" title="User Comics" />
            <ComicCollection comics={comics} layout="custom-layout-class" title="Etc.. Comics" />
          </div>

          {/* Sidebar */}
          <SidebarTopViews comics={comics} />
        </div>
      </div>
    </section>
  );
}

// 🔹 Di chuyển SidebarTopViews ra ngoài Home
const SidebarTopViews = ({ comics }) => {
  const [filter, setFilter] = useState("day"); // State lưu bộ lọc

  // Hàm lọc truyện theo điều kiện
  const filteredComics = comics.filter((comic) => {
    if (filter === "day") return comic.filterType === "day";
    if (filter === "week") return comic.filterType === "week";
    if (filter === "month") return comic.filterType === "month";
    if (filter === "years") return comic.filterType === "years";
    return true;
  });

  return (
    <div className="col-lg-4 col-md-6 col-sm-8">
      <div className="product__sidebar">
        <div className="product__sidebar__view">
          <div className="section-title">
            <h5>Top Views</h5>
          </div>
          <ul className="filter__controls">
            {["day", "week", "month", "years"].map((time) => (
              <li
                key={time}
                className={filter === time ? "active" : ""}
                onClick={() => setFilter(time)}
              >
                {time.charAt(0).toUpperCase() + time.slice(1)}
              </li>
            ))}
          </ul>
          <div className="filter__gallery">
            {filteredComics.map((comic) => (
              <div
                key={comic.id}
                className="product__sidebar__view__item set-bg"
                style={{ backgroundImage: `url(${comic.imageUrl})` }}
              >
                <div className="ep">{comic.episodes}</div>
                <div className="view">
                  <i className="fa fa-eye"></i> {comic.views}
                </div>
                <h5>
                  <Link to={`/comic-detail/${comic.id}`}>{comic.title}</Link>
                </h5>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
