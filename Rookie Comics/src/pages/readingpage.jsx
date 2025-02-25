import Review from "../wrapper/comics/review";

const ReadingPage = () => {
    return (
        <section>
            <div className="container">
                {/* Breadcrumb */}
                <div className="breadcrumb">
                    <a href="#"><i className="fas fa-home"></i></a>
                    <span>Thể loại</span>
                    <span>Sát Thủ Anh Vũ</span>
                    <span className="current-chapter">Chapter 87</span>
                </div>

                {/* Title */}
                <div className="chapter-title">
                    <h1>Sát Thủ Anh Vũ - Chapter 87</h1>
                    <p className="update-time">(Cập nhật lúc: 10:54 22-01-2025)</p>
                </div>

                {/* Notification */}
                <div className="notification">
                    <p>Nếu không xem được vui lòng đổi "SERVER" để có trải nghiệm tốt hơn</p>
                    <p className="error-text">Hướng dẫn khắc phục lỗi nếu ảnh bị lỗi ở tất cả các chap</p>
                    <div className="chapter-controls">
                        <button>Server VIP</button>
                        <button>Báo lỗi</button>
                    </div>
                </div>

                {/* Navigation */}
                <div className="chapter-navigation">
                    <div>
                        <i className="fas fa-info-circle"></i>
                        <span>Sử dụng mũi tên trái (-) hoặc phải (+) để chuyển chapter</span>
                    </div>
                </div>

                {/* Chapter Controls */}
                <div className="chapter-controls">
                    <a href="#"><i className="fas fa-home"></i></a>
                    <a href="#"><i className="fas fa-bars"></i></a>
                    <a href="#"><i className="fas fa-undo"></i></a>
                    <button><i className="fas fa-arrow-left"></i></button>
                    <select>
                        <option>Chapter 87</option>
                    </select>
                    <button><i className="fas fa-arrow-right"></i></button>
                </div>

                {/* Comic Page */}
                <div className="comic-container">
                    <img src="https://example.com/comic-page-1.jpg" alt="Page 1" className="comic-image" />
                    <img src="https://example.com/comic-page-2.jpg" alt="Page 2" className="comic-image" />
                    <img src="https://example.com/comic-page-3.jpg" alt="Page 3" className="comic-image" />
                </div>

                {/* Review */}
                <Review />
            </div>
        </section>
    );
}

export default ReadingPage;