import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Typography,
  Chip,
  Avatar,
  Divider,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { useApp } from "../../Context";
import type { Project, User } from "../../Models";

interface Props {
  open: boolean;
  onClose: () => void;
  project: Project;
}

const statusOptions = ["Active", "Complete", "On Hold"];

const ROLE_COLORS: Record<string, string> = {
  Manager:   "#ef4444",
  Developer: "#3b82f6",
  Tester:    "#f59e0b",
};

const STATUS_HEADER: Record<string, string> = {
  Active:    "#059669",
  "On Hold": "#D97706",
  Complete:  "#4F46E5",
};

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    fontSize: 13,
  },
  "& .MuiInputLabel-root": {
    fontSize: 13,
  },
};

const UpdateProjectDialog: React.FC<Props> = ({ open, onClose, project }) => {
  const { updateProject, users } = useApp();

  const [name, setName] = useState(project.name);
  const [status, setStatus] = useState(project.status);
  const [ownerId, setOwnerId] = useState(project.ownerId);
  const [teamMembers, setTeamMembers] = useState<User[]>(project.teamMembers);

  useEffect(() => {
    if (open) {
      setName(project.name);
      setStatus(project.status);
      setOwnerId(project.ownerId);
      setTeamMembers(project.teamMembers);
    }
  }, [open, project]);

  const handleOwnerChange = (newOwnerId: number) => {
    const selectedOwner = users.find((u) => u.id === newOwnerId);
    if (!selectedOwner) return;
    setTeamMembers((prev) => {
      const withoutOldOwner = prev.filter((m) => m.id !== ownerId);
      const alreadyIn = withoutOldOwner.some((m) => m.id === newOwnerId);
      return alreadyIn ? withoutOldOwner : [...withoutOldOwner, selectedOwner];
    });
    setOwnerId(newOwnerId);
  };

  const handleAddMembers = (userIds: number[]) => {
    const toAdd = userIds
      .map((id) => users.find((u) => u.id === id))
      .filter((u): u is User => !!u && !teamMembers.some((m) => m.id === u.id));
    if (toAdd.length > 0) setTeamMembers((prev) => [...prev, ...toAdd]);
  };

  const handleRemoveMember = (userId: number) => {
    if (userId === ownerId) {
      alert("Cannot remove the project owner from the team.");
      return;
    }
    setTeamMembers((prev) => prev.filter((m) => m.id !== userId));
  };

  const handleUpdate = () => {
    updateProject({ ...project, name, status, ownerId, teamMembers });
    onClose();
  };

  const availableToAdd = users.filter(
    (u) => !teamMembers.some((m) => m.id === u.id),
  );

  const headerColor = STATUS_HEADER[status] ?? "#2563EB";

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
          background: headerColor,
          px: 3,
          py: 1.5,
          display: "flex",
          alignItems: "center",
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
          Update Project
        </Typography>
      </Box>

      <DialogContent sx={{ px: 3, pt: 2.5, pb: 1 }}>
        <Box display="flex" flexDirection="column" gap={2}>

          <TextField
            label="Project Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={inputSx}
          />

          <TextField
            select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            fullWidth
            sx={inputSx}
          >
            {statusOptions.map((s) => (
              <MenuItem key={s} value={s}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: STATUS_HEADER[s] ?? grey[400],
                    }}
                  />
                  {s}
                </Box>
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Owner"
            value={ownerId}
            onChange={(e) => handleOwnerChange(Number(e.target.value))}
            fullWidth
            sx={inputSx}
          >
            {users
              .filter((u) => u.role === "Manager")
              .map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar
                      sx={{
                        bgcolor: u.avatarColor,
                        width: 22,
                        height: 22,
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      {u.name[0]}
                    </Avatar>
                    {u.name}
                  </Box>
                </MenuItem>
              ))}
          </TextField>

          <Divider sx={{ borderColor: grey[100] }} />

          {/* Team Members */}
          <Box>
            <Typography
              variant="caption"
              sx={{
                textTransform: "uppercase",
                color: "#94A3B8",
                fontWeight: 700,
                fontSize: 9.5,
                letterSpacing: "0.4px",
              }}
            >
              Team Members
            </Typography>

            <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
              {teamMembers.map((member) => (
                <Chip
                  key={member.id}
                  avatar={
                    <Avatar sx={{ bgcolor: member.avatarColor, fontSize: 11 }}>
                      {member.name[0]}
                    </Avatar>
                  }
                  label={
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <span style={{ fontSize: 12, fontWeight: 600 }}>{member.name}</span>
                      <Typography
                        component="span"
                        sx={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: ROLE_COLORS[member.role] ?? "text.secondary",
                        }}
                      >
                        {member.role}
                      </Typography>
                    </Box>
                  }
                  onDelete={
                    member.id !== ownerId
                      ? () => handleRemoveMember(member.id)
                      : undefined
                  }
                  sx={{
                    bgcolor: grey[50],
                    border: `1px solid ${grey[200]}`,
                    borderRadius: "8px",
                    transition: "box-shadow 0.2s",
                    "&:hover": { boxShadow: `0 2px 8px ${grey[300]}` },
                  }}
                />
              ))}

              {teamMembers.length === 0 && (
                <Typography variant="caption" color="text.secondary">
                  No team members yet.
                </Typography>
              )}
            </Box>
          </Box>

          {/* Add Members */}
          {availableToAdd.length > 0 && (
            <FormControl fullWidth sx={inputSx}>
              <InputLabel sx={{ fontSize: 13 }}>Add Team Members</InputLabel>
              <Select
                multiple
                value={[]}
                label="Add Team Members"
                onChange={(e) => handleAddMembers(e.target.value as number[])}
                renderValue={() => "Select members to add"}
                sx={{ borderRadius: "10px", fontSize: 13 }}
              >
                {availableToAdd.map((u) => (
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
                      <Typography sx={{ fontSize: 13, flex: 1 }}>{u.name}</Typography>
                      <Chip
                        label={u.role}
                        size="small"
                        sx={{
                          fontSize: 10,
                          fontWeight: 700,
                          height: 20,
                          bgcolor: `${ROLE_COLORS[u.role]}18`,
                          color: ROLE_COLORS[u.role] ?? "text.primary",
                          border: `1px solid ${ROLE_COLORS[u.role]}40`,
                          "& .MuiChip-label": { px: 1 },
                        }}
                      />
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText sx={{ fontSize: 11 }}>
                Select one or more users to add
              </FormHelperText>
            </FormControl>
          )}

        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: `1px solid ${grey[100]}`,
          gap: 1,
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            borderRadius: "8px",
            color: grey[500],
            fontWeight: 600,
            fontSize: 13,
            px: 2,
            "&:hover": { bgcolor: grey[100], color: grey[700] },
          }}
        >
          Cancel
        </Button>

        <Button
          onClick={handleUpdate}
          variant="contained"
          sx={{
            borderRadius: "8px",
            fontWeight: 700,
            fontSize: 13,
            px: 3,
            background: headerColor,
            boxShadow: `0 2px 12px ${headerColor}40`,
            "&:hover": {
              background: headerColor,
              filter: "brightness(0.9)",
              boxShadow: `0 4px 16px ${headerColor}60`,
            },
          }}
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateProjectDialog;