// Admin.js
import React from "react";
import { useLocation } from "react-router-dom";
import GenreManagement from "./staff-page/GenreManagement";
import ComicManagement from "./staff-page/ComicManagement";
import UserManagement from "./user-management/UserManagement";
import Dashboard from "./dashboard";
import Layout from "./layout";
const Admin = () => {
  const { pathname } = useLocation();

  const renderContent = () => {
    switch (pathname) {
      case "/genre":
        return <GenreManagement />;
      case "/comic":
        return <ComicManagement />;
      case "/user":
        return <UserManagement />;
      default:
        return <Dashboard />;
    }
  };

  return <Layout>{renderContent()}</Layout>;
};

export default Admin;
