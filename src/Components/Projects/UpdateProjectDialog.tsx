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
  Typography,
  Chip,
  Avatar,
  Divider,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from "@mui/material";
import { useApp } from "../../Context";
import type { Project, User } from "../../Models";

interface Props {
  open: boolean;
  onClose: () => void;
  project: Project;
}

const statusOptions = ["Active", "Complete", "On Hold"];

const ROLE_COLORS: Record<string, string> = {
  Manager: "#ef4444",
  Developer: "#3b82f6",
  Tester: "#f59e0b",
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
            onChange={(e) => handleOwnerChange(Number(e.target.value))}
          >
            {users
              .filter((u) => u.role === "Manager")
              .map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  {u.name}
                </MenuItem>
              ))}
          </TextField>
          <Divider />
          <Box>
            <Typography variant="subtitle2" fontWeight={700} mb={1}>
              Team Members
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {teamMembers.map((member) => (
                <Chip
                  key={member.id}
                  avatar={
                    <Avatar sx={{ bgcolor: member.avatarColor, fontSize: 12 }}>
                      {member.name[0]}
                    </Avatar>
                  }
                  label={
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <span>{member.name}</span>
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
                  sx={{ bgcolor: "grey.100" }}
                />
              ))}
              {teamMembers.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  No team members yet.
                </Typography>
              )}
            </Box>
          </Box>
          {availableToAdd.length > 0 && (
            <FormControl fullWidth>
              <InputLabel>Add Team Members</InputLabel>
              <Select
                multiple
                value={[]}
                label="Add Team Members"
                onChange={(e) => handleAddMembers(e.target.value as number[])}
                renderValue={() => "Select members to add"}
              >
                {availableToAdd.map((u) => (
                  <MenuItem key={u.id} value={u.id}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      width="100%"
                      alignItems="center"
                    >
                      <Typography>{u.name}</Typography>
                      <Typography
                        sx={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: ROLE_COLORS[u.role] ?? "text.primary",
                          ml: 1,
                        }}
                      >
                        {u.role}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Select one or more users to add</FormHelperText>
            </FormControl>
          )}

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