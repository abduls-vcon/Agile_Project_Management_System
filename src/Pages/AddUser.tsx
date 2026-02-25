import React, { useState } from "react";
import { useApp } from "../Context";
import type { User } from "../Models";
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
} from "@mui/material";

interface AddUserProps {
  open: boolean;
  onClose: () => void;
}

type Role = "Developer" | "Tester" | "Manager";

const AddUser: React.FC<AddUserProps> = ({ open, onClose }) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>("Developer");
  const { addUser } = useApp();

  const handleSave = () => {
    if (!name.trim()) return;

    const newUser: Omit<User, "avatarColor"> = {
      id: Date.now().toString(),
      name,
      role,
    };

    addUser(newUser);
    setName("");
    setRole("Developer");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New User</DialogTitle>
      <DialogContent>
        <Stack spacing={3} mt={1}>
          <TextField
            label="User Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <FormControl fullWidth>
            <InputLabel id="project-role-label">Role</InputLabel>
            <Select
              labelId="project-role-label"
              value={role}
              label="Role"
              onChange={(e) => setRole(e.target.value as Role)}
            >
              <MenuItem value="Developer">Developer</MenuItem>
              <MenuItem value="Tester">Tester</MenuItem>
              <MenuItem value="Manager">Manager</MenuItem>
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

export default AddUser;
