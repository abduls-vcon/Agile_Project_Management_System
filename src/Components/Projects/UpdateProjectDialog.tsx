import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
} from "@mui/material";
import { useApp } from "../../Context";
import type { Project } from "../../Models";

interface Props {
  open: boolean;
  onClose: () => void;
  project: Project;
}

const statusOptions = ["Active", "Complete", "On Hold"];

const UpdateProjectDialog: React.FC<Props> = ({ open, onClose, project }) => {
  const { updateProject, users } = useApp();

  const [name, setName] = useState(project.name);
  const [status, setStatus] = useState(project.status);
  const [ownerId, setOwnerId] = useState(project.ownerId);

  useEffect(() => {
  if (open) {
    setName(project.name);
    setStatus(project.status);
    setOwnerId(project.ownerId);
  }
}, [open, project]);

  const handleUpdate = () => {
    updateProject({ ...project, name, status, ownerId });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Update Project</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField
            label="Project Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <TextField
            select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {statusOptions.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Owner"
            value={ownerId}
            onChange={(e) => setOwnerId(Number(e.target.value))}
          >
            {users.map((u) => (
              <MenuItem key={u.id} value={u.id}>
                {u.name} ({u.role})
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleUpdate} variant="contained">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateProjectDialog;