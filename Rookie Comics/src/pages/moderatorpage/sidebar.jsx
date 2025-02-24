// src/components/Sidebar.jsx
import React from "react";

const Sidebar = ({ onSelect, selectedItem }) => {
  const menuItems = [
    { key: "dashboard", label: "Dashboard" },
    { key: "comic management", label: "Comic Management" },
    { key: "assign tags", label: "Assign Tags" },
    { key: "accounts management", label: "Accounts Management" },
    { key: "reports", label: "Reports" },
  ];

  return (
    <div
      style={{
        width: "250px",
        backgroundColor: "var(--primary-color)", // Uses the primary color variable
        minHeight: "100vh",
        padding: "20px",
        color: "#fff",
      }}
    >
      <h4 style={{ color: "#fff" }}>Moderator Menu</h4>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {menuItems.map((item) => (
          <li
            key={item.key}
            style={{
              padding: "10px",
              cursor: "pointer",
              backgroundColor: selectedItem === item.key ? "#555" : "inherit",
              borderRadius: "4px",
              marginBottom: "5px",
              color: "#fff",
            }}
            onClick={() => onSelect(item.key)}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
