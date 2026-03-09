import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
  Tooltip,
} from "@mui/material";

import NoteAltIcon from "@mui/icons-material/NoteAlt";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

type DropdownMenu = "projects" | "boards" | "users" | null;

interface SubItem {
  label: string;
  path: string;
}

interface MenuItem {
  key: DropdownMenu;
  label: string;
  icon: React.ReactNode;
  activeColor: string;
  activeBg: string;
  subItems: SubItem[];
}

const menuItems: MenuItem[] = [
  {
    key: "projects",
    label: "Projects",
    icon: <NoteAltIcon sx={{ fontSize: 24 }} />,
    activeColor: "#4F46E5",
    activeBg: "#EEF2FF",
    subItems: [{ label: "View Projects", path: "/projects" }],
  },
  {
    key: "boards",
    label: "Boards",
    icon: <DashboardIcon sx={{ fontSize: 24 }} />,
    activeColor: "#059669",
    activeBg: "#D1FAE5",
    subItems: [{ label: "View Boards", path: "/boards" }],
  },
  {
    key: "users",
    label: "Users",
    icon: <Diversity3Icon sx={{ fontSize: 24 }} />,
    activeColor: "#D97706",
    activeBg: "#FEF3C7",
    subItems: [{ label: "View Users", path: "/users" }],
  },
];

const Sidebar: React.FC = () => {
  const [openDropdown, setOpenDropdown] = useState<DropdownMenu>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleDropdown = (menu: DropdownMenu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  return (
    <Box
      sx={{
        width: 260,
        height: "100vh",
        bgcolor: "#F8FAFC",
        borderRight: "1px solid #E2E8F0",
        pt: 2,
        overflowY: "auto",
        "&::-webkit-scrollbar": { width: 6 },
        "&::-webkit-scrollbar-thumb": { backgroundColor: "#CBD5E1", borderRadius: 3 },
      }}
    >
      <List>
        {menuItems.map((item) => {
          const isOpen = openDropdown === item.key;

          return (
            <Box key={item.key}>
              <Tooltip title={item.label} placement="right">
                <ListItemButton
                  onClick={() => toggleDropdown(item.key)}
                  sx={{
                    px: 2.5,
                    mx: 1,
                    borderRadius: "10px",
                    mb: 0.5,
                    bgcolor: isOpen ? item.activeBg : "transparent",
                    "&:hover": { bgcolor: isOpen ? item.activeBg : "#F1F5F9" },
                    transition: "background 0.2s",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 38,
                      color: isOpen ? item.activeColor : "#475569",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: 600,
                      fontSize: 14,
                      color: isOpen ? item.activeColor : "#1E293B",
                    }}
                  />
                  {isOpen
                    ? <ExpandLess sx={{ color: "#94A3B8", fontSize: 18 }} />
                    : <ExpandMore sx={{ color: "#94A3B8", fontSize: 18 }} />}
                </ListItemButton>
              </Tooltip>

              <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.subItems.map((subItem) => {
                    const isActive = location.pathname === subItem.path;

                    return (
                      <ListItemButton
                        key={subItem.label}
                        onClick={() => navigate(subItem.path)}
                        sx={{
                          pl: 6,
                          borderRadius: "10px",
                          mx: 1,
                          my: 0.5,
                          transition: "0.2s",
                          bgcolor: isActive ? item.activeBg : "transparent",
                          "&:hover": { bgcolor: isActive ? item.activeBg : "#F1F5F9" },
                        }}
                      >
                        <ListItemText
                          primary={subItem.label}
                          primaryTypographyProps={{
                            fontSize: 13,
                            fontWeight: isActive ? 700 : 500,
                            color: isActive ? item.activeColor : "#64748B",
                          }}
                        />
                      </ListItemButton>
                    );
                  })}
                </List>
              </Collapse>

              <Divider sx={{ my: 1, borderColor: "#E2E8F0" }} />
            </Box>
          );
        })}
      </List>
    </Box>
  );
};

export default Sidebar;