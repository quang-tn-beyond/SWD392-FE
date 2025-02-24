import PropTypes from "prop-types";
import { Link } from "react-router-dom";

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

const ComicCollection = ({ comics, layout, title }) => {
  return (
    <div className="comic-collection mt-35">
      {title && (
        <div className="section-title">
          <h4>{title}</h4>
        </div>
      )}

      <div className={`row ${layout}`}>
        {comics.map((comic) => (
          <div key={comic.id} className="col-lg-4 col-md-6 col-sm-6">
            <div className="product__item">
              <div className="product__item__pic set-bg">
                <BackgroundComponent imageUrl={comic.imageUrl} />
                <div className="ep">{comic.episodes}</div>
                <div className="comment">
                  <i className="fa fa-comments"></i> {comic.comments}
                </div>
                <div className="view">
                  <i className="fa fa-eye"></i> {comic.views}
                </div>
              </div>
              <div className="product__item__text">
                <ul>
                  {comic.tags.map((tag, i) => (
                    <li key={i}>{tag}</li>
                  ))}
                </ul>
                <h5>
                  <Link to={`/comic-detail/${comic.id}`}>
                    {comic.title}
                  </Link>
                </h5>
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
      id: PropTypes.string.isRequired, // Đảm bảo có id duy nhất cho từng comic
      imageUrl: PropTypes.string.isRequired,
      episodes: PropTypes.string.isRequired,
      comments: PropTypes.number.isRequired,
      views: PropTypes.number.isRequired,
      tags: PropTypes.arrayOf(PropTypes.string).isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
  title: PropTypes.string,
};

export default ComicCollection;
