import React, { useState, useMemo } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  TextField,
  MenuItem,
  FormControl,
} from "@mui/material";
import { blue} from "@mui/material/colors";
import Navbar from "../Components/Layout/Navbar";
import Sidebar from "../Components/Layout/Sidebar";
import InfoBar from "../Components/Layout/InfoBar";
import KanbanColumn from "../Components/Board/KanbanColumn";
import AddUserStory from "./AddUserStory";
import { useApp } from "../Context";

type UserStoryStatus = "Backlog" | "In Progress" | "Testing" | "Completed";
const STATUSES: UserStoryStatus[] = [
  "Backlog",
  "In Progress",
  "Testing",
  "Completed",
];

const Board: React.FC = () => {
  const { projects } = useApp();
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    projects.length > 0 ? projects[0].id : ""
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const project = useMemo(
    () => projects.find((p) => p.id === selectedProjectId),
    [projects, selectedProjectId]
  );

  if (!project) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <Typography>No project selected</Typography>
      </Box>
    );
  }

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
              bgcolor: "white",
              px: 3,
              py: 2,
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <FormControl size="small" sx={{ minWidth: 220 }}>
              <TextField
                select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                label="Project"
              >
                {projects.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>

            <Button
              sx={{
                bgcolor: blue[100],
                color: blue[700],
                width: 150,
                height: 45,
                fontWeight: "bold",
                "&:hover": { bgcolor: blue[200] },
              }}
              onClick={() => setIsModalOpen(true)}
            >
              Add Story
            </Button>
            {isModalOpen && (
              <AddUserStory
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                projectId={project.id}
              />
            )}
          </Box>

          <Grid p={3} container spacing={2}>
            {STATUSES.map((status) => (
              <Grid key={status} sx={{ xs: 12, md: 3 }}>
                <KanbanColumn
                  projectId={project.id}
                  status={status}
                  stories={project.userStories.filter(
                    (s) => s.status === status
                  )}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default Board;