import React, { useState } from "react";
import {
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
} from "@mui/material";
import { useApp } from "../Context";
import type { UserStory } from "../Models";
import { grey } from "@mui/material/colors";

interface Props {
  open: boolean;
  onClose: () => void;
  projectId: string;
}

type UserStoryStatus = "Backlog" | "In Progress" | "Testing" | "Completed";

const AddUserStory: React.FC<Props> = ({ open, onClose, projectId }) => {
  const { addUserStory, users } = useApp();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<UserStoryStatus>("Backlog");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Medium");
  const [assignedTo, setAssignedTo] = useState<string>("");
  const [storyPoints, setStoryPoints] = useState<number>(0); // <-- Added state

  const handleSubmit = () => {
    if (!title.trim() || !description.trim()) return;

    const newStory: UserStory = {
      id: Date.now().toString(),
      title,
      description,
      status,
      priority,
      assignedTo,
      storyPoints,
    };

    addUserStory(projectId, newStory);
    setTitle("");
    setDescription("");
    setStatus("Backlog");
    setPriority("Medium");
    setAssignedTo("");
    setStoryPoints(0);

    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>Add User Story</DialogTitle>

      <DialogContent>
        <Box display="flex" flexDirection="column" gap={3} mt={1}>
          <TextField
            label="Title"
            fullWidth
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <TextField
            label="Description"
            fullWidth
            required
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <TextField
            select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as UserStoryStatus)}
          >
            <MenuItem value="Backlog">Backlog</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Testing">Testing</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </TextField>

          <TextField
            select
            label="Priority"
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value as "Low" | "Medium" | "High")
            }
          >
            <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="High">High</MenuItem>
          </TextField>

          <TextField
            select
            label="Assign To"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
          >
            <MenuItem value="">Unassigned</MenuItem>
            {users.map((u) => (
              <MenuItem
                key={u.id}
                value={u.id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  color: grey[500],
                }}
              >
                <Typography>{u.name}</Typography>
                <Typography
                  sx={{
                    color:
                      u.role === "Manager"
                        ? "error.main"
                        : u.role === "Developer"
                          ? "primary.main"
                          : u.role === "Tester"
                            ? "warning.main"
                            : "text.primary",
                    fontWeight: 600,
                  }}
                >
                  {u.role}
                </Typography>
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Story Points"
            type="number"
            value={storyPoints}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (value >= 1 && value <= 13) setStoryPoints(value); // Range 1-13
            }}
            size="small"
            sx={{ minWidth: 180 }}
            InputProps={{ inputProps: { min: 1, max: 13 } }}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUserStory;
