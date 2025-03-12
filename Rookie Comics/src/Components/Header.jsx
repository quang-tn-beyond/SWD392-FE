// Header.jsx
import { Link } from "react-router-dom";
import React, { useContext, useState } from "react";
import ProfileMenu from "./ProfileMenu";
import { AuthContext } from "./AuthContext";
import { comics } from "../data";

export default function Header() {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

  // Xử lý logout không cần thiết ở đây vì đã có trong ProfileMenu, 
  // nhưng nếu cần bạn có thể gọi setIsLoggedIn(false) tại đây.
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

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
                    <Link to="/">Homepage</Link>
                  </li>
                  <li>
                    <Link to="/categories">
                      Categories <span className="arrow_carrot-down"></span>
                    </Link>
                    <ul className="dropdown">
                      <li>
                        <Link to="/categories">Categories</Link>
                      </li>
                      <li>
                        <Link to="/staffpage">Staff Page</Link>
                      </li>
                      <li>
                        <Link to="/moderator">Moderator</Link>
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
                        <Link to="/bookshelf">Bookshelf</Link>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <Link to="/blog">Blog</Link>
                  </li>
                  <li>
                    <Link to="/contacts">Contacts</Link>
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
                <span className="fas fa-dollar-sign"></span>
              </Link>
              <Link to="/search" className="search-switch" onClick={toggleSearch}>
                <span className="icon_search"></span>
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


      {/* searchBar */}
      {showSearch && (
        <div className="search-bar">
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
            {searchQuery && comics.filter((comic) => comic.title.toLowerCase().includes(searchQuery.toLowerCase())).map((comic) => (
              <div key={comic.id} className="search-item">
                <img src={comic.imageUrl} alt={comic.title} />
                <span>{comic.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
