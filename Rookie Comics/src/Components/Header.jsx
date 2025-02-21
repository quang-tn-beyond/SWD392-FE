
import { Link } from "react-router-dom";

export default function Header() {
    return (
        <header className="header">
            <div className="container">
                <div className="row">
                    <div className="col-lg-2">
                        <div className="header__logo">
                            <a href="./">
                                <img src="/assets/img/logo.png" alt="logo" />
                            </a>
                        </div>
                    </div>
                    <div className="col-lg-8">
                        <div className="header__nav">
                            <nav className="header__menu mobile-menu">
                                <ul>
                                    <li className="active"><a href="./">Homepage</a></li>
                                    <li><a href="./categories">Categories <span className="arrow_carrot-down"></span></a>
                                        <ul className="dropdown">
                                            <li><Link to="/categories">Categories</Link></li>
                                            <li><Link to="/details">Comic Details</Link></li>
                                            <li><Link to="/staffpage">Staff Page</Link></li>
                                            <li><Link to="/moderator">Moderator</Link></li>
                                            <li><Link to="/blogdetails">Blog Details</Link></li>
                                            <li><Link to="/login">Login</Link></li>
                                            <li><Link to="/admin">Admin</Link></li>
                                        </ul>
                                    </li>
                                    <li><Link to="/blog">Blog</Link></li>
                                    <li><a href="#">Contacts</a></li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                    <div className="col-lg-2">
                        <div className="header__right">
                            <a href="#" className="search-switch"><span className="icon_search"></span></a>
                            <a href="./login"><span className="icon_profile"></span></a>
                        </div>
                    </div>
                </div>
                <div id="mobile-menu-wrap"></div>
            </div>
        </header>
    );
}

