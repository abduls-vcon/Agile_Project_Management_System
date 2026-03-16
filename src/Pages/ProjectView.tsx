import React, { useState, useEffect, useMemo } from "react";
import Navbar from "../Components/Layout/Navbar";
import Sidebar from "../Components/Layout/Sidebar";
import InfoBar from "../Components/Layout/InfoBar";
import ProjectCard from "../Components/Projects/ProjectCard";
import AddProject from "./AddProject";
import { useApp } from "../Context";
import ErrorComponent from "../Components/Layout/ErrorComponent";
import type { Project } from "../Models";

import {
  Button,
  MenuItem,
  Box,
  FormControl,
  TextField,
  Grid,
  Typography,
} from "@mui/material";
import { BounceLoader } from "react-spinners";
import TuneIcon from "@mui/icons-material/Tune";
import Avatar from "../Components/Layout/Avatar";
import { grey } from "@mui/material/colors";

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    bgcolor: "#fff",
    "&.Mui-focused fieldset": { borderColor: "#6366F1" },
    "& fieldset": { borderColor: "#E2E8F0" },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: "#6366F1" },
};

const ProjectView: React.FC = () => {
  const { users, projects, currentUser } = useApp();

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("All");
  const [selectedUser, setSelectedUser] = useState<number | "all">("all");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, [projects, users]);

  if (!projects || !users) {
    return <ErrorComponent title="Something went wrong !" />;
  }

  const filteredProjects = useMemo(() => {
    return projects.filter((project: Project) => {
      const statusMatch = status === "All" || project.status === status;
      const userMatch =
        selectedUser === "all" || project.ownerId === selectedUser;
      const dateMatch =
        !selectedDate || project.createdDate?.startsWith(selectedDate);

      return statusMatch && userMatch && dateMatch;
    });
  }, [projects, status, selectedUser, selectedDate]);

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
          }}
        >
          <InfoBar />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              bgcolor: "#fff",
              borderTop: "1px solid #E2E8F0",
              borderBottom: "1px solid #E2E8F0",
              px: 3,
              py: 1,
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                alignItems: "center",
                width: "100%",
              }}
            >
              <TuneIcon sx={{ color: "#6366F1", fontSize: 20 }} />
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <TextField
                  select
                  value={status}
                  label="Status"
                  onChange={(e) => setStatus(e.target.value)}
                  sx={inputSx}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Complete">Complete</MenuItem>
                  <MenuItem value="On Hold">On Hold</MenuItem>
                </TextField>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 180 }}>
                <TextField
                  select
                  label="Owner"
                  value={selectedUser}
                  onChange={(e) =>
                    setSelectedUser(
                      e.target.value === "all" ? "all" : Number(e.target.value),
                    )
                  }
                  sx={inputSx}

                >
                  <MenuItem value="all" sx={{color:grey[700]}}>All Owners</MenuItem>

                  {users
                    .filter((user) => user.role === "Manager")
                    .map((user) => (
                      <MenuItem key={user.id} value={user.id}>
                        <Typography sx={{ flexGrow: 1 }}>{user.name}</Typography>
                        <Avatar user={user} size={25} />
                      </MenuItem>
                  ))}
                </TextField>
              </FormControl>

              <TextField
                label="Creation Date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                size="small"
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 180, ...inputSx }}
              />
            </Box>

            {currentUser?.role === "Admin" && <Button
              onClick={() => setOpenDialog(true)}
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
            >
              Add Project
            </Button>}

            <AddProject
              open={openDialog}
              onClose={() => setOpenDialog(false)}
            />
          </Box>
          <Box
            sx={{
              px: 3,
              py: 2,
            }}
          >
            {loading ? (
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
            ) : (
              <Grid container spacing={3}>
                {filteredProjects.map((project) => (
                  <Grid key={project.id}>
                    <ProjectCard project={project} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProjectView;
