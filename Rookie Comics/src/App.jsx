import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google"; // ✅ Import this!

import Header from "./Components/Header";
import Home from "./pages/home";
import Footer from "./Components/Footer";
import Login from "./pages/login";
import Admin from "./pages/admins/admin";
import Categories from "./pages/categories";
import BlogDetails from "./pages/blog-details";
import Blog from "./pages/blog";
import Details from "./pages/details";
import Staffpage from "./pages/staffpage/staffpage";
import Moderator from "./pages/moderatorpage/moderator";

const App = () => {
  return (
<<<<<<< Updated upstream
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/staffpage" element={<Staffpage />} />
        <Route path="/moderator" element={<Moderator />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/blogdetails" element={<BlogDetails />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/details" element={<Details />} />
      </Routes>
      <Footer />
    </Router>
=======
    <GoogleOAuthProvider clientId="717866262643-77vit52fq5r4i29pmpkomtjaq3fv7vu8.apps.googleusercontent.com">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/blogdetails" element={<BlogDetails />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/details" element={<Details />} />
        </Routes>
        <Footer />
      </Router>
    </GoogleOAuthProvider>
>>>>>>> Stashed changes
  );
};

export default App;
