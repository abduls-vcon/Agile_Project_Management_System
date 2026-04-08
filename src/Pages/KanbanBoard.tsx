import React, { useState, useEffect } from "react";
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
  Chip,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useApp } from "../Context";
import KanbanColumn from "../Components/Board/KanbanColumn";
import Navbar from "../Components/Layout/Navbar";
import Sidebar from "../Components/Layout/Sidebar";
import InfoBar from "../Components/Layout/InfoBar";
import ErrorComponent from "../Components/Layout/ErrorComponent";
import AddUserStory from "./AddUserStory";
import type { User, UserStoryStatus, Priority } from "../Models";
import AddIcon from "@mui/icons-material/Add";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import TuneIcon from "@mui/icons-material/Tune";
import { BounceLoader } from "react-spinners";

const STATUSES: UserStoryStatus[] = ["Backlog", "In Progress", "Testing", "Completed"];

const ROLE_COLORS: Record<string, { color: string; bg: string }> = {
  Manager:   { color: "#991B1B", bg: "#FEE2E2" },
  Developer: { color: "#1D4ED8", bg: "#DBEAFE" },
  Tester:    { color: "#92400E", bg: "#FEF3C7" },
};

const KanbanBoard: React.FC = () => {
  const { id } = useParams();
  const { projects, updateProjectStatus, currentUser } = useApp();

  const [isModalOpen, setIsModalOpen]       = useState(false);
  const [selectedPriority, setSelectedPriority] = useState<"all" | Priority>("all");
  const [anchorEl, setAnchorEl]             = useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const project = projects.find((p) => String(p.id) === id);

  useEffect(() => {
    if (
      project &&
      project.status !== "Complete" &&
      project.userStories.length > 0
    ) {
      const allStoriesCompleted = project.userStories.every(
        (story) => story.status === "Completed"
      );

      if (allStoriesCompleted && updateProjectStatus) {
        updateProjectStatus(project.id, "Complete");
      }
    }
  }, [project, updateProjectStatus]);

  if (!project) return <ErrorComponent title="Page Not Found" />;

  const priorities = Array.from(new Set(project.userStories.map((s) => s.priority)));

  const filteredStories = (status: UserStoryStatus) =>
    project.userStories.filter(
      (s) => s.status === status && (selectedPriority === "all" || s.priority === selectedPriority),
    );

  const handleMenuOpen  = (e: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

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
              width: "98%",
              px: 2,
              py: 1.5,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              bgcolor: "#fff",
              borderBottom: "1px solid #E2E8F0",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TuneIcon sx={{ color: "#6366F1", fontSize: 20 }} />
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <TextField
                  select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value as "all" | Priority)}
                  label="Priority"
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      "&.Mui-focused fieldset": { borderColor: "#6366F1" },
                    },
                    "& .MuiInputLabel-root.Mui-focused": { color: "#6366F1" },
                  }}
                >
                  <MenuItem value="all">All Priorities</MenuItem>
                  {priorities.map((priority) => (
                    <MenuItem key={priority} value={priority}>{priority}</MenuItem>
                  ))}
                </TextField>
              </FormControl>
            </Box>

            <Box>
              <Button
                variant="outlined"
                size="small"
                startIcon={<PeopleAltIcon />}
                onClick={handleMenuOpen}
                sx={{
                  minWidth: 180,
                  borderRadius: "10px",
                  borderColor: "#C7D2FE",
                  color: "#4F46E5",
                  fontWeight: 600,
                  textTransform: "none",
                  fontSize: 13,
                  "&:hover": { bgcolor: "#EEF2FF", borderColor: "#818CF8" },
                }}
              >
                View Team Members
              </Button>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    width: 250,
                    borderRadius: "12px",
                    border: "1px solid #E2E8F0",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                    mt: 0.5,
                  },
                }}
              >
                {project.teamMembers.map((member: User) => {
                  const roleCfg = ROLE_COLORS[member.role] ?? { color: "#475569", bg: "#F1F5F9" };
                  return (
                    <MenuItem key={member.id} disableRipple sx={{ py: 1 }}>
                      <Stack direction="row" spacing={1.2} alignItems="center">
                        <Avatar
                          sx={{
                            width: 30,
                            height: 30,
                            fontSize: 14,
                            fontWeight: 700,
                            bgcolor: member.avatarColor,
                          }}
                        >
                          {member.name[0]}
                        </Avatar>
                        <Typography sx={{ fontSize: 13, fontWeight: 500, color: "#1E293B" }}>
                          {member.name}
                        </Typography>
                        <Chip
                          label={member.role}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: 10,
                            fontWeight: 700,
                            bgcolor: roleCfg.bg,
                            color: roleCfg.color,
                            border: "none",
                            "& .MuiChip-label": { px: 1 },
                          }}
                        />
                      </Stack>
                    </MenuItem>
                  );
                })}
              </Menu>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              bgcolor: "#fff",
              borderBottom: "1px solid #E2E8F0",
              px: 3,
              py: 1.2,
            }}
          >
            <Typography
              sx={{
                fontSize: 22,
                fontWeight: 700,
                color: "#1E293B",
                letterSpacing: "-0.3px",
              }}
            >
              {project.name} Board
            </Typography>

            {["Manager", "Tester"].includes(currentUser?.role || "") && <Button
              startIcon={<AddIcon />}
              onClick={() => setIsModalOpen(true)}
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
              Add Story
            </Button>}
          </Box>

          {isModalOpen && (
            <AddUserStory
              open={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              projectId={project.id}
            />
          )}

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
            <Box
              sx={{
                display: "flex",
                gap: 2,
                px: 3,
                py: 2,
                overflowX: "auto",
                "@media (max-width: 800px)": {
                  flexDirection: "column",
                },
              }}
            >
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
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default KanbanBoard;