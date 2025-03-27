import React from "react";
import { Link } from "react-router-dom";
import CloseIcon from '@mui/icons-material/Close';

export default function Sidebar({ onClose }) {
  return (
    <div className="sidebar">
      <div className="sidebar__close" onClick={onClose}>
        <CloseIcon sx={{ fontSize: 40, color: 'black' }} />
      </div>
      <nav className="sidebar__menu">
        <ul>
          <li>
            <Link to="/">Homepage</Link>
          </li>
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
      </nav>
    </div>
  );
}
