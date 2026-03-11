import React, { useState } from "react";
import { useApp } from "../Context";
import type { User, Role } from "../Models";
import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Button,
  Box,
  Typography,
  Chip,
} from "@mui/material";
import { grey } from "@mui/material/colors";

interface AddUserProps {
  open: boolean;
  onClose: () => void;
}

const ROLE_COLORS: Record<string, string> = {
  Manager:   "#ef4444",
  Developer: "#3b82f6",
  Tester:    "#f59e0b",
};

const inputSx = {
  "& .MuiOutlinedInput-root": { borderRadius: "10px", fontSize: 13 },
  "& .MuiInputLabel-root": { fontSize: 13 },
};

const AddUser: React.FC<AddUserProps> = ({ open, onClose }) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>("Developer");
  const { addUser } = useApp();

  const handleSave = () => {
    if (!name.trim()) return;
    const newUser: Omit<User, "avatarColor"> = { id: Date.now(), name, role };
    addUser(newUser);
    setName("");
    setRole("Developer");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
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
        }}
      >
        <Typography sx={{ fontWeight: 700, fontSize: 15, color: "#fff", textShadow: "0 1px 3px rgba(0,0,0,0.2)" }}>
          Add New User
        </Typography>
      </Box>

      <DialogContent sx={{ px: 3, pt: 2.5, pb: 1 }}>
        <Stack spacing={2}>
          <TextField
            label="User Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={inputSx}
          />

          <FormControl fullWidth sx={inputSx}>
            <InputLabel id="role-label" sx={{ fontSize: 13 }}>Role</InputLabel>
            <Select
              labelId="role-label"
              value={role}
              label="Role"
              onChange={(e) => setRole(e.target.value as Role)}
              sx={{ borderRadius: "10px", fontSize: 13 }}
            >
              {["Developer", "Tester", "Manager"].map((r) => (
                <MenuItem key={r} value={r}>
                  <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                    <Typography sx={{ fontSize: 13 }}>{r}</Typography>
                    <Chip
                      label={r}
                      size="small"
                      sx={{
                        fontSize: 10,
                        fontWeight: 700,
                        height: 20,
                        bgcolor: `${ROLE_COLORS[r]}18`,
                        color: ROLE_COLORS[r],
                        border: `1px solid ${ROLE_COLORS[r]}40`,
                        "& .MuiChip-label": { px: 1 },
                      }}
                    />
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, borderTop: `1px solid ${grey[100]}`, gap: 1 }}>
        <Button
          onClick={onClose}
          sx={{ borderRadius: "8px", color: grey[500], fontWeight: 600, fontSize: 13, px: 2, "&:hover": { bgcolor: grey[100] } }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{
            borderRadius: "8px", fontWeight: 700, fontSize: 13, px: 3,
            background: "#665fc9",
            boxShadow: "0 2px 12px rgba(37,99,235,0.25)",
            "&:hover": { background: "#665fc9", boxShadow: "0 4px 16px rgba(37,99,235,0.35)" },
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUser;