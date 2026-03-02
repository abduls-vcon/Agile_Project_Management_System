import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const Navbar: React.FC = () => {
  return (
    <AppBar
      position="sticky"
      elevation={6}
      sx={{
        backgroundColor: "#f3f4f6",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", px: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <ViewKanbanIcon sx={{ color: "#1d4ed8", fontSize: 32 }} />
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ color: "black", fontSize: 20 }}
          >
            Azure
            <Box
              component="span"
              sx={{
                background: "linear-gradient(90deg, #1d4ed8 0%, #3b82f6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              DevOps
            </Box>
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Tooltip title="Profile">
            <IconButton sx={{ p: 1, "&:hover": { bgcolor: "#e0e7ff" } }}>
              <AccountCircleIcon sx={{ color: "#1d4ed8", fontSize: 32 }} />
            </IconButton>
          </Tooltip>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{ color: "black", fontSize: 16 }}
          >
            Admin
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;