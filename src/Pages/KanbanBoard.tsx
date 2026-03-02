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
import {Avatar} from "@mui/material";
import type { UserStoryStatus } from "../Models";

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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const project = projects.find((p) => p.id === id);
  const open = Boolean(anchorEl);

  if (!project) {
    return <ErrorComponent title="Page Not Found" />;
  }

  const priorities = Array.from(
    new Set(project.userStories.map((s) => s.priority)),
  );

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
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
            }}
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

            <Box>
              <Button
        variant="outlined"
        size="small"
        onClick={handleOpen}
        sx={{ minWidth: 200 }}
      >
        View Team Members
      </Button>

      {/* Dropdown List */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: { width: 250 },
        }}
      >
        {project.teamMembers.map((member: any) => (
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
                  color:
                    member.role === "Manager"
                      ? "error.main"
                      : member.role === "Developer"
                      ? "primary.main"
                      : member.role === "Tester"
                      ? "warning.main"
                      : "text.primary",
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
                      (selectedPriority === "all"
                        ? true
                        : s.priority === selectedPriority),
                  )}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default KanbanBoard;
