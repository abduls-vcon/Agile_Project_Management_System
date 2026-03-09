import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  IconButton,
  Tooltip,
  TextField,
  Button,
  MenuItem,
  Divider,
} from "@mui/material";
import { grey, red, yellow } from "@mui/material/colors";
import { Delete, Edit } from "@mui/icons-material";
import PestControlIcon from "@mui/icons-material/PestControl";
import DescriptionIcon from "@mui/icons-material/Description";
import { useApp } from "../../Context";
import type { UserStory } from "../../Models";
import { useDragDrop } from "../../Hooks/useDragDrop";
import Avatar from "../Layout/Avatar";
import UserStoryView from "./UserStoryView";

interface UserStoryProps {
  story: UserStory;
  projectId: number;
}

const STORY_POINT_OPTIONS = [1, 2, 3, 5, 8, 13, 21];

const PRIORITY_CONFIG = {
  High:   { bg: "#FEE2E2", color: "#991B1B", border: "#FCA5A5", dot: "#EF4444" },
  Medium: { bg: "#FEF3C7", color: "#92400E", border: "#FCD34D", dot: "#F59E0B" },
  Low:    { bg: "#D1FAE5", color: "#065F46", border: "#6EE7B7", dot: "#10B981" },
};

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    "&.Mui-focused fieldset": { borderColor: "#6366F1" },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: "#6366F1" },
};

const UserStoryCard: React.FC<UserStoryProps> = ({ story, projectId }) => {
  const { users, projects, deleteUserStory, updateUserStory } = useApp();
  const { onDragStart } = useDragDrop();

  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const assignedUser = users.find((u) => u.id === story.assignedTo);
  const project = projects.find((p) => p.id === projectId);
  const projectMembers = project ? project.teamMembers : [];

  const [title, setTitle]           = useState(story.title);
  const [description, setDescription] = useState(story.description);
  const [priority, setPriority]     = useState<"Low" | "Medium" | "High">(story.priority);
  const [assignedTo, setAssignedTo] = useState<number | undefined>(story.assignedTo || undefined);
  const [storyPoints, setStoryPoints] = useState<number | undefined>(story.storyPoints);

  useEffect(() => {
    setTitle(story.title);
    setDescription(story.description);
    setPriority(story.priority as "Low" | "Medium" | "High");
    setAssignedTo(story.assignedTo);
    setStoryPoints(story.storyPoints);
  }, [story]);

  const getPriorityColor = (priority: string): "error" | "warning" | "success" => {
    switch (priority) {
      case "High":   return "error";
      case "Medium": return "warning";
      case "Low":
      default:       return "success";
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this story?")) {
      deleteUserStory(projectId, story.id);
    }
  };

  const handleSave = () => {
    updateUserStory(projectId, {
      ...story,
      title,
      description,
      priority,
      assignedTo: assignedTo || undefined,
      storyPoints,
    });
    setEditOpen(false);
  };

  const pCfg = PRIORITY_CONFIG[story.priority] ?? PRIORITY_CONFIG.Low;

  return (
    <>
      <Card
        draggable
        onDragStart={onDragStart(Number(story.id))}
        onClick={() => setViewOpen(true)}
        elevation={0}
        sx={{
          position: "relative",
          bgcolor: "#fff",
          border: "1px solid",
          borderColor: grey[200],
          borderLeft: `4px solid ${pCfg.dot}`,
          cursor: "pointer",
          borderRadius: 3,
          transition: "0.2s",
          "&:hover": {
            boxShadow: `0 4px 16px ${pCfg.dot}33`,
            transform: "translateY(-2px)",
          },
          mb: 1,
          height: "auto",
          width: "100%",
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{ px: 2, py: 1.5 }}
        >
          {story.isBug ? (
            <PestControlIcon
              sx={{ color: red[800], bgcolor: red[100], px: 1, py: 1, borderRadius: "50%" }}
              fontSize="small"
            />
          ) : (
            <DescriptionIcon
              sx={{ color: yellow[800], bgcolor: yellow[100], px: 1, py: 1, borderRadius: "50%" }}
              fontSize="small"
            />
          )}

          <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
            <Tooltip title="Edit">
              <IconButton
                size="small"
                onClick={(e) => { e.stopPropagation(); setEditOpen(true); }}
                sx={{
                  color: "#6366F1",
                  bgcolor: "#EEF2FF",
                  width: 28, height: 28,
                  "&:hover": { bgcolor: "#C7D2FE" },
                }}
              >
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete">
              <IconButton
                size="small"
                onClick={handleDelete}
                sx={{
                  color: "#EF4444",
                  bgcolor: "#FEE2E2",
                  width: 28, height: 28,
                  "&:hover": { bgcolor: "#FECACA" },
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ mt: -1 }}>
            <Typography fontWeight={700} sx={{ fontSize: 14, color: "#1E293B" }}>
              {story.title}
            </Typography>
          </Box>
          <Divider sx={{ my: 1, borderColor: `${pCfg.dot}22` }} />

          <Typography variant="body2" sx={{ mt: 1, mb: 2, fontSize: 12, color: "#64748B" }}>
            {story.description}
          </Typography>

          <Divider sx={{ my: 1, borderColor: `${pCfg.dot}22` }} />

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                label={story.priority}
                size="small"
                sx={{ fontSize: 10, fontWeight: "bold" }}
                color={getPriorityColor(story.priority)}
              />
              {story.storyPoints !== undefined && (
                <Tooltip title="Story Points">
                  <Chip
                    label={`${story.storyPoints} pts`}
                    size="small"
                    variant="outlined"
                    sx={{
                      fontSize: 10,
                      fontWeight: "bold",
                      borderColor: "#6366F1",
                      color: "#6366F1",
                      bgcolor: "#EEF2FF",
                    }}
                  />
                </Tooltip>
              )}
            </Stack>

            {assignedUser ? (
              <Avatar user={assignedUser} size={28} />
            ) : (
              <Chip
                label="Unassigned"
                size="small"
                variant="outlined"
                sx={{ fontSize: 10, borderColor: grey[300], color: grey[500] }}
              />
            )}
          </Stack>
        </CardContent>
      </Card>

      <Dialog open={viewOpen} onClose={() => setViewOpen(false)} fullWidth maxWidth="sm">
        <UserStoryView story={story} projectId={projectId} onClose={() => setViewOpen(false)} />
      </Dialog>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle
          sx={{
            fontWeight: 700,
            fontSize: 16,
            bgcolor: "#EEF2FF",
            color: "#4F46E5",
            borderBottom: "1px solid #C7D2FE",
          }}
        >
          Edit User Story
        </DialogTitle>

        <DialogContent sx={{ bgcolor: "#FAFAFA" }}>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth sx={inputSx} />

            <TextField
              label="Description"
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              sx={inputSx}
            />

            <TextField
              select
              label="Priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as "Low" | "Medium" | "High")}
              fullWidth
              sx={inputSx}
            >
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
            </TextField>

            <TextField
              select
              label="Story Points"
              value={storyPoints ?? ""}
              onChange={(e) => {
                const val = e.target.value;
                setStoryPoints(val === "" ? undefined : Number(val));
              }}
              fullWidth
              helperText="Fibonacci-based effort estimate"
              sx={inputSx}
            >
              <MenuItem value="">None</MenuItem>
              {STORY_POINT_OPTIONS.map((pts) => (
                <MenuItem key={pts} value={pts}>{pts}</MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Assign To"
              value={assignedTo ?? ""}
              onChange={(e) => setAssignedTo(e.target.value ? Number(e.target.value) : undefined)}
              fullWidth
              sx={inputSx}
            >
              <MenuItem value="">Unassigned</MenuItem>
              {projectMembers.map((user) => (
                <MenuItem
                  key={user.id}
                  value={user.id}
                  sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  <Typography>{user.name}</Typography>
                  <Typography
                    sx={{
                      color:
                        user.role === "Manager"   ? "error.main" :
                        user.role === "Developer" ? "primary.main" :
                        user.role === "Tester"    ? "warning.main" : "text.primary",
                      fontWeight: 600,
                      ml: 1,
                    }}
                  >
                    {user.role}
                  </Typography>
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, bgcolor: "#FAFAFA", borderTop: "1px solid #E2E8F0", gap: 1 }}>
          <Button
            onClick={() => setEditOpen(false)}
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 600,
              color: "#64748B",
              border: "1px solid #E2E8F0",
              "&:hover": { bgcolor: "#F1F5F9" },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 700,
              bgcolor: "#4F46E5",
              boxShadow: "none",
              "&:hover": { bgcolor: "#4338CA", boxShadow: "none" },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserStoryCard;