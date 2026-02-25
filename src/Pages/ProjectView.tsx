import React, { useState,useEffect, useMemo } from "react";
import Navbar from "../Components/Layout/Navbar";
import Sidebar from "../Components/Layout/Sidebar";
import InfoBar from "../Components/Layout/InfoBar";
import ProjectCard from "../Components/Projects/ProjectCard";
import AddProject from "./AddProject";
import { useApp } from "../Context";
import type { Project } from "../Models";

import {
  Button,
  InputLabel,
  Select,
  MenuItem,
  Box,
  FormControl,
  TextField,
  Grid,
  CircularProgress,
} from "@mui/material";

import { blue, grey } from "@mui/material/colors";

const ProjectView: React.FC = () => {
  const { users, projects } = useApp();

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("All");
  const [selectedUser, setSelectedUser] = useState<number | "all">("all");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const[loading,setLoading] = useState(true);

  useEffect(()=>{
     const timer = setTimeout(()=> setLoading(false),3000);
     return ()=> clearTimeout(timer);
   })

  const handleStatusChange = (event: any) => {
    setStatus(event.target.value);
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((project: Project) => {
      const statusMatch = status === "All" || project.status === status;
      const userMatch =
        selectedUser === "all" || project.ownerId === selectedUser;
      const dateMatch =
        !selectedDate || project.createdDate.startsWith(selectedDate); // match YYYY-MM-DD
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
            bgcolor: blue[50],
          }}
        >
          <InfoBar />

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              px: 3,
              py: 2,
              bgcolor: grey[50],
              justifyContent:"space-between",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                alignItems: "center",
              }}
            >
              <FormControl sx={{ minWidth: 180, height: 45 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={status}
                  label="Status"
                  onChange={handleStatusChange}
                  sx={{ height: 45 }}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Complete">Complete</MenuItem>
                  <MenuItem value="On Hold">On Hold</MenuItem>
                </Select>
              </FormControl>

              <TextField
                select
                label="Filter by Owner"
                value={selectedUser}
                onChange={(e) =>
                  setSelectedUser(
                    e.target.value === "all" ? "all" : Number(e.target.value),
                  )
                }
                size="small"
                sx={{ minWidth: 180, height: 45 }}
                InputProps={{ sx: { height: 45 } }}
                InputLabelProps={{ sx: { top: -6 } }}
              >
                <MenuItem value="all">All Users</MenuItem>
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Filter by Creation Date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                size="small"
                sx={{ minWidth: 180, height: 45 }}
                InputLabelProps={{ shrink: true, sx: { top: -6 } }}
                InputProps={{ sx: { height: 45 } }}
              />
            </Box>

            <Button
              sx={{
                bgcolor: blue[100],
                color: blue[700],
                width: 150,
                height: 45,
                fontWeight: "bold",
                "&:hover": { bgcolor: blue[200] },
              }}
              onClick={() => setOpenDialog(true)}
            >
              Add Project
            </Button>

            <AddProject
              open={openDialog}
              onClose={() => setOpenDialog(false)}
            />
          </Box>

          <Box sx={{ mt:20,p: 5, flex:1, display:"flex",justifyContent:"center", alignItems:"center"}}>
           {loading ? (
              <CircularProgress
                size={60}
                thickness={5}
                sx={{ color: blue[700], textAlign:'center' }}
              />
            ) : (
              <Grid container spacing={4} justifyContent="center" sx={{marginTop:-20}}>
              {filteredProjects.map((project) => (
                <Grid
                  key={project.id}
                  sx={{
                    xs: 12,
                    sm: 6,
                    md: 4,
                    lg: 3,
                  }}
                >
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
