
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GenreManagement from "./staff-page/GenreManagement";
import ComicManagement from "./staff-page/ComicManagement";
import Layout from "./layout";

const Staff = () => {
    const { pathname } = useLocation();
    // const navigate = useNavigate();

    // // Lấy role từ token hoặc context
    // const user = JSON.parse(localStorage.getItem("user")) || {};
    // const userRole = user.role || null;

    // useEffect(() => {
    //     if (userRole !== 4) {
    //         navigate("/"); // Chặn truy cập nếu không phải Staff
    //     }
    // }, [userRole, navigate]);

    const renderContent = () => {
        switch (pathname) {
            case "/genre":
                return <GenreManagement />;
            case "/comic":
                return <ComicManagement />;
            default:
                return <GenreManagement />;
        }
    };

    return <Layout>{renderContent()}</Layout>;
};

export default Staff;
