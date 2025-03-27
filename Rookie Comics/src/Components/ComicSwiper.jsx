import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const ComicSwiper = ({ comics }) => {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-screen-lg">
        <Swiper
          modules={[Pagination, Navigation, Autoplay]} // Thêm Autoplay
          spaceBetween={20}
          slidesPerView={4}
          pagination={{ clickable: true }}
          navigation={true}
          loop={true} // Cho phép chạy vòng lặp vô hạn
          autoplay={{
            delay: 2000, // Độ trễ giữa các slide (ms)
            disableOnInteraction: false, // Không dừng khi người dùng tương tác
            pauseOnMouseEnter: true, // Dừng khi di chuột vào swiper (tuỳ chọn)
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
                    <i className="fa fa-eye"></i> {comic.views}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ComicSwiper;
