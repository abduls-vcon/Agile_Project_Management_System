import React, { useState, useMemo, useCallback } from "react";
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
import AddCommentIcon from "@mui/icons-material/AddComment";
import DescriptionIcon from "@mui/icons-material/Description";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

import { useApp } from "../../Context";
import type { UserStory } from "../../Models";
import { useDragDrop } from "../../Hooks/useDragDrop";

import Avatar from "../Layout/Avatar";
import UserStoryView from "./UserStoryView";
import AddCommentDialog from "./AddCommentDialog";

interface UserStoryProps {
  story: UserStory;
  projectId: number;
}

const STORY_POINT_OPTIONS = [1, 2, 3, 5, 8, 13, 21];

const PRIORITY_CONFIG = {
  High: { dot: "#EF4444" },
  Medium: { dot: "#F59E0B" },
  Low: { dot: "#10B981" },
};

const UserStoryCard: React.FC<UserStoryProps> = ({ story, projectId }) => {
  const { users, projects, deleteUserStory, updateUserStory, currentUser } =
    useApp();

  const { onDragStart } = useDragDrop();

  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);

  const [title, setTitle] = useState(story.title);
  const [description, setDescription] = useState(story.description);
  const [priority, setPriority] = useState(story.priority);
  const [assignedTo, setAssignedTo] = useState<number | undefined>(
    story.assignedTo
  );
  const [storyPoints, setStoryPoints] = useState<number | undefined>(
    story.storyPoints
  );
  const [dueDate, setDueDate] = useState<string | undefined>(story.dueDate);

  const project = useMemo(
    () => projects.find((p) => p.id === projectId),
    [projects, projectId]
  );

  const projectMembers = project?.teamMembers ?? [];

  const assignedUser = useMemo(
    () => users.find((u) => u.id === story.assignedTo),
    [users, story.assignedTo]
  );

  const pCfg = PRIORITY_CONFIG[story.priority] ?? PRIORITY_CONFIG.Low;

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      if (window.confirm("Are you sure you want to delete this story?")) {
        deleteUserStory(projectId, story.id);
      }
    },
    [deleteUserStory, projectId, story.id]
  );

  const handleOpenEdit = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      setTitle(story.title);
      setDescription(story.description);
      setPriority(story.priority);
      setAssignedTo(story.assignedTo);
      setStoryPoints(story.storyPoints);
      setDueDate(story.dueDate);

      setEditOpen(true);
    },
    [story]
  );

  const handleSave = useCallback(() => {
    updateUserStory(projectId, {
      ...story,
      title,
      description,
      priority,
      assignedTo,
      storyPoints,
      dueDate,
    });

    setEditOpen(false);
  }, [
    updateUserStory,
    projectId,
    story,
    title,
    description,
    priority,
    assignedTo,
    storyPoints,
    dueDate,
  ]);

  return (
    <>
      <Card
        draggable
        onDragStart={onDragStart(Number(story.id))}
        onClick={() => setViewOpen(true)}
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: grey[200],
          borderLeft: `4px solid ${pCfg.dot}`,
          borderRadius: 3,
          cursor: "pointer",
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

          <Box sx={{ display: "flex", gap: 1.5 }}>
            {currentUser?.role === "Manager" && (
              <>
                <Tooltip title="Edit">
                  <IconButton
                    size="small"
                    onClick={handleOpenEdit}
                    sx={{ color: "#6366F1", bgcolor: "#EEF2FF" }}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Delete">
                  <IconButton
                    size="small"
                    onClick={handleDelete}
                    sx={{ color: "#EF4444", bgcolor: "#FEE2E2" }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Tooltip>
              </>
            )}

            <Tooltip title="Comment">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setCommentOpen(true);
                }}
                sx={{ color: "#b644ef", bgcolor: "#F3E8FF" }}
              >
                <AddCommentIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <CardContent sx={{ pt: 0 }}>
          <Typography fontWeight={700} sx={{ fontSize: 14 }}>
            {story.title}
          </Typography>

          <Divider sx={{ my: 1 }} />

          <Typography sx={{ fontSize: 12, color: "#64748B", mb: 2 }}>
            {story.description}
          </Typography>

          <Stack direction="row" justifyContent="space-between">
            <Stack direction="row" spacing={1}>
              <Chip label={story.priority} size="small" />

              {story.storyPoints && (
                <Chip
                  label={`${story.storyPoints} pts`}
                  size="small"
                  variant="outlined"
                />
              )}
            </Stack>

            {assignedUser ? (
              <Avatar user={assignedUser} size={30} />
            ) : (
              <Chip label="Unassigned" size="small" variant="outlined" />
            )}
          </Stack>

          {story.dueDate && (
            <>
              <Divider sx={{ my: 1 }} />
              <Box display="flex" alignItems="center" gap={0.5}>
                <CalendarTodayIcon sx={{ fontSize: 14 }} />
                <Typography sx={{ fontSize: 11 }}>
                  {new Date(story.dueDate).toLocaleDateString()}
                </Typography>
              </Box>
            </>
          )}
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={viewOpen} onClose={() => setViewOpen(false)} fullWidth>
        <UserStoryView
          story={story}
          projectId={projectId}
          onClose={() => setViewOpen(false)}
        />
      </Dialog>

      <AddCommentDialog
        open={commentOpen}
        onClose={() => setCommentOpen(false)}
        storyId={story.id}
        projectId={projectId}
      />
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth>
        <Box sx={{ p: 2, bgcolor: "#665FC9" }}>
          <Typography sx={{ color: "#fff", fontWeight: 700 }}>
            Edit User Story
          </Typography>
        </Box>

        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
            />

            <TextField
              label="Description"
              multiline
              rows={3}
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
              onChange={(e) =>
                setStoryPoints(
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              fullWidth
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
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              fullWidth
            >
              <MenuItem value="">Unassigned</MenuItem>

              {projectMembers.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name} ({user.role})
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Due Date"
              type="date"
              value={dueDate ?? ""}
              onChange={(e) => setDueDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>

          <Button
            variant="contained"
            onClick={handleSave}
            sx={{ bgcolor: "#665FC9" }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default React.memo(UserStoryCard);