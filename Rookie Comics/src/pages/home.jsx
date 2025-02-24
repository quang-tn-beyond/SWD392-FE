import React from "react";
import { Link } from "react-router-dom";
import ComicCollection from "../wrapper/comics/collection";
import { comics } from "../data";

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

export default function Home() {
  return (
    <section className="product spad">
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            {/* Các danh mục truyện */}
            <ComicCollection
              comics={comics} // Thay thế trendingComics bằng comics
              layout="custom-layout-class"
              title="Trending Comics"
            />
            <ComicCollection
              comics={comics} // Thay thế trendingComics bằng comics
              layout="custom-layout-class"
              title="Popular Comics"
            />
            <ComicCollection
              comics={comics} // Thay thế trendingComics bằng comics
              layout="custom-layout-class"
              title="User Comics"
            />
            <ComicCollection
              comics={comics} // Thay thế trendingComics bằng comics
              layout="custom-layout-class"
              title="Etc.. Comics"
            />
          </div>

          <div className="col-lg-4 col-md-6 col-sm-8">
            {/* Sidebar hiển thị các comic được xem nhiều */}
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
    </section>
  );
}
