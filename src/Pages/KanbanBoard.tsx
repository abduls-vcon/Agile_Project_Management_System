import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  FormControl,
  TextField,
  MenuItem,
  Stack,
  Menu,
  Avatar,
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
import type { User, UserStoryStatus, Priority } from "../Models";

const STATUSES: UserStoryStatus[] = [
  "Backlog",
  "In Progress",
  "Testing",
  "Completed",
];

const ROLE_COLORS: Record<string, string> = {
  Manager: "error.main",
  Developer: "primary.main",
  Tester: "warning.main",
};

const KanbanBoard: React.FC = () => {
  const { id } = useParams();
  const { projects } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState<"all" | Priority>("all");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const project = projects.find((p) => String(p.id) === id);

  if (!project) {
    return <ErrorComponent title="Page Not Found" />;
  }

  const priorities = Array.from(
    new Set(project.userStories.map((s) => s.priority)),
  );

  const filteredStories = (status: UserStoryStatus) =>
    project.userStories.filter(
      (s) =>
        s.status === status &&
        (selectedPriority === "all" || s.priority === selectedPriority),
    );

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

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
              bgcolor: grey[50],
              width: "98%",
              height: 50,
              px: 2,
              py: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <TextField
                select
                value={selectedPriority}
                onChange={(e) =>
                  setSelectedPriority(e.target.value as "all" | Priority)
                }
                label="Priority"
                size="small"
              >
                <MenuItem value="all">All Priorities</MenuItem>
                {priorities.map((priority) => (
                  <MenuItem key={priority} value={priority}>
                    {priority}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>

            <Box>
              <Button
                variant="outlined"
                size="small"
                onClick={handleMenuOpen}
                sx={{ minWidth: 200 }}
              >
                View Team Members
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{ sx: { width: 250 } }}
              >
                {project.teamMembers.map((member: User) => (
                  <MenuItem key={member.id} disableRipple>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Avatar
                        sx={{
                          width: 30,
                          height: 30,
                          fontSize: 15,
                          fontWeight: "bold",
                          bgcolor: member.avatarColor,
                        }}
                      >
                        {member.name[0]}
                      </Avatar>
                      <Typography>{member.name}</Typography>
                      <Typography
                        sx={{
                          color: ROLE_COLORS[member.role] ?? "text.primary",
                          fontWeight: 600,
                          ml: 1,
                        }}
                      >
                        ({member.role})
                      </Typography>
                    </Stack>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Box>

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
            <Typography sx={{ fontSize: 25, fontWeight: "bold", color: grey[800] }}>
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

          <Box sx={{ display: "flex", gap: 2, px: 3, py: 2, overflowX: "auto" }}>
            {STATUSES.map((status) => (
              <KanbanColumn
                key={status}
                projectId={project.id}
                status={status}
                stories={filteredStories(status)}
                priority={selectedPriority}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default KanbanBoard;