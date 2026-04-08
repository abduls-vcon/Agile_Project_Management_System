import React, { useCallback, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack,
} from "@mui/material";
import { useApp } from "../../Context";
import type { User, Role } from "../../Models";
import Avatar from "../Layout/Avatar";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EmailIcon from "@mui/icons-material/Email";
import { grey, red } from "@mui/material/colors";

const ROLES: Role[] = ["Admin", "Manager", "Developer", "Tester"];

const ROLE_COLORS: Record<Role, string> = {
  Admin: "#665fc9",
  Manager: "#ef4444",
  Developer: "#3b82f6",
  Tester: "#f59e0b",
};

interface Props {
  users: User[];
}

const UserItems: React.FC<Props> = ({ users }) => {
  const { currentUser, deleteUser, updateUser } = useApp();
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("Developer");

  const handleEditClick = (user: User) => {
    setEditUser(user);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
  };

  const handleUpdate = () => {
    if (editUser && name && email) {
      updateUser({ ...editUser, name, email, role });
      setEditUser(null);
    }
  };

  const handleDelete = () => {
    if (deleteId !== null) {
      deleteUser(deleteId);
      setDeleteId(null);
    }
  };

const canEdit = useCallback((targetUser: User) => {
  if (!currentUser) return false
  if (currentUser.role === "Admin") return true
  if (currentUser.role === "Manager" && ["Developer","Tester"].includes(targetUser.role))
    return true
  return false
}, [currentUser])

  const canDelete = useCallback((targetUser: User) => {
    if (!currentUser) return false;
    if (currentUser.id === targetUser.id) return false;
    if (currentUser.role === "Admin") return true;
    return false;
  },[currentUser])

  return (
    <>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {users.map((user) => (
          <Grid key={user.id} sx={{ xs:12, sm:6, md:4, lg:3}}>
            <Paper
              elevation={2}
              sx={{
                width: "165px",
                p: 3,
                borderRadius: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
                transition: "all 0.3s ease",
                border: "1px solid transparent",
                bgcolor: "#fff",
                overflow: "hidden",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: `0 12px 24px rgba(0,0,0,0.08)`,
                  borderColor: ROLE_COLORS[user.role] || grey[300],
                },
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 6,
                  bgcolor: ROLE_COLORS[user.role] || grey[400],
                }}
              />

              <Box sx={{ position: "absolute", top: 16, right: 16 }}>
                <Chip
                  label={user.role}
                  size="small"
                  sx={{
                    bgcolor: `${ROLE_COLORS[user.role]}15`,
                    color: ROLE_COLORS[user.role],
                    fontWeight: 700,
                    fontSize: "0.65rem",
                    height: 22,
                  }}
                />
              </Box>

              <Box sx={{ mb: 2, mt: 2 }}>
                <Avatar user={user} size={80} />
              </Box>

              <Typography
                variant="h6"
                fontWeight={700}
                sx={{
                  color: "#1e293b",
                  mb: 0.5,
                  textAlign: "center",
                  fontSize: "1.05rem",
                }}
              >
                {user.name}
              </Typography>

              <Stack
                direction="row"
                spacing={0.8}
                alignItems="center"
                sx={{ mb: 3, color: grey[500] }}
              >
                <EmailIcon sx={{ fontSize: 15 }} />
                <Typography
                  variant="body2"
                  sx={{ fontSize: "0.8rem", fontWeight: 500 }}
                >
                  {user.email}
                </Typography>
              </Stack>

              {(canEdit(user) || canDelete(user)) && (
                <Stack direction="row" spacing={1} sx={{ width: "100%", mt: "auto" }}>
                  {canEdit(user) && (
                    <Button
                      variant="outlined"
                      fullWidth
                      size="small"
                      startIcon={<EditIcon sx={{ fontSize: 18 }} />}
                      onClick={() => handleEditClick(user)}
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: ROLE_COLORS[user.role],
                        borderColor: `${ROLE_COLORS[user.role]}50`,
                        "&:hover": {
                          borderColor: ROLE_COLORS[user.role],
                          bgcolor: `${ROLE_COLORS[user.role]}08`,
                        },
                      }}
                    >
                      Edit
                    </Button>
                  )}

                  {canDelete(user) && (
                    <IconButton
                      size="small"
                      onClick={() => setDeleteId(user.id)}
                      sx={{
                        color: red[400],
                        bgcolor: red[50],
                        borderRadius: 2,
                        border: `1px solid ${red[100]}`,
                        "&:hover": { bgcolor: red[100], color: red[600] },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </Stack>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={!!editUser}
        onClose={() => setEditUser(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: "1.1rem" }}>
          Edit User
        </DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          <Box
            component="form"
            sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 2.5 }}
          >
            <TextField
              label="Full Name"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              size="small"
              InputProps={{ sx: { borderRadius: 2 } }}
            />

            <TextField
              label="Email Address"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size="small"
              InputProps={{ sx: { borderRadius: 2 } }}
            />

            <TextField
              select
              label="Role"
              fullWidth
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              size="small"
              InputProps={{ sx: { borderRadius: 2 } }}
            >
              {(currentUser?.role === "Manager"
                ? ROLES.filter((r) => r !== "Admin" && r !== "Manager")
                : ROLES
              ).map((r) => (
                <MenuItem key={r} value={r} sx={{ fontSize: "0.9rem" }}>
                  {r}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2.5, pt: 1 }}>
          <Button
            onClick={() => setEditUser(null)}
            sx={{ color: grey[600], fontWeight: 600, textTransform: "none" }}
          >
            Cancel
          </Button>

          <Button
            onClick={handleUpdate}
            variant="contained"
            sx={{
              bgcolor: "#665fc9",
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 700,
              px: 3,
              "&:hover": { bgcolor: "#554eb0" },
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: "1.1rem" }}>
          Confirm Delete
        </DialogTitle>

        <DialogContent>
          <Typography color="text.secondary" fontSize="0.95rem">
            Are you sure you want to delete this user? This action cannot be undone.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 2.5 }}>
          <Button
            onClick={() => setDeleteId(null)}
            sx={{ color: grey[600], fontWeight: 600, textTransform: "none" }}
          >
            Cancel
          </Button>

          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700, px: 3 }}
          >
            Delete User
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserItems;