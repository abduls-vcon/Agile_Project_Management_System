import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  FormControl,
  TextField,
  MenuItem,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useApp } from "../Context";
import KanbanColumn from "../Components/Board/KanbanColumn";
import Navbar from "../Components/Layout/Navbar";
import Sidebar from "../Components/Layout/Sidebar";
import InfoBar from "../Components/Layout/InfoBar";
import ErrorComponent from "../Components/Layout/ErrorComponent";
import { blue, grey } from "@mui/material/colors";
import AddUserStory from "./AddUserStory";

type UserStoryStatus = "Backlog" | "In Progress" | "Testing" | "Completed";

const STATUSES: UserStoryStatus[] = [
  "Backlog",
  "In Progress",
  "Testing",
  "Completed",
];

const KanbanBoard: React.FC = () => {
  const { id } = useParams();
  const { projects } = useApp();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedPriority, setSelectedPriority] = useState<"all" | string>(
    "all",
  );

  const project = projects.find((p) => p.id === id);

  if (!project) {
    return <ErrorComponent title="Page Not Found" />;
  }

  const priorities = Array.from(
    new Set(project.userStories.map((s) => s.priority)),
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
            sx={{ bgcolor: grey[50], width: "98%", height: 50, px: 2, py: 2 }}
          >
            <FormControl size="small" sx={{ minWidth: 200 }}>
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
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                bgcolor: "white",
                px: 2,
                py: 1,
              }}
            >
              <Typography
                sx={{ fontSize: 25, fontWeight: "bold", color: grey }}
              >
                {project.name} Board
              </Typography>
              <Button
                sx={{
                  bgcolor: blue[100],
                  color: blue[700],
                  width: 150,
                  height: 45,
                  border: 1,
                  fontWeight: "bold",
                  "&:hover": { bgcolor: blue[200] },
                }}
                onClick={() => setIsModalOpen(true)}
              >
                Add Story
              </Button>
            </Box>

            {isModalOpen && (
              <AddUserStory
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                projectId={project.id}
              />
            )}

            <Grid p={3} container spacing={2}>
              {STATUSES.map((status) => (
                <Grid sx={{ xs: 12, md: 3 }} key={status}>
                  <KanbanColumn
                    projectId={project.id}
                    status={status}
                    stories={project.userStories.filter(
                      (s) =>
                        s.status === status &&
                        (selectedPriority === "all"
                          ? true
                          : s.priority === selectedPriority),
                    )}
                    priority={selectedPriority}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default KanbanBoard;
