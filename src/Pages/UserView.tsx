import { useState, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  FormControl,
  MenuItem,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import Navbar from "../Components/Layout/Navbar";
import Sidebar from "../Components/Layout/Sidebar";
import InfoBar from "../Components/Layout/InfoBar";
import { blue, grey } from "@mui/material/colors";
import AddUser from "./AddUser";
import UserItems from "../Components/User/UserItems";
import { useApp } from "../Context";

const UserView: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [selectedRole, setSelectedRole] = useState<"all" | string>("all");
  const [loading, setLoading] = useState(true);

  const { users } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const roleMatch = selectedRole === "all" ? true : user.role === selectedRole;
      const nameMatch = user.name.toLowerCase().includes(searchName.toLowerCase());
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
            bgcolor: blue[50],
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
            <Typography sx={{ fontSize: 26, fontWeight: 600 }}>User List</Typography>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <TextField
                label="Search by Name"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                size="small"
                sx={{ minWidth: 200 }}
              />

              <FormControl size="small" sx={{ minWidth: 180 }}>
                <TextField
                  select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as "all" | string)}
                  label="Filter by Role"
                  size="small"
                >
                  <MenuItem value="all">All Roles</MenuItem>
                  <MenuItem value="Developer">Developer</MenuItem>
                  <MenuItem value="Tester">Tester</MenuItem>
                  <MenuItem value="Manager">Manager</MenuItem>
                </TextField>
              </FormControl>

              <Button
                sx={{
                  bgcolor: blue[700],
                  color: "#fff",
                  width: 140,
                  height: 40,
                  fontWeight: 600,
                  "&:hover": { bgcolor: blue[800] },
                }}
                onClick={() => setOpenDialog(true)}
              >
                Add User
              </Button>
              <AddUser open={openDialog} onClose={() => setOpenDialog(false)} />
            </Box>
          </Box>

          <Box
            sx={{
              p: 3,
              minHeight: 400,
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            {loading ? (
              <CircularProgress size={80} thickness={5} sx={{ color: blue[700], mt:30 }} />
            ) : (
              <UserItems users={filteredUsers} />
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UserView;