import React, { useCallback, useMemo, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import TableChartIcon from "@mui/icons-material/TableChart";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import { useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../../Context";
import Avatar from "../Layout/Avatar";
import UserProfile from "../Layout/UserProfile";

const ACCENT = "#665fc9";
const Navbar: React.FC = () => {
  const { currentUser, logout, admin } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openProfile, setOpenProfile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const id = admin?.id;

  const menuItems = useMemo(()=>[
    { label: "Overview", path: `/dashboard/${id}`, icon: <DashboardIcon /> },
    { label: "Analytics", path: `/analytics/${id}`, icon: <DashboardIcon /> },
    { label: "Projects", path: `/projects/${id}`, icon: <NoteAltIcon /> },
    { label: "Boards", path: `/boards/${id}`, icon: <TableChartIcon /> },
    { label: "Users", path: `/users/${id}`, icon: <Diversity3Icon /> },
  ],[id]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleLogout = useCallback(() => {
    handleMenuClose();
    logout();
    navigate("/login");
  }, [logout, navigate]);


  const handleDrawerToggle = useCallback(() => {
    setMobileOpen(prev => !prev);
  }, []);

  return (
    <AppBar
      position="static"
      elevation={1}
      sx={{ bgcolor: ACCENT, borderBottom: "1px solid #E2E8F0" }}
    >
      <Toolbar>
        {currentUser && (
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <ViewKanbanIcon sx={{ color: "#fefefe", fontSize: 34, mr: 1 }} />
        <Typography
          sx={{
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 900,
            fontSize: "1.1rem",
            color: "#fff",
          }}
        >
          Azure<Box component="span" sx={{ color: "#0a0e33", mx: 0.4 }}>DevOps</Box>
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        {currentUser && (
          <Box>
            <Tooltip title="Account settings">
              <IconButton onClick={handleMenuOpen} sx={{ p: 0, display:"flex", alignItems:"center", gap:2 }}>
                <Avatar user={currentUser} size={40} />
                <Box>
                <Typography sx={{color:"white", fontSize:15, fontWeight:700}}>{currentUser?.name}</Typography>
                  <Typography sx={{color:"white", fontSize:12, letterSpacing:0.7}}>{currentUser?.role}</Typography>
                </Box>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              anchorEl={anchorEl}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={() => { handleMenuClose(); setOpenProfile(true); }}>
                <Typography textAlign="center">Profile</Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Typography textAlign="center">Logout</Typography>
              </MenuItem>
            </Menu>
            <UserProfile open={openProfile} onClose={() => setOpenProfile(false)} />
          </Box>
        )}
      </Toolbar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 250 },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            {menuItems.map((item) => (
              <ListItemButton
                key={item.label}
                selected={location.pathname === item.path}
                onClick={() => { navigate(item.path); setMobileOpen(false); }}
              >
                <ListItemIcon sx={{ color: location.pathname === item.path ? ACCENT : "inherit" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} sx={{ color: location.pathname === item.path ? ACCENT : "inherit" }} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>

    </AppBar>
  );
};

export default Navbar;