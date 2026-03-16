import React, { useCallback, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { useApp } from "../Context";
import Visibility from "@mui/icons-material/Visibility";
import type { Role } from "../Models";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

interface Props {
  open: boolean;
  onClose: () => void;
}

const ROLES = ["Admin", "Manager", "Developer", "Tester"];

const inputSx = {
  "& .MuiOutlinedInput-root": { borderRadius: "10px", fontSize: 13 },
  "& .MuiInputLabel-root": { fontSize: 13 },
};

const AddUser: React.FC<Props> = ({ open, onClose }) => {
  const { addUser } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("Developer");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = useCallback(() => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    const newUserBase = {
      id: Date.now(),
      name,
      email,
      role,
    };

    try {
      addUser(newUserBase, password);

      setName("");
      setEmail("");
      setRole("Developer");
      setPassword("");
      setError("");

      onClose();
    } catch (e) {
      console.error("Failed to add user:", e);
      setError("Failed to add user. See console for details.");
    }
  }, [name, email, password, role, addUser, onClose]);

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
          Add New User
        </Typography>
      </Box>

      <DialogContent sx={{ px: 3, pt: 2.5, pb: 1 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Full Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={inputSx}
          />

          <TextField
            label="Email Address"
            fullWidth
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={inputSx}
          />

          <TextField
            label="Password"
            fullWidth
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={inputSx}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            select
            label="Role"
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            fullWidth
            sx={inputSx}
          >
            {ROLES.map((r) => (
              <MenuItem key={r} value={r}>
                {r}
              </MenuItem>
            ))}
          </TextField>
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
          Add User
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUser;
