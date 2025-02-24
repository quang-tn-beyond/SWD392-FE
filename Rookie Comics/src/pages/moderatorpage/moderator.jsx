// src/pages/AdminPage.jsx
import React, { useState } from "react";
import Sidebar from "./sidebar";
import Dashboard from "./dashboard";

const Moderator = () => {
  const [selected, setSelected] = useState("dashboard");

  const renderContent = () => {
    switch (selected) {
      case "dashboard":
        return <Dashboard />;
      case "comic management":
        return <div style={{ padding: "20px" }}>Comic Management</div>;
      case "assign tags":
        return <div style={{ padding: "20px" }}>Assign Tags</div>;
      case "accounts management":
        return <div style={{ padding: "20px" }}>Accounts Management</div>;
      case "reports":
        return <div style={{ padding: "20px" }}>Reports</div>;
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

export default Moderator;
