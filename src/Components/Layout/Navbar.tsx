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
      elevation={0}
      sx={{
        backgroundColor: "#665fc9",
        borderBottom: "1px solid #3730A3",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", px: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <ViewKanbanIcon sx={{ color: "#fefefe", fontSize: 32 }} />
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ color: "#fff", fontSize: 20, letterSpacing: "-0.3px" }}
          >
            Azure
            <Box
              component="span"
              sx={{ color: "#0a0e33", mx:0.5 }}
            >
              DevOps
            </Box>
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Tooltip title="Profile">
            <IconButton
              sx={{
                p: 1,
                bgcolor: "#312E81",
                border: "1px solid #4338CA",
                "&:hover": { bgcolor: "#3730A3" },
              }}
            >
              <AccountCircleIcon sx={{ color: "#A5B4FC", fontSize: 28 }} />
            </IconButton>
          </Tooltip>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{ color: "#E0E7FF", fontSize: 15 }}
          >
            Admin
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;