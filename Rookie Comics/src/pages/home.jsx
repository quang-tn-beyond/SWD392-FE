import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ComicCollection from "../wrapper/comics/collection";
import { getAllComics } from "../utils/ComicService"; // Import API
import ComicSwiper from "../Components/ComicSwiper";
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
        <div className="section-title">
          <h2>Top View Comics</h2>
        </div>
        <div className="centered-container">
          <ComicSwiper comics={comics} />
        </div>

        <div className="row">
          <div className="col-lg-12">
            {/* Các danh mục truyện */}
            <ComicCollection comics={comics} layout="custom-layout-class" title="Trending Comics" />
            <ComicCollection comics={comics} layout="custom-layout-class" title="Popular Comics" />
            <ComicCollection comics={comics} layout="custom-layout-class" title="User Comics" />
            <ComicCollection comics={comics} layout="custom-layout-class" title="Etc.. Comics" />
          </div>


        </div>
      </div>
    </section>
  );
}