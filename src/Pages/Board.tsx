import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  FormControl,
} from "@mui/material";
import Navbar from "../Components/Layout/Navbar";
import Sidebar from "../Components/Layout/Sidebar";
import InfoBar from "../Components/Layout/InfoBar";
import KanbanColumn from "../Components/Board/KanbanColumn";
import AddUserStory from "./AddUserStory";
import { useApp } from "../Context";
import type { UserStoryStatus } from "../Models";
import ErrorComponent from "../Components/Layout/ErrorComponent";
import AddIcon from "@mui/icons-material/Add";
import TuneIcon from "@mui/icons-material/Tune";
import { BounceLoader } from "react-spinners";

const STATUSES: UserStoryStatus[] = ["Backlog", "In Progress", "Testing", "Completed"];

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    bgcolor: "#fff",
    "&.Mui-focused fieldset": { borderColor: "#6366F1" },
    "& fieldset": { borderColor: "#E2E8F0" },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: "#6366F1" },
};

const Board: React.FC = () => {
  const { projects } = useApp();
  const [selectedProjectId, setSelectedProjectId] = useState<number>(
    projects.length > 0 ? projects[0].id : 0
  );
  const [selectedPriority, setSelectedPriority] = useState<"all" | string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const project = useMemo(
    () => projects.find((p) => p.id === selectedProjectId),
    [projects, selectedProjectId]
  );

  if (!project) {
    return <ErrorComponent title="Something went wrong !" />;
  }

  const priorities = Array.from(new Set(project.userStories.map((s) => s.priority)));

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
              borderBottom: "1px solid #E2E8F0",
              px: 3,
              py: 1.5,
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
              <TuneIcon sx={{ color: "#6366F1", fontSize: 20 }} />

              <FormControl size="small" sx={{ minWidth: 220 }}>
                <TextField
                  select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value ? Number(e.target.value) : 0)}
                  label="Project"
                  sx={inputSx}
                >
                  {projects.map((p) => (
                    <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                  ))}
                </TextField>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 180 }}>
                <TextField
                  select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  label="Priority"
                  sx={inputSx}
                >
                  <MenuItem value="all">All Priorities</MenuItem>
                  {priorities.map((priority) => (
                    <MenuItem key={priority} value={priority}>{priority}</MenuItem>
                  ))}
                </TextField>
              </FormControl>
            </Box>

            <Button
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
            </Button>

            {isModalOpen && (
              <AddUserStory
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                projectId={project.id}
              />
            )}
          </Box>
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
                "&::-webkit-scrollbar": { height: 6 },
                "&::-webkit-scrollbar-thumb": { bgcolor: "#CBD5E1", borderRadius: 3 },
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
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Board;