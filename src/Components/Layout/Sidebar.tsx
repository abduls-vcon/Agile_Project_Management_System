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
  Tooltip
} from "@mui/material";

import NoteAltIcon from "@mui/icons-material/NoteAlt";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import { blue, lightGreen, yellow, grey } from "@mui/material/colors";

type DropdownMenu = "projects" | "boards" | "users" | null;

interface SubItem {
  label: string;
  path: string;
}

interface MenuItem {
  key: DropdownMenu;
  label: string;
  icon: React.ReactNode;
  hoverColor: string;
  subItems: SubItem[];
}

const menuItems: MenuItem[] = [
  {
    key: "projects",
    label: "Projects",
    icon: <NoteAltIcon sx={{ fontSize: 28, color: blue[700] }} />,
    hoverColor: blue[100],
    subItems: [{ label: "View Projects", path: "/projects" }],
  },
  {
    key: "boards",
    label: "Boards",
    icon: <DashboardIcon sx={{ fontSize: 28, color: lightGreen[500] }} />,
    hoverColor: lightGreen[100],
    subItems: [{ label: "View Boards", path: "/boards" }],
  },
  {
    key: "users",
    label: "Users",
    icon: <Diversity3Icon sx={{ fontSize: 28, color: yellow[900] }} />,
    hoverColor: yellow[200],
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
        bgcolor: grey[50],
        borderRight: `1px solid ${grey[300]}`,
        pt: 2,
        overflowY: "auto",
        "&::-webkit-scrollbar": { width: 6 },
        "&::-webkit-scrollbar-thumb": { backgroundColor: grey[400], borderRadius: 3 },
      }}
    >
      <List>
        {menuItems.map((item) => (
          <Box key={item.key}>
            <Tooltip title={item.label} placement="right">
              <ListItemButton
                onClick={() => toggleDropdown(item.key)}
                sx={{
                  px: 3,
                  "&:hover": { bgcolor: grey[200] },
                  borderRadius: 2,
                  mb: 0.5,
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontWeight: 600 }}
                />
                {openDropdown === item.key ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </Tooltip>

            <Collapse in={openDropdown === item.key} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {item.subItems.map((subItem) => {
                  const isActive = location.pathname === subItem.path;

                  return (
                    <ListItemButton
                      key={subItem.label}
                      sx={{
                        pl: 6,
                        borderRadius: 3,
                        mx: 1,
                        my: 0.5,
                        transition: "0.3s",
                        bgcolor: isActive ? item.hoverColor : "transparent",
                        "&:hover": { bgcolor: item.hoverColor },
                      }}
                      onClick={() => navigate(subItem.path)}
                    >
                      <ListItemText
                        primary={subItem.label}
                        primaryTypographyProps={{
                          fontSize: 14,
                          fontWeight: 500,
                        }}
                      />
                    </ListItemButton>
                  );
                })}
              </List>
            </Collapse>

            <Divider sx={{ my: 1 }} />
          </Box>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;