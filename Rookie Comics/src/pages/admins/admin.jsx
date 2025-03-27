
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GenreManagement from "./staff-page/GenreManagement";
import ComicManagement from "./staff-page/ComicManagement";
import UserManagement from "./user-management/UserManagement";
import Dashboard from "./dashboard";
import Layout from "./layout";
import ChapterManagement4Mod from "./moderator-page/ChapterManagement4Mod";
import OrderManagement from "./staff-page/OrderManagement";

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
      case "/moderator":
        return <ChapterManagement4Mod />;
      case "/orders":
        return <OrderManagement />;
      default:
        return <Dashboard />;
    }
  };

  return <Layout>{renderContent()}</Layout>;
};

export default Admin;
