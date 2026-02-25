import React, { useState } from "react";
import { useApp } from "../Context";
import type { Project } from "../Models";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Button,
  Typography,
} from "@mui/material";

import { grey } from "@mui/material/colors";

interface AddProjectProps {
  open: boolean;
  onClose: () => void;
}

const AddProject: React.FC<AddProjectProps> = ({ open, onClose }) => {
  const { addProject, users } = useApp();

  const todayString = new Date().toISOString().split("T")[0];

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Active");
  const [selectedOwnerId, setSelectedOwnerId] = useState<number | "">("");
  const [createdDate, setCreatedDate] = useState(todayString);

  const handleSave = () => {
    if (!name.trim() || selectedOwnerId === "") return;

    const newProject: Project = {
      id: Date.now().toString(),
      name,
      description,
      status,
      userStories: [],
      ownerId: selectedOwnerId,
      createdDate: new Date(createdDate).toISOString(),
      updatedDate: new Date().toISOString(),
    };

    addProject(newProject);

    // Reset fields
    setName("");
    setDescription("");
    setStatus("Active");
    setSelectedOwnerId("");
    setCreatedDate(todayString);

    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Project</DialogTitle>

      <DialogContent>
        <Stack spacing={3} mt={1}>
          <TextField
            label="Project Title"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <TextField
            label="Project Description"
            fullWidth
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <FormControl fullWidth>
            <InputLabel id="project-status-label">Status</InputLabel>
            <Select
              labelId="project-status-label"
              value={status}
              label="Status"
              onChange={(e) => setStatus(e.target.value)}
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Complete">Complete</MenuItem>
              <MenuItem value="On Hold">On Hold</MenuItem>
            </Select>
          </FormControl>

          {/* Native Date Input */}
          <TextField
            label="Created Date"
            type="date"
            value={createdDate}
            onChange={(e) => setCreatedDate(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />

          <FormControl fullWidth>
            <InputLabel
              id="owner-label"
              sx={{ textAlign: "center", bgcolor: "white", px: 1 }}
            >
              Owner
            </InputLabel>

            <Select
              labelId="owner-label"
              value={selectedOwnerId}
              onChange={(e) =>
                setSelectedOwnerId(e.target.value as number)
              }
            >
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
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined" color="secondary">
          Cancel
        </Button>

        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProject;