import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
  Avatar,
  FormControlLabel,
  Checkbox,
  Typography,
  Chip,
  Alert,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { useApp } from "../Context";
import type { UserStory, UserStoryStatus } from "../Models";

interface Props {
  open: boolean;
  onClose: () => void;
  projectId: number;
}

const STATUS_HEADER: Record<string, string> = {
  Backlog: "#64748B",
  "In Progress": "#2563EB",
  Testing: "#D97706",
  Completed: "#059669",
};

const PRIORITY_COLORS: Record<string, string> = {
  Low: "#059669",
  Medium: "#D97706",
  High: "#ef4444",
};

const ROLE_COLORS: Record<string, string> = {
  Manager: "#ef4444",
  Developer: "#3b82f6",
  Tester: "#f59e0b",
};

const inputSx = {
  "& .MuiOutlinedInput-root": { borderRadius: "10px", fontSize: 13 },
  "& .MuiInputLabel-root": { fontSize: 13 },
};

const AddUserStory: React.FC<Props> = ({ open, onClose, projectId }) => {
  const { addUserStory, projects, currentUser } = useApp();

  const project = useMemo(
    () => projects.find((p) => p.id === projectId),
    [projects, projectId],
  );
  const projectTeamMembers = project?.teamMembers ?? [];

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<UserStoryStatus>("Backlog");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Medium");
  const [assignedTo, setAssignedTo] = useState<number | undefined>(undefined);
  const [storyPoints, setStoryPoints] = useState<number>(0);
  const [dueDate, setDueDate] = useState("");
  const [checked, setChecked] = useState(false);
  const [titleError, setTitleError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser?.role === "Tester") {
      setChecked(true);
    }
  }, [currentUser]);

  const handleSubmit = useCallback(() => {
  const isTitleValid = title.trim().length > 0;
  const isDescValid = description.trim().length > 0;

  setTitleError(!isTitleValid);
  setDescriptionError(!isDescValid);
  setSubmitError(null);

  if (!isTitleValid || !isDescValid) return;

  const newStory: UserStory = {
    id: Date.now(),
    title,
    description,
    status,
    priority,
    assignedTo,
    createdDate: new Date().toISOString(),
    dueDate: dueDate || undefined,
    storyPoints,
    isBug: checked,
    comments: [],
  };

  try {
    addUserStory(projectId, newStory);
  } catch (error) {
    console.error("Failed to add user story:", error);
    setSubmitError("An unexpected error occurred. Please try again.");
    return;
  }
  onClose();
}, [
  title,
  description,
  status,
  priority,
  assignedTo,
  dueDate,
  storyPoints,
  checked,
  projectId,
  addUserStory,
  onClose
]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
          background: "#665fc9",
          px: 3,
          py: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: 15,
            color: "#fff",
            textShadow: "0 1px 3px rgba(0,0,0,0.2)",
          }}
        >
          Add User Story
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            px: 1,
            py: 0.4,
            borderRadius: 1,
            bgcolor: "rgba(255,255,255,0.2)",
          }}
        >
          <Typography
            sx={{
              fontSize: "0.65rem",
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {checked ? "Bug" : "Story"}
          </Typography>
        </Box>
      </Box>

      <DialogContent sx={{ px: 3, pt: 2.5, pb: 1 }}>
        {submitError && <Alert severity="error" sx={{ mb: 2 }}>{submitError}</Alert>}
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Title"
            fullWidth
            required
            value={title}
            error={titleError}
            helperText={titleError ? "Title is required" : ""}
            onChange={(e) => {
              setTitle(e.target.value);
              if (titleError) setTitleError(false);
            }}
            sx={inputSx}
          />

          <TextField
            label="Description"
            fullWidth
            required
            multiline
            rows={4}
            value={description}
            error={descriptionError}
            helperText={descriptionError ? "Description is required" : ""}
            onChange={(e) => {
              setDescription(e.target.value);
              if (descriptionError) setDescriptionError(false);
            }}
            sx={inputSx}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
                disabled={currentUser?.role === "Tester"}
                size="small"
              />
            }
            label={
              <Typography
                sx={{ fontSize: 13, fontWeight: 600, color: grey[600] }}
              >
                Mark as Bug
              </Typography>
            }
          />

          <TextField
            select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as UserStoryStatus)}
            fullWidth
            sx={inputSx}
          >
            {Object.keys(STATUS_HEADER).map((s) => (
              <MenuItem key={s} value={s}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: STATUS_HEADER[s],
                    }}
                  />
                  {s}
                </Box>
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Priority"
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value as "Low" | "Medium" | "High")
            }
            fullWidth
            sx={inputSx}
          >
            {["Low", "Medium", "High"].map((p) => (
              <MenuItem key={p} value={p}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  width="100%"
                >
                  <Typography sx={{ fontSize: 13 }}>{p}</Typography>
                  <Chip
                    label={p}
                    size="small"
                    sx={{
                      fontSize: 10,
                      fontWeight: 700,
                      height: 20,
                      bgcolor: `${PRIORITY_COLORS[p]}18`,
                      color: PRIORITY_COLORS[p],
                      border: `1px solid ${PRIORITY_COLORS[p]}40`,
                      "& .MuiChip-label": { px: 1 },
                    }}
                  />
                </Box>
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
            disabled={projectTeamMembers.length === 0}
            fullWidth
            sx={inputSx}
            helperText={
              projectTeamMembers.length === 0
                ? "No team members assigned to this project"
                : ""
            }
          >
            <MenuItem value="">
              <Typography sx={{ fontSize: 13, color: grey[400] }}>
                Unassigned
              </Typography>
            </MenuItem>
            {projectTeamMembers.map((u) => (
              <MenuItem key={u.id} value={u.id}>
                <Box display="flex" alignItems="center" gap={1.5} width="100%">
                  <Avatar
                    sx={{
                      bgcolor: u.avatarColor,
                      width: 24,
                      height: 24,
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    {u.name[0]}
                  </Avatar>
                  <Typography sx={{ fontSize: 13, flex: 1 }}>
                    {u.name}
                  </Typography>
                  <Chip
                    label={u.role}
                    size="small"
                    sx={{
                      fontSize: 10,
                      fontWeight: 700,
                      height: 20,
                      bgcolor: `${ROLE_COLORS[u.role]}18`,
                      color: ROLE_COLORS[u.role],
                      border: `1px solid ${ROLE_COLORS[u.role]}40`,
                      "& .MuiChip-label": { px: 1 },
                    }}
                  />
                </Box>
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Due Date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            sx={inputSx}
          ></TextField>

          <TextField
            label="Story Points"
            type="number"
            value={storyPoints}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "") {
                setStoryPoints(0);
                return;
              }
              const v = parseInt(val, 10);
              if (!isNaN(v) && v >= 0 && v <= 21) setStoryPoints(v);
            }}
            size="small"
            fullWidth
            sx={{ ...inputSx, maxWidth: 200 }}
            InputProps={{ inputProps: { min: 0, max: 21 } }}
          />
        </Box>
      </DialogContent>

      <DialogActions
        sx={{ px: 3, py: 2, borderTop: `1px solid ${grey[100]}`, gap: 1 }}
      >
        <Button
          onClick={onClose}
          sx={{
            borderRadius: "8px",
            color: grey[500],
            fontWeight: 600,
            fontSize: 13,
            px: 2,
            "&:hover": { bgcolor: grey[100] },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            borderRadius: "8px",
            fontWeight: 700,
            fontSize: 13,
            px: 3,
            background: "#665fc9",
            boxShadow: `0 2px 12px rgba(102, 95, 201, 0.4)`,
            "&:hover": {
              filter: "brightness(0.9)",
              boxShadow: `0 4px 16px rgba(102, 95, 201, 0.6)`,
            },
          }}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUserStory;
