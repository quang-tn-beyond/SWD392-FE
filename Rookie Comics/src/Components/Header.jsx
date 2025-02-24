// Header.jsx
import { Link } from "react-router-dom";
import React, { useContext } from "react";
import  ProfileMenu  from "./ProfileMenu";
import { AuthContext } from "./AuthContext";

export default function Header() {
  const { isLoggedIn, setIsLoggedIn, checkAuth } = useContext(AuthContext);

  // Giả sử rằng các hành động đăng nhập khác sẽ gọi checkAuth hoặc setIsLoggedIn(true)
  const handleLogout = () => {
    setIsLoggedIn(false);
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
                        <Link to="/details">Comic Details</Link>
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
              <Link to="/search" className="search-switch">
                <span className="icon_search"></span>
              </Link>
              {isLoggedIn ? (
                <ProfileMenu onLogout={handleLogout} />
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
    </header>
  );
}
