import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation"; // Import css cho navigation (mũi tên)
import { Link } from "react-router-dom";

const ComicSwiper = ({ comics }) => {
  return (
    <div className="flex justify-center">
      {/* Container Swiper chỉ chiếm 8 cột */}
      <div className="w-full max-w-screen-lg"> {/* max-w-screen-lg cho phép chiếm 8/12 cột */}
        <Swiper
          modules={[Pagination, Navigation]}
          spaceBetween={20}
          slidesPerView={4} // Hiển thị 4 truyện mỗi lần cuộn
          pagination={{ clickable: true }} // Dấu chấm chỉ mục
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          className="w-full"
        >
          {comics.map((comic) => (
            <SwiperSlide key={comic.id}>
              <div className="comic-card">
                <img
                  src={comic.imageUrl}
                  alt={comic.title}
                  className="comic-image"
                />
                <div className="comic-info">
                  <h3 className="comic-title">{comic.title}</h3>
                  <p className="comic-views">
                    <i className="fa fa-eye"></i> {comic.views} views
                  </p>
                  <Link to={`/comic-detail/${comic.id}`} className="read-link">
                    Đọc ngay
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}

          {/* Mũi tên điều hướng */}
          <div className="swiper-button-next"></div>
          <div className="swiper-button-prev"></div>
        </Swiper>
      </div>
    </div>
  );
};

export default ComicSwiper;
