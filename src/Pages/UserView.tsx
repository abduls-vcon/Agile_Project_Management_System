import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  FormControl,
  MenuItem,
  TextField,
  Button,
  Fade,
} from "@mui/material";
import { blue, grey } from "@mui/material/colors";
import { BounceLoader } from "react-spinners";

import Navbar from "../Components/Layout/Navbar";
import Sidebar from "../Components/Layout/Sidebar";
import InfoBar from "../Components/Layout/InfoBar";
import AddUser from "./AddUser";
import UserItems from "../Components/User/UserItems";
import ErrorComponent from "../Components/Layout/ErrorComponent";
import { useApp } from "../Context";

const UserView: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [selectedRole, setSelectedRole] = useState<"all" | string>("all");
  const [loading, setLoading] = useState(true);

  const { users, currentUser } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!users) {
    return <ErrorComponent title="Something went wrong" />;
  }

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const roleMatch =
        selectedRole === "all" ? true : user.role === selectedRole;
      const nameMatch = user.name
        .toLowerCase()
        .includes(searchName.toLowerCase());
      return roleMatch && nameMatch;
    });
  }, [users, selectedRole, searchName]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Navbar />
      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar />

        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            bgcolor: "#dee4ff",
            position: "relative",
          }}
        >
          <InfoBar />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              px: 3,
              py: 2,
              gap: 2,
              bgcolor: grey[50],
              boxShadow: 2,
            }}
          >
            <Typography
              sx={{
                fontSize: 26,
                fontWeight: 600,
                color: blue[900],
                letterSpacing: "-0.3px",
              }}
            >
              User List
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                alignItems: "center",
                mt: { xs: 2, md: 0 },
              }}
            >
              <TextField
                label="Search by Name"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                size="small"
                sx={{
                  minWidth: 200,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    bgcolor: "#fff",
                    "&.Mui-focused fieldset": { borderColor: "#6366F1" },
                    "& fieldset": { borderColor: "#E2E8F0" },
                  },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#6366F1" },
                }}
              />

              <FormControl size="small" sx={{ minWidth: 180 }}>
                <TextField
                  select
                  value={selectedRole}
                  onChange={(e) =>
                    setSelectedRole(e.target.value as "all" | string)
                  }
                  label="Filter by Role"
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      bgcolor: "#fff",
                      "&.Mui-focused fieldset": { borderColor: "#6366F1" },
                      "& fieldset": { borderColor: "#E2E8F0" },
                    },
                    "& .MuiInputLabel-root.Mui-focused": { color: "#6366F1" },
                  }}
                >
                  <MenuItem value="all">All Roles</MenuItem>
                  <MenuItem value="Developer">Developer</MenuItem>
                  <MenuItem value="Tester">Tester</MenuItem>
                  <MenuItem value="Manager">Manager</MenuItem>
                </TextField>
              </FormControl>

              {currentUser?.role === "Admin" && <Button
                sx={{
                  bgcolor: "#EEF2FF",
                  color: "#4F46E5",
                  width: 140,
                  height: 40,
                  fontWeight: 700,
                  fontSize: 13,
                  borderRadius: "10px",
                  textTransform: "none",
                  border: "1px solid #C7D2FE",
                  "&:hover": { bgcolor: "#C7D2FE" },
                }}
                onClick={() => setOpenDialog(true)}
              >
                Add User
              </Button>}

              <AddUser open={openDialog} onClose={() => setOpenDialog(false)} />
            </Box>
          </Box>

          {loading ? (
            <Fade in={loading}>
              <Box
                sx={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100vw",
                  height: "100vh",
                  bgcolor: "rgba(248,250,252,0.8)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 9999,
                }}
              >
                <BounceLoader color="#6366F1" size={80} />
              </Box>
            </Fade>
          ) : (
            <Box sx={{ px: 3, py: 2 }}>
              <UserItems users={filteredUsers} />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default UserView;