import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google"; // ✅ Import this!

import Header from "./components/Header";
import Home from "./pages/home";
import Footer from "./components/Footer";
import Login from "./pages/login";
import Admin from "./pages/admins/admin";
import Categories from "./pages/categories";
import BlogDetails from "./pages/blog-details";
import Blog from "./pages/blog";
import { AuthProvider } from "./components/AuthContext";
import ComicDetails from "./pages/details";
import ReadingPage from "./pages/readingpage";
import Bookshelf from "./pages/bookshelf";
import Cart from "./pages/cart";
import Pricing from "./pages/pricing";
import ChapterManagement from "./pages/admins/staff-page/ChapterManagement";
import ComicManagement from "./pages/admins/staff-page/ComicManagement";
import GenreManagement from "./pages/admins/staff-page/GenreManagement";
import UserManagement from "./pages/admins/user-management/UserManagement";
import Dashboard from "./pages/admins/dashboard";
import Staff from "./pages/admins/staff";
import OrderManagement from "./pages/admins/staff-page/OrderManagement";
import ChapterManagement4Mod from "./pages/admins/moderator-page/ChapterManagement4Mod";

const AppWrapper = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <>
      {!isLoginPage && <Header />}
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/comic-detail/:id" element={<ComicDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/genre" element={<GenreManagement />} />
        <Route path="/user" element={<UserManagement />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/comic" element={<ComicManagement />} />
        <Route path="/blogdetails" element={<BlogDetails />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/reading" element={<ReadingPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/bookshelf" element={<Bookshelf />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/comic-detail/:comicId" element={<ComicDetails />} />
        <Route path="/reading/:comicId/:chapterNumber" element={<ReadingPage />} />
        <Route path="/admin/comic-management" element={<ComicManagement />} />
        <Route path="/comic/:comicId/chapters" element={<ChapterManagement />} />
        <Route path="/genre-management" element={<GenreManagement />} />
        <Route path="/moderator" element={<ChapterManagement4Mod />} />
        <Route path="/staffpage" element={<Staff />} />
        <Route path="/orders" element={<OrderManagement />} />
      </Routes>
      {!isLoginPage && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <GoogleOAuthProvider clientId="492020139313-sjvetclndtvnqqose7en21v75o5iv7e3.apps.googleusercontent.com">
      <AuthProvider>
        <Router>
          <AppWrapper />
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
