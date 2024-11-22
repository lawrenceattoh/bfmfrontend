import React, {useState} from "react";
import {Link} from "react-router-dom";
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
    InputBase,
    Divider,
    IconButton,
    Tooltip,
    ListItemText,
} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import {
    Search as SearchIcon,
    HelpOutline as HelpIcon,
    Menu as MenuIcon,
    Palette as PaletteIcon,
    Album,
    MusicNote,
    Piano,
    EditNote,
    Publish,
    Mic,
    Sell,
} from "@mui/icons-material";
import {useSelector, useDispatch} from "react-redux";
import {signOutUser} from "../services/authService";

const navData = {
    deals: [{label: "Deals", route: "/deals", icon: <Sell/>}],
    recordings: [
        {label: "Artists", route: "/recordings/artists", icon: <PaletteIcon/>},
        {label: "Recordings", route: "/recordings/recordings", icon: <Mic/>},
        {label: "Tracks", route: "/recordings/tracks", icon: <MusicNote/>},
        {label: "Releases", route: "/recordings/releases", icon: <Album/>},
        {label: "Products", route: "/recordings/products", icon: <Sell/>},
    ],
    publishing: [
        {label: "Writers", route: "/publishing/writers", icon: <EditNote/>},
        {label: "Works", route: "/publishing/works", icon: <Piano/>},
        {label: "Publishers", route: "/publishing/publishers", icon: <Publish/>},
    ],
    utilities: [{label: "Utilities", route: "/utils", icon: <Publish/>}],
};

function Navbar() {
    const [drawerExpanded, setDrawerExpanded] = useState(true); // Manage drawer state
    const theme = useTheme();
    const user = useSelector((state) => state.user.user);
    const dispatch = useDispatch();

    const handleSignOut = () => {
        signOutUser(dispatch);
    };

    const renderSidePanel = () => (
        <Box
            sx={{
                width: drawerExpanded ? 250 : 70,
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "black",
                color: "var(--white)",
                transition: "width 0.3s ease",
            }}
        >
            <IconButton
                sx={{
                    color: "var(--white)",
                    margin: "10px auto",
                    transform: drawerExpanded ? "rotate(0deg)" : "rotate(180deg)",
                    transition: "transform 0.3s ease",
                }}
                onClick={() => setDrawerExpanded((prev) => !prev)}
            >
                <MenuIcon/>
            </IconButton>
            <List sx={{flexGrow: 1, pt: 2}}>
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
                        <Divider/>
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
                                    <ListItemText primary={item.label} sx={{ml: 2}}/>
                                )}
                            </ListItemButton>
                        ))}
                    </React.Fragment>
                ))}
            </List>
        </Box>
    );

    return (
        <>
            <AppBar
                position="fixed"
                sx={{
                    backgroundColor: "var(--dark-grey)",
                    zIndex: theme.zIndex.drawer + 1,
                }}
            >
                <Container maxWidth="xl">
                    <Toolbar sx={{display: "flex", justifyContent: "space-between"}}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <img
                                src="/BFM.jpeg"
                                alt="Logo"
                                style={{
                                    width: 40,
                                    height: 40,
                                }}
                            />
                            <Typography
                                variant="h6"
                                component={Link}
                                to="/"
                                color="inherit"
                                sx={{textDecoration: "none", fontFamily: "var(--sans)"}}
                            >
                                RMS
                            </Typography>
                        </Box>

                        <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
                            {/* Search Bar */}
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                                    borderRadius: 1,
                                    px: 2,
                                    flexGrow: 1,
                                }}
                            >
                                <SearchIcon/>
                                <InputBase
                                    placeholder="Search..."
                                    inputProps={{"aria-label": "search"}}
                                    sx={{ml: 1, color: "inherit", flex: 1}}
                                />
                            </Box>

                            {/* User Avatar */}
                            {user ? (
                                <Avatar
                                    src={user.photoURL}
                                    alt={user.displayName || "User"}
                                    sx={{width: 32, height: 32, cursor: "pointer"}}
                                    onClick={handleSignOut}
                                />
                            ) : (
                                <Typography
                                    variant="body2"
                                    component={Link}
                                    to="/signin"
                                    sx={{textDecoration: "none", color: "white"}}
                                >
                                    Sign In
                                </Typography>
                            )}

                            {/* Help Icon */}
                            <Tooltip title="Get help">
                                <IconButton color="inherit">
                                    <HelpIcon/>
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            <Drawer

                variant="permanent"
                anchor="left"
                sx={{
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                        width: drawerExpanded ? 250 : 70,
                        boxSizing: "border-box",
                        marginTop: 8, // Ensures it's below the navbar
                        backgroundColor: 'black',
                        color: "var(--white)",
                        transition: "width 0.3s ease",
                    },
                }}
            >
                {renderSidePanel()}
            </Drawer>

            <Box
                sx={{
                    marginLeft: drawerExpanded ? 250 : 70, // Space adjusts for expanded/collapsed drawer
                    marginTop: 8, // Space for the navbar
                    padding: 3,
                }}
            >
                {/* Content Area */}
            </Box>
        </>
    );
}

export default Navbar;
