import React, { useState } from "react";
import {
  Box,
  Grid,
  Card,
  Avatar,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  MenuItem,
  Stack,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CodeIcon from "@mui/icons-material/Code";
import BugReportIcon from "@mui/icons-material/BugReport";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { useApp } from "../../Context";
import type { User } from "../../Models";

interface UserItemsProps {
  users: User[];
}

const ROLE_CONFIG: Record<string, { color: string; bg: string; border: string; iconColor: string }> = {
  Developer: { color: "#1D4ED8", bg: "#DBEAFE", border: "#93C5FD", iconColor: "#2563EB" },
  Tester:    { color: "#B45309", bg: "#FEF3C7", border: "#FCD34D", iconColor: "#D97706" },
  Manager:   { color: "#6D28D9", bg: "#EDE9FE", border: "#C4B5FD", iconColor: "#7C3AED" },
};

const roleIcon = (role: string) => {
  const cfg = ROLE_CONFIG[role];
  switch (role) {
    case "Developer": return <CodeIcon sx={{ color: cfg?.iconColor, fontSize: 26 }} />;
    case "Tester":    return <BugReportIcon sx={{ color: cfg?.iconColor, fontSize: 26 }} />;
    case "Manager":   return <ManageAccountsIcon sx={{ color: cfg?.iconColor, fontSize: 26 }} />;
    default:          return null;
  }
};

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    "&.Mui-focused fieldset": { borderColor: "#6366F1" },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: "#6366F1" },
};

const UserItems: React.FC<UserItemsProps> = ({ users }) => {
  const { updateUser, deleteUser } = useApp();
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [formData, setFormData] = useState({ name: "", role: "", avatarColor: "" });

  const handleOpen = (user: any) => {
    setSelectedUser(user);
    setFormData({ name: user.name, role: user.role, avatarColor: user.avatarColor });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    if (selectedUser) {
      updateUser({ ...selectedUser, ...formData });
      handleClose();
    }
  };

  if (users.length === 0) {
    return (
      <Box sx={{ my: 5, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          No users added yet.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ my: 1, p: 1 }}>
      <Grid container spacing={2} justifyContent="center">
        {users.map((user) => {
          const roleCfg = ROLE_CONFIG[user.role] ?? { color: "#475569", bg: "#F1F5F9", border: "#E2E8F0", iconColor: "#64748B" };
          return (
            <Grid sx={{ xs: 12, sm: 6, md: 4, lg: 3, mx: 1 }} key={user.id}>
              <Card
                elevation={0}
                sx={{
                  display: "flex",
                  px: 2,
                  py: 1.5,
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: roleCfg.border,
                  borderLeft: `4px solid ${roleCfg.iconColor}`,
                  height: 60,
                  width: 500,
                  boxShadow: `0 2px 10px ${roleCfg.iconColor}22`,
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: `0 8px 24px ${roleCfg.iconColor}33`,
                  },
                }}
              >
                <ListItem
                  disableGutters
                  sx={{ display: "flex", alignItems: "center", width: "100%" }}
                  secondaryAction={
                    <Stack direction="row" spacing={0.5}>
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() => handleOpen(user)}
                        sx={{
                          color: "#6366F1",
                          bgcolor: "#EEF2FF",
                          width: 30, height: 30,
                          "&:hover": { bgcolor: "#C7D2FE" },
                        }}
                      >
                        <EditIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => deleteUser(user.id)}
                        sx={{
                          color: "#EF4444",
                          bgcolor: "#FEE2E2",
                          width: 30, height: 30,
                          "&:hover": { bgcolor: "#FECACA" },
                        }}
                      >
                        <DeleteIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Stack>
                  }
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: user.avatarColor,
                        fontWeight: "bold",
                        width: 40,
                        height: 40,
                        fontSize: "1rem",
                        boxShadow: `0 0 0 2px #fff, 0 0 0 3.5px ${roleCfg.border}`,
                      }}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>

                  <ListItemText
                    sx={{ ml: 2 }}
                    primary={
                      <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#1E293B" }}>
                        {user.name}
                      </Typography>
                    }
                    secondary={
                      <Chip
                        label={user.role}
                        size="small"
                        sx={{
                          mt: 0.3,
                          height: 18,
                          fontSize: 10,
                          fontWeight: 700,
                          bgcolor: roleCfg.bg,
                          color: roleCfg.color,
                          border: `1px solid ${roleCfg.border}`,
                          "& .MuiChip-label": { px: 1 },
                        }}
                      />
                    }
                  />

                  <Box sx={{ ml: "auto", mr: 8 }}>{roleIcon(user.role)}</Box>
                </ListItem>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" sx={{borderRadius:5}}>
        <DialogTitle
          sx={{
            fontWeight: 700,
            fontSize: 16,
            bgcolor: "#665fc9",
            color: "#fff",
            borderBottom: "1px solid #C7D2FE",
            mb:2,
            
          }}
        >
          Edit User
        </DialogTitle>

        <DialogContent sx={{ bgcolor: "#FAFAFA" }}>
          <TextField
            margin="dense"
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            sx={inputSx}
          />
          <TextField
            margin="dense"
            label="Role"
            name="role"
            select
            value={formData.role}
            onChange={handleChange}
            fullWidth
            sx={inputSx}
          >
            <MenuItem value="Developer">Developer</MenuItem>
            <MenuItem value="Tester">Tester</MenuItem>
            <MenuItem value="Manager">Manager</MenuItem>
          </TextField>
          <TextField
            margin="dense"
            label="Avatar Color"
            name="avatarColor"
            value={formData.avatarColor}
            onChange={handleChange}
            type="color"
            fullWidth
            sx={{ mt: 1, ...inputSx }}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, bgcolor: "#FAFAFA", borderTop: "1px solid #E2E8F0", gap: 1 }}>
          <Button
            onClick={handleClose}
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 600,
              color: "#64748B",
              border: "1px solid #E2E8F0",
              "&:hover": { bgcolor: "#F1F5F9" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            variant="contained"
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 700,
              bgcolor: "#665fc9",
              boxShadow: "none",
              "&:hover": { bgcolor: "#665fc9", boxShadow: "none" },
            }}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserItems;