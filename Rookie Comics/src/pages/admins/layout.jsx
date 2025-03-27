// Layout.js
import React, { useState } from "react";
import { Box, IconButton, Drawer, List, ListItem, ListItemText, Divider, Collapse } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useNavigate } from "react-router-dom";

// Sidebar Component
const Sidebar = ({ open, toggleDrawer }) => {
  const [isProductMenuOpen, setIsProductMenuOpen] = useState(false); // State for product submenu
  const [isBlogMenuOpen, setIsBlogMenuOpen] = useState(false); // State for blog submenu
  const navigate = useNavigate();

  const toggleProductMenu = () => {
    setIsProductMenuOpen(!isProductMenuOpen);
  };

  const toggleBlogMenu = () => {
    setIsBlogMenuOpen(!isBlogMenuOpen);
  };

  const handleSelect = (route) => {
    navigate(route);
  };

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
        <ListItem button onClick={() => handleSelect("/dashboard")}>
          <ListItemText primary="Biểu đồ" />
        </ListItem>
        <Divider />
        <ListItem button onClick={() => handleSelect("/moderator")}>
          <ListItemText primary="Kiểm duyệt nội dung" />
        </ListItem>
        <Divider />
        <ListItem button onClick={() => handleSelect("/orders")}>
          <ListItemText primary="Quản lý đơn hàng" />
        </ListItem>
        <Divider />
        <ListItem button onClick={() => handleSelect("/user")}>
              <ListItemText primary="Quản lý người dùng" />
            </ListItem>
        <Divider />
        <ListItem button onClick={toggleProductMenu}>
          <ListItemText primary="Sản phẩm" />
          {isProductMenuOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ListItem>
        <Collapse in={isProductMenuOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button sx={{ pl: 4 }} onClick={() => handleSelect("/genre")}>
              <ListItemText primary="Thể loại" />
            </ListItem>
            <ListItem button sx={{ pl: 4 }} onClick={() => handleSelect("/comic")}>
              <ListItemText primary="Truyện" />
            </ListItem>
          </List>
        </Collapse>

        <Divider />
      </List>
    </Drawer>
  );
};

// Layout component
const Layout = ({ children }) => {
  const [open, setOpen] = useState(false); // State to manage sidebar toggle

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
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
      <Sidebar open={open} toggleDrawer={toggleDrawer} />

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
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
