import React, { useContext, useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import ProfileMenu from "./ProfileMenu";
import { AuthContext } from "./AuthContext";
import { getAllComics } from "../utils/ComicService";

export default funtion Headers() {
  const { isLoggedIn } = useContext(AuthContext);

  // States for search query, comics data, loading, and errors
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchRef = useRef(null);

  // Toggle search bar visibility
  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setShowSearch(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch comics when the component mounts
  useEffect(() => {
    const fetchComics = async () => {
      setLoading(true);
      try {
        const response = await getAllComics();
        setComics(response.data); // Assuming the API returns comics in the `data` field
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComics();
  }, []);

  return (
    <header className="header">
      <div className="container">
        <div className="row">
          {/* Logo */}
          <div className="col-lg-2">
            <div className="header__logo">
              <Link to="/">
                <img src="/assets/img/logo.png" alt="logo" />
              </Link>
            </div>
          </div>
          {/* Navigation */}
          <div className="col-lg-8">
            <div className="header__nav">
              <nav className="header__menu mobile-menu">
                <ul>
                  <li className="active">
                    <Link to="/" style={{ fontSize: '30px' }}>Homepage</Link>
                  </li>
                  <li className="active">
                    <Link to="/categories" style={{ fontSize: '30px' }}>
                      Categories <span className="arrow_carrot-down"></span>
                    </Link>
                    <ul className="dropdown">
                      <li>
                        <Link to="/categories">Categories</Link>
                      </li>
                      <li>
                        <Link to="/blogdetails">Blog Details</Link>
                      </li>
                      <li>
                        <Link to="/login">Login</Link>
                      </li>
                      <li>
                        <Link to="/admin">Admin</Link>
                      </li>
                      <li>
                        <Link to="/staffpage">Staff</Link>
                      </li>
                      <li>
                        <Link to="/bookshelf">Bookshelf</Link>
                      </li>
                    </ul>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
          {/* Right Side */}
          <div className="col-lg-2">
            <div className="header__right">
              <Link to="/cart" className="cart-switch">
                <span className="icon_cart"></span>
              </Link>
              <Link to="/pricing" className="pricing-switch">
                <span className="fas fa-dollar-sign" style={{ color: 'black' }}></span>
              </Link>
              <Link to="/search" className="search-switch" onClick={toggleSearch}>
                <span className="icon_search" style={{ color: 'black' }}></span>
              </Link>
              {isLoggedIn ? (
                <ProfileMenu />
              ) : (
                <Link to="/login">
                  <span className="icon_profile"></span>
                </Link>
              )}
            </div>
          </div>
        </div>
        <div id="mobile-menu-wrap"></div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="search-bar" ref={searchRef}>
          <input
            type="text"
            placeholder="Tìm kiếm truyện..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="search-icon">
            <span className="icon_search"></span>
          </button>
          {/* Suggest Comic */}
          <div className="search-results">
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            {searchQuery &&
              comics
                .filter((comic) =>
                  comic.title.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((comic) => (
                  <Link
                    key={comic.id}
                    to={`/comic-detail/${comic.id}`}
                    className="search-item"
                    onClick={() => setSearchQuery("")}
                  >
                    <img src={comic.imageUrl} alt={comic.title} />
                    <span>{comic.title}</span>
                  </Link>
                ))}
          </div>
        </div>
      )}
    </header>
  );
}


