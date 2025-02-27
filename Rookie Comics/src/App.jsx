import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google"; // ✅ Import this!

import Header from "./components/Header";
import Home from "./pages/home";
import Footer from "./components/Footer";
import Login from "./pages/login";
import Admin from "./pages/admins/admin";
import Categories from "./pages/categories";
import BlogDetails from "./pages/blog-details";
import Blog from "./pages/blog";
import Details from "./pages/details";
import Staffpage from "./pages/staffpage/staffpage";
import Moderator from "./pages/moderatorpage/moderator";
import { AuthProvider } from "./components/AuthContext";
import ComicDetails from "./pages/details";
import ReadingPage from "./pages/readingpage";
import Bookshelf from "./pages/bookshelf";
import Cart from "./pages/cart";
import Pricing from "./pages/pricing";

const App = () => {
  return (

    <GoogleOAuthProvider clientId="717866262643-77vit52fq5r4i29pmpkomtjaq3fv7vu8.apps.googleusercontent.com">
      <AuthProvider>
        <Router>
          <Header />
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/comic-detail/:id" element={<ComicDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/blogdetails" element={<BlogDetails />} />
            <Route path="/staffpage" element={<Staffpage />} />
            <Route path="/moderator" element={<Moderator />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/details" element={<Details />} />
            <Route path="/reading" element={<ReadingPage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/bookshelf" element={<Bookshelf />} />
            <Route path="/pricing" element={<Pricing />} />
          </Routes>
          <Footer />
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>

  );
};

export default App;
