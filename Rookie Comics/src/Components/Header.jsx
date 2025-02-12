
import { Link } from "react-router-dom";

export default function Header() {
    return (
        <header class="header">
            <div class="container">
                <div class="row">
                    <div class="col-lg-2">
                        <div class="header__logo">
                            <a href="./">
                                <img src="src/assets/img/logo.png" alt="" />
                            </a>
                        </div>
                    </div>
                    <div class="col-lg-8">
                        <div class="header__nav">
                            <nav class="header__menu mobile-menu">
                                <ul>
                                    <li class="active"><a href="./">Homepage</a></li>
                                    <li><a href="./categories.html">Categories <span class="arrow_carrot-down"></span></a>
                                        <ul class="dropdown">
                                            <li><a href="./categories.html">Categories</a></li>
                                            <li><a href="./anime-details.html">Manga Details</a></li>
                                            <li><a href="./anime-watching.html">Manga Watching</a></li>
                                            <li><a href="./blog-details.html">Blog Details</a></li>
                                            <li><a href="./signup.html">Sign Up</a></li>
                                            <li><Link to="/login">Login</Link></li>
                                        </ul>
                                    </li>
                                    <li><a href="./blog.html">Our Blog</a></li>
                                    <li><a href="#">Contacts</a></li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                    <div class="col-lg-2">
                        <div class="header__right">
                            <a href="#" class="search-switch"><span class="icon_search"></span></a>
                            <a href="./login"><span class="icon_profile"></span></a>
                        </div>
                    </div>
                </div>
                <div id="mobile-menu-wrap"></div>
            </div>
        </header>
    );
}

