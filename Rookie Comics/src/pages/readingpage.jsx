import Review from "../wrapper/comics/review";

const ReadingPage = () => {
    return (
        <section>
            <div class="container">
                {/* Breadcrumb */}
                <div class="breadcrumb">
                    <a href="#"><i class="fas fa-home"></i></a>
                    <span>Genres</span>
                    <span>Beauty and Monster</span>
                    <span class="current-chapter">Chapter 87</span>
                </div>

                {/* Title */}
                <div class="chapter-title">
                    <h1>Beauty and Monster - Chapter 87</h1>
                    <p class="update-time">(Updated date: 10:54 22-01-2025)</p>
                </div>

                {/* Chapter Controls */}
                <div class="chapter-controls">
                    <a href="#"><i class="fas fa-home"></i></a>
                    <a href="#"><i class="fas fa-bars"></i></a>
                    <a href="#"><i class="fas fa-undo"></i></a>
                    <button><i class="fas fa-arrow-left"></i></button>
                    <select class="scroll" >
                        <option>Chapter 87</option>
                        <option>Chapter 85</option>
                    </select>
                    <button><i class="fas fa-arrow-right"></i></button>
                </div>

                {/* Comic Page */}
                <div class="comic-container">
                    <img src="https://example.com/comic-page-1.jpg" alt="Page 1" class="comic-image" />
                    <img src="https://example.com/comic-page-2.jpg" alt="Page 2" class="comic-image" />
                    <img src="https://example.com/comic-page-3.jpg" alt="Page 3" class="comic-image" />
                </div>

                {/* Review */}
                <Review />
            </div>
        </section>
    );
}

export default ReadingPage;