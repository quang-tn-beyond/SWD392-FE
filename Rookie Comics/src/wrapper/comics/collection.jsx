import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const BackgroundComponent = ({ imageUrl, className, style }) => {
  return (
    <div
      className={`background-component ${className || ""}`}
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "100%",
        height: "324px",
        aspectRatio: "16 / 9",
        
        ...style, // Gộp thêm các style truyền vào
      }}
    />
  );
};

BackgroundComponent.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
};

const ComicCollection = ({ comics, layout, title }) => {
  return (
    <div className="comic-collection mt-35">
      {title && (
        <div className="section-title">
          <h3>{title}</h3>
        </div>
      )}

      <div className={`row ${layout}`}>
        {comics.map((comic) => (
          <div key={comic.id} className="col-lg-2 col-md-3 col-sm-3">
            <div className="product__item">
            <Link to={`/comic-detail/${comic.id}`} className="product__item__pic">
                <BackgroundComponent imageUrl={comic.imageUrl} 
                />
                <div className="ep">{comic.episodes}</div>
                <div className="comment">
                  <i className="fa fa-comments"></i> {comic.comments || 0}
                </div>
                <div className="view">
                  <i className="fa fa-eye"></i> {comic.views}
                </div>
                </Link>
              <div className="product__item__text">
                <h4>
                  <Link to={`/comic-detail/${comic.id}`}>
                    {comic.title}
                  </Link>
                </h4>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

ComicCollection.propTypes = {
  layout: PropTypes.string,
  comics: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      imageUrl: PropTypes.string.isRequired,
      episodes: PropTypes.string.isRequired,
      comments: PropTypes.number, // Có thể null, không bắt buộc
      views: PropTypes.number.isRequired,
      tags: PropTypes.arrayOf(PropTypes.string), // Không bắt buộc
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
  title: PropTypes.string,
};

export default ComicCollection;
