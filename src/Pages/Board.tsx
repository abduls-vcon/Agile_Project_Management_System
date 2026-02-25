import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  FormControl,
} from "@mui/material";
import { blue } from "@mui/material/colors";
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
  const [selectedPriority, setSelectedPriority] = useState<"all" | string>("all");
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

  const priorities = Array.from(
    new Set(project.userStories.map((s) => s.priority))
  );

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
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
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

              <FormControl size="small" sx={{ minWidth: 180 }}>
                <TextField
                  select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  label="Priority"
                >
                  <MenuItem value="all">All Priorities</MenuItem>
                  {priorities.map((priority) => (
                    <MenuItem key={priority} value={priority}>
                      {priority}
                    </MenuItem>
                  ))}
                </TextField>
              </FormControl>
            </Box>

            {/* Add Story Button */}
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
          <Box
            sx={{
              display: "flex",
              gap: 2,
              px: 3,
              py: 2,
              overflowX: "auto",
            }}
          >
            {STATUSES.map((status) => (
              <KanbanColumn
                key={status}
                projectId={project.id}
                status={status}
                priority={selectedPriority}
                stories={project.userStories.filter(
                  (s) =>
                    s.status === status &&
                    (selectedPriority === "all" ? true : s.priority === selectedPriority)
                )}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Board;