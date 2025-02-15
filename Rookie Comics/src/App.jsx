import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Components/Header";
import Home from "./pages/home";
import Footer from "./Components/Footer";
import Login from "./pages/login";
import Admin from "./pages/admins/admin";
import Categories from "./pages/categories";
import BlogDetails from "./pages/blog-details";

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/blogdetails" element={<BlogDetails />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
