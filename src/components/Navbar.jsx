import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Box,
  Container,
  Drawer,
  List,
  ListItemButton,
  ListSubheader,
  Divider,
  IconButton,
  Tooltip,
  ListItemText,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useSelector, useDispatch } from "react-redux";
import { signOutUser } from "../services/authService";

import {
  Buildings,
  Tag,
  PaintBrush,
  Microphone,
  MusicNotes,
  Disc,
  ShoppingBag,
  FileText,
  PianoKeys,
  Upload,
  Wrench,
  SignOut,
  CaretLeft,
  CaretRight,
} from "phosphor-react";

const navData = {
  general: [
    { label: "Business Entities", route: "/business-entities", icon: <Buildings size={20} /> },
    { label: "Deals", route: "/deals", icon: <Tag size={20} /> },
  ],
  recordings: [
    { label: "Artists", route: "/artists", icon: <PaintBrush size={20} /> },
    { label: "Recordings", route: "/recordings/recordings", icon: <Microphone size={20} /> },
    { label: "Tracks", route: "/recordings/tracks", icon: <MusicNotes size={20} /> },
    { label: "Releases", route: "/recordings/releases", icon: <Disc size={20} /> },
    { label: "Products", route: "/recordings/products", icon: <ShoppingBag size={20} /> },
  ],
  publishing: [
    { label: "Writers", route: "/publishing/writers", icon: <FileText size={20} /> },
    { label: "Works", route: "/publishing/works", icon: <PianoKeys size={20} /> },
    { label: "Publishers", route: "/publishing/publishers", icon: <Upload size={20} /> },
  ],
  utilities: [{ label: "Utilities", route: "/utilities", icon: <Wrench size={20} /> }],
};

function Navbar() {
  const [drawerExpanded, setDrawerExpanded] = useState(true); // Manage drawer state
  const theme = useTheme();
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize the navigate function

  const handleSignOut = () => {
    signOutUser(dispatch);
    console.log("Sign out user Dispatch: ", dispatch);
    navigate("/signin"); // Redirect to the sign-in page after sign out
  };

  const renderSidePanel = () => (
    <Box
      sx={{
        width: drawerExpanded ? 250 : 70,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "black",
        color: "var(--white)",
        transition: "width 0.3s ease",
        overflowY: "auto", // Enable vertical scrolling
        overflowX: "hidden", // Prevent horizontal scrolling
        scrollbarWidth: "none", // Hide scrollbar for Firefox
        "&::-webkit-scrollbar": {
          display: "none", // Hide scrollbar for WebKit-based browsers
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", padding: 2 }}>
        <img
          src="/BFM.jpeg"
          alt="Logo"
          style={{
            width: drawerExpanded ? 40 : 30,
            height: drawerExpanded ? 40 : 30,
          }}
        />
        {drawerExpanded && (
          <Typography
            variant="h6"
            sx={{
              color: "white",
              marginLeft: 1,
              fontFamily: "var(--sans)",
              whiteSpace: "nowrap",
            }}
          >
            RMS
          </Typography>
        )}
      </Box>

      <IconButton
        sx={{
          color: "var(--white)",
          margin: "10px auto",
          transition: "transform 0.3s ease",
        }}
        onClick={() => setDrawerExpanded((prev) => !prev)}
      >
        {drawerExpanded ? <CaretLeft size={20} /> : <CaretRight size={20} />}
      </IconButton>

      {/* User Profile */}
      {user && (
        <Box
          sx={{
            textAlign: "center",
            marginBottom: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar
            src={user.photoURL}
            alt={user.displayName || "User"}
            sx={{
              width: drawerExpanded ? 60 : 40,
              height: drawerExpanded ? 60 : 40,
            }}
          />
          {drawerExpanded && (
            <Typography sx={{ color: "white", fontSize: 16, marginTop: 1 }}>
              {user.displayName || "User"}
            </Typography>
          )}
        </Box>
      )}

      {/* Navbar Links */}
      <List sx={{ flexGrow: 1, pt: 2 }}>
        {Object.entries(navData).map(([parentKey, items]) => (
          <React.Fragment key={parentKey}>
            <ListSubheader
              sx={{
                backgroundColor: "black",
                color: "var(--orange)",
                fontWeight: "bold",
                display: drawerExpanded ? "block" : "none",
              }}
            >
              {parentKey.charAt(0).toUpperCase() + parentKey.slice(1)}
            </ListSubheader>
            <Divider />
            {items.map((item) => (
              <ListItemButton
                component={Link}
                to={item.route}
                key={item.route}
                sx={{
                  color: "var(--white)",
                  justifyContent: drawerExpanded ? "initial" : "center",
                  pl: drawerExpanded ? 4 : 0,
                }}
              >
                {item.icon}
                {drawerExpanded && (
                  <ListItemText primary={item.label} sx={{ ml: 2 }} />
                )}
              </ListItemButton>
            ))}
          </React.Fragment>
        ))}
      </List>

      {/* Sign Out Button */}
      <ListItemButton
        onClick={handleSignOut}
        sx={{
          color: "var(--white)",
          justifyContent: drawerExpanded ? "initial" : "center",
          pl: drawerExpanded ? 4 : 0,
          mt: "auto",
        }}
      >
        <SignOut size={20} />
        {drawerExpanded && <ListItemText primary="Sign Out" sx={{ ml: 2 }} />}
      </ListItemButton>
    </Box>
  );

  return (
    <>
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerExpanded ? 250 : 70,
            boxSizing: "border-box",
            marginTop: 0, // Ensures it's below the navbar
            backgroundColor: "black",
            color: "var(--white)",
            transition: "width 0.3s ease",
            overflow: "hidden", // Prevent scrollbars
          },
        }}
      >
        {renderSidePanel()}
      </Drawer>

      <Box
        sx={{
          marginLeft: drawerExpanded ? 24 : 0, // Space adjusts for expanded/collapsed drawer
          marginTop: 0, // Space for the navbar
          padding: 0,
        }}
      >
        {/* Content Area */}
      </Box>
    </>
  );
}

export default Navbar;
