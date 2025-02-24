import React, { useState, useContext, useRef, useEffect } from "react";
import { AuthContext } from "./AuthContext";

const ProfileMenu = ({ onLogout }) => {
  const { user, logout } = useContext(AuthContext);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef();

  const handleToggleMenu = () => {
    setShowMenu(prev => !prev);
    console.log("Toggle menu", !showMenu);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    if (onLogout) onLogout();
  };

  return (
    <div ref={menuRef} style={{ position: "relative", display: "inline-block" }}>
      <button onClick={handleToggleMenu} style={{ border: "none", background: "none" }}>
        <span className="icon_profile"></span>
      </button>
      {showMenu && (
        <div
          className="mini-menu"
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            background: "#fff",
            border: "1px solid red", // Dùng border đỏ để kiểm tra
            padding: "10px",
            borderRadius: "4px",
            zIndex: 100,
          }}
        >
          <p>Email: {user?.email}</p>
          <p>Role: {user?.role}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
