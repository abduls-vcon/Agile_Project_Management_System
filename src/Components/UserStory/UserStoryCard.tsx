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

const UserStoryCard: React.FC<UserStoryProps> = ({ story, projectId }) => {
  const { users, projects, deleteUserStory, updateUserStory } = useApp();
  const { onDragStart } = useDragDrop();

  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const assignedUser = users.find((u) => u.id === story.assignedTo);
  const project = projects.find((p) => p.id === projectId);
  const projectMembers = project ? project.teamMembers : [];

  const [title, setTitle] = useState(story.title);
  const [description, setDescription] = useState(story.description);
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">(
    story.priority,
  );
  const [assignedTo, setAssignedTo] = useState<number | undefined>(story.assignedTo || undefined);
  const [storyPoints, setStoryPoints] = useState<number | undefined>(
    story.storyPoints,
  );

  useEffect(() => {
    setTitle(story.title);
    setDescription(story.description);
    setPriority(story.priority as "Low" | "Medium" | "High");
    setAssignedTo(story.assignedTo);
    setStoryPoints(story.storyPoints);
  }, [story]);

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
      storyPoints: storyPoints,
    });
    setEditOpen(false);
  };

  return (
    <>
      <Card
        draggable
        onDragStart={onDragStart(Number(story.id))}
        onClick={() => setViewOpen(true)}
        sx={{
          position: "relative",
          bgcolor: grey[50],
          border: `1px solid ${grey[300]}`,
          cursor: "pointer",
          borderRadius: 3,
          transition: "0.2s",
          "&:hover": { boxShadow: 6 },
          mb: 1,
          height: "auto",
          width: "100%",
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{ px: 2, py: 2 }}
        >
          {story.isBug ? (
            <PestControlIcon
              sx={{
                color: red[800],
                bgcolor: red[100],
                px: 1,
                py: 1,
                borderRadius: "50%",
              }}
              fontSize="small"
            />
          ) : (
            <DescriptionIcon
              sx={{
                color: yellow[800],
                bgcolor: yellow[100],
                px: 1,
                py: 1,
                borderRadius: "50%",
              }}
              fontSize="small"
            />
          )}

          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Tooltip title="Edit">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditOpen(true);
                }}
              >
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete">
              <IconButton size="small" onClick={handleDelete}>
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <CardContent>
          <Box sx={{ mt: -3 }}>
            <Typography fontWeight="bold" sx={{ fontSize: 14 }}>
              {story.title}
            </Typography>
          </Box>
          <Divider sx={{ my: 1 }} />

          <Typography variant="body2" sx={{ mt: 1, mb: 2, fontSize: 12 }}>
            {story.description}
          </Typography>

          <Divider sx={{ my: 1 }} />

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
                      borderColor: "primary.main",
                      color: "primary.main",
                    }}
                  />
                </Tooltip>
              )}
            </Stack>

            {assignedUser ? (
              <Avatar user={assignedUser} size={28} />
            ) : (
              <Chip label="Unassigned" size="small" variant="outlined" />
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
      >
        <DialogTitle>Edit User Story</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
            />

            <TextField
              label="Description"
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
            />

            <TextField
              select
              label="Priority"
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value as "Low" | "Medium" | "High")
              }
              fullWidth
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
            >
              <MenuItem value="">None</MenuItem>
              {STORY_POINT_OPTIONS.map((pts) => (
                <MenuItem key={pts} value={pts}>
                  {pts}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Assign To"
              value={assignedTo ?? ""}
              onChange={(e) =>
                setAssignedTo(e.target.value ? Number(e.target.value) : undefined)
              }
              fullWidth
            >
              <MenuItem value="">Unassigned</MenuItem>
              {projectMembers.map((user) => (
                <MenuItem
                  key={user.id}
                  value={user.id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography>{user.name}</Typography>
                  <Typography
                    sx={{
                      color:
                        user.role === "Manager"
                          ? "error.main"
                          : user.role === "Developer"
                            ? "primary.main"
                            : user.role === "Tester"
                              ? "warning.main"
                              : "text.primary",
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

        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserStoryCard;