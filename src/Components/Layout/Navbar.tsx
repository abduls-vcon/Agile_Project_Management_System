import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton
} from "@mui/material";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const Navbar: React.FC = () => {
  return (
    <AppBar
      position="static"
      elevation={4}
      sx={{
        backgroundColor: "#f3f4f6",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <ViewKanbanIcon sx={{ color: "#1d4ed8", fontSize: 30 }} />
          <Typography variant="h6" fontWeight="bold" sx={{color: "black"}}>
            Azure
            <Box component="span" sx={{ color: "#1d4ed8" }}>
              DevOps
            </Box>
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton>
            <AccountCircleIcon sx={{ color: "#1d4ed8", fontSize: 30 }} />
          </IconButton>
          <Typography variant="subtitle1" fontWeight="bold" sx={{color:"black"}}>
            Admin
          </Typography>
        </Box>

      </Toolbar>
    </AppBar>
  );
};

export default Navbar;