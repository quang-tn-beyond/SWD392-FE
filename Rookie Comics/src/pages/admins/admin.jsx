import React, { Fragment, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Drawer, List, ListItem, ListItemText, Divider, IconButton, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

// Các component quản lý nội dung
import UserManagement from "./user-management/UserManagement";
import Dashboard from "./dashboard";
import ComicManagement from "./staff-page/ComicManagement";
import GenreManagement from "./staff-page/GenreManagement";

const Sidebar = ({ onSelect, open, toggleDrawer }) => {
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={toggleDrawer}
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
        },
      }}
    >
      <List>
        <ListItem button onClick={() => onSelect("dashboard")}>
          <ListItemText primary="Biểu đồ" />
        </ListItem>
        <Divider />
        <ListItem button onClick={() => onSelect("genre")}>
          <ListItemText primary="Thể loại" />
        </ListItem>
        <Divider />
        <ListItem button onClick={() => onSelect("comic")}>
          <ListItemText primary="Truyện" />
        </ListItem>
        <Divider />
        <ListItem button onClick={() => onSelect("user")}>
          <ListItemText primary="Quản lý người dùng" />
        </ListItem>
      </List>
    </Drawer>
  );
};

const Admin = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [selected, setSelected] = useState("dashboard"); // Default is Dashboard
  const [open, setOpen] = useState(false); // State to manage sidebar toggle

  const toggleDrawer = () => {
    setOpen(!open); // Toggle the drawer state
  };

  const renderContent = () => {
    switch (selected) {
      case "genre":
        return <GenreManagement />;
      case "comic":
        return <ComicManagement />;
      case "user":
        return <UserManagement />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Fragment>
      <Box sx={{ display: "flex" }}>
        {/* Menu Icon to Toggle Sidebar */}
        <IconButton
  onClick={toggleDrawer}
  sx={{
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 1000,
    bgcolor: "white", // White background for the IconButton
    borderRadius: "50%", // Circular background
    padding: 1, // Padding for the icon inside the button
    "& .MuiSvgIcon-root": {
      color: "black", // Black color for the icon itself
    },
  }}
>
  <MenuIcon />
</IconButton>


        {/* Sidebar */}
        <Sidebar onSelect={setSelected} open={open} toggleDrawer={toggleDrawer} />

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: "background.default",
            p: 3,
            marginLeft: open ? 240 : 0, // Adjust content margin based on sidebar state
            transition: "margin-left 0.3s ease", // Smooth transition
          }}
        >
          {renderContent()}
        </Box>
      </Box>
    </Fragment>
  );
};

export default Admin;
