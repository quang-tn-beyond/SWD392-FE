export default function Footer() {
    return (
        <footer className="footer">
            <div className="page-up">
                <a href="#" id="scrollToTopButton"><span className="arrow_carrot-up"></span></a>
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-lg-3">
                        <div className="footer__logo">
                            <a href="/"><img src="img/logo.png" alt="Logo" /></a>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="footer__nav">
                            <ul>
                                <li className="active"><a href="/">Homepage</a></li>
                                <li><a href="/categories">Categories</a></li>
                                <li><a href="/blog">Our Blog</a></li>
                                <li><a href="/contact">Contacts</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-3"></div>
                </div>
            </div>
        </footer>
    );
}
