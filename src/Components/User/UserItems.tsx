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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CodeIcon from "@mui/icons-material/Code";
import BugReportIcon from "@mui/icons-material/BugReport";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { blue} from "@mui/material/colors";
import { useApp } from "../../Context";
import type { User } from "../../Models";

interface UserItemsProps {
  users: User[];
}

const roleIcon = (role: string) => {
  switch (role) {
    case "Developer":
      return <CodeIcon color="primary" fontSize="large" />;
    case "Tester":
      return <BugReportIcon color="error" fontSize="large" />;
    case "Manager":
      return <ManageAccountsIcon color="secondary" fontSize="large" />;
    default:
      return null;
  }
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
      const updatedUser = { ...selectedUser, ...formData };
      updateUser(updatedUser);
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
        {users.map((user) => (
          <Grid sx={{ xs: 12, sm: 6, md: 4, lg: 3, mx:1}} key={user.id}>
            <Card
              sx={{
                display: "flex",
                px: 2,
                py: 1.5,
                borderRadius: 3,
                boxShadow: 6,
                borderLeft: `4px solid ${blue[700]}`,
                height: 80,
                width: 600,
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": { transform: "translateY(-3px)", boxShadow: 12 },
              }}
            >
              <ListItem
                disableGutters
                sx={{ display: "flex", alignItems: "center", width: "100%" }}
                secondaryAction={
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={() => handleOpen(user)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => deleteUser(user.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                }
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: user.avatarColor,
                      fontWeight: "bold",
                      width: 56,
                      height: 56,
                      fontSize: "1.5rem",
                    }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </Avatar>
                </ListItemAvatar>

                <ListItemText
                  sx={{ ml: 2 }}
                  primary={
                    <Typography sx={{ fontSize: 18 }} fontWeight="medium">
                      {user.name}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      {user.role}
                    </Typography>
                  }
                />

                <Box sx={{ ml: "auto", mr: 8 }}>{roleIcon(user.role)}</Box>
              </ListItem>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Role"
            name="role"
            select
            value={formData.role}
            onChange={handleChange}
            fullWidth
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
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleUpdate} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserItems;