// src/pages/AdminPage.jsx
import React, { useState } from "react";
import Sidebar from "./sidebar";
import Dashboard from "./dashboard";

const Staffpage = () => {
  const [selected, setSelected] = useState("dashboard");

  const renderContent = () => {
    switch (selected) {
      case "dashboard":
        return <Dashboard />;
      case "comments management":
        return <div style={{ padding: "20px" }}>Comments Management</div>;
      case "website":
        return <div style={{ padding: "20px" }}>Website Notifications</div>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar onSelect={setSelected} selectedItem={selected} />
      <div style={{ flex: 1 }}>{renderContent()}</div>
    </div>
  );
};

export default Staffpage;
