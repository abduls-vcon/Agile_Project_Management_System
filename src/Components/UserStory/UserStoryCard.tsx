import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Dialog,
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
  High: { bg: "#FEE2E2", color: "#991B1B", border: "#FCA5A5", dot: "#EF4444" },
  Medium: {
    bg: "#FEF3C7",
    color: "#92400E",
    border: "#FCD34D",
    dot: "#F59E0B",
  },
  Low: { bg: "#D1FAE5", color: "#065F46", border: "#6EE7B7", dot: "#10B981" },
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

  const project = projects.find((p) => p.id === projectId);
  const projectMembers = project ? project.teamMembers : [];

  const [title, setTitle] = useState(story.title);
  const [description, setDescription] = useState(story.description);
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">(
    story.priority,
  );
  const [assignedTo, setAssignedTo] = useState<number | undefined>(
    story.assignedTo,
  );
  const [storyPoints, setStoryPoints] = useState<number | undefined>(
    story.storyPoints,
  );

  const assignedUser = users.find((u) => u.id === story.assignedTo);

  const getPriorityColor = (
    priority: string,
  ): "error" | "warning" | "success" => {
    switch (priority) {
      case "High":
        return "error";
      case "Medium":
        return "warning";
      case "Low":
      default:
        return "success";
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

  const handleOpenEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTitle(story.title);
    setDescription(story.description);
    setPriority(story.priority);
    setAssignedTo(story.assignedTo);
    setStoryPoints(story.storyPoints);
    setEditOpen(true);
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
          flexShrink: 0,
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
              sx={{
                color: red[800],
                bgcolor: red[100],
                p: 1,
                borderRadius: "50%",
              }}
              fontSize="small"
            />
          ) : (
            <DescriptionIcon
              sx={{
                color: yellow[800],
                bgcolor: yellow[100],
                p: 1,
                borderRadius: "50%",
              }}
              fontSize="small"
            />
          )}

          <Box sx={{ display: "flex", gap: 0.5 }}>
            <Tooltip title="Edit">
              <IconButton
                size="small"
                onClick={handleOpenEdit}
                sx={{
                  color: "#6366F1",
                  bgcolor: "#EEF2FF",
                  width: 28,
                  height: 28,
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
                  width: 28,
                  height: 28,
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <CardContent sx={{ pt: 0 }}>
          <Typography fontWeight={700} sx={{ fontSize: 14 }}>
            {story.title}
          </Typography>

          <Divider sx={{ my: 1 }} />

          <Typography
            variant="body2"
            sx={{ fontSize: 12, color: "#64748B", mb: 2 }}
          >
            {story.description}
          </Typography>

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" spacing={1}>
              <Chip
                label={story.priority}
                size="small"
                sx={{ fontSize: 10, fontWeight: "bold" }}
                color={getPriorityColor(story.priority)}
              />

              {story.storyPoints && (
                <Chip
                  label={`${story.storyPoints} pts`}
                  size="small"
                  variant="outlined"
                  sx={{
                    fontSize: 10,
                    borderColor: "#6366F1",
                    color: "#6366F1",
                  }}
                />
              )}
            </Stack>

            {assignedUser ? (
              <Avatar user={assignedUser} size={30} />
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

      <Dialog
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <UserStoryView
          story={story}
          projectId={projectId}
          onClose={() => setViewOpen(false)}
        />
      </Dialog>

      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: "16px",
            border: `1px solid ${grey[200]}`,
            boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
            overflow: "hidden",
          },
        }}
      >
        <Box
          sx={{
            background: "#665FC9",
            px: 3,
            py: 1.5,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: 15,
              color: "#fff",
              textShadow: "0 1px 3px rgba(0,0,0,0.2)",
              flex: 1,
            }}
          >
            Edit User Story
          </Typography>
        </Box>

        <DialogContent sx={{ px: 3, pt: 2.5, pb: 1 }}>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              sx={inputSx}
            />

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
              onChange={(e) => setPriority(e.target.value as any)}
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
              onChange={(e) =>
                setStoryPoints(
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
              fullWidth
              sx={inputSx}
            >
              <MenuItem value="">None</MenuItem>
              {STORY_POINT_OPTIONS.map((p) => (
                <MenuItem key={p} value={p}>
                  {p}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Assign To"
              value={assignedTo ?? ""}
              onChange={(e) =>
                setAssignedTo(
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
              fullWidth
              sx={inputSx}
            >
              <MenuItem value="">Unassigned</MenuItem>
              {projectMembers.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name} ({user.role})
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            py: 2,
            borderTop: `1px solid ${grey[100]}`,
            gap: 1,
          }}
        >
          <Button
            onClick={() => setEditOpen(false)}
            sx={{
              borderRadius: "8px",
              color: grey[500],
              fontWeight: 600,
              fontSize: 13,
              px: 2,
              "&:hover": { bgcolor: grey[100], color: grey[700] },
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              borderRadius: "8px",
              fontWeight: 700,
              fontSize: 13,
              px: 3,
              background: "#665FC9",
              boxShadow: "0 2px 12px rgba(37,99,235,0.25)",
              "&:hover": {
                background: "#504a9b",
                boxShadow: "0 4px 16px rgba(37,99,235,0.35)",
              },
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
