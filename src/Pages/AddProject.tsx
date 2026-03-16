import React, { useCallback, useMemo, useState } from "react";
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
import { useApp } from "../Context";
import type { Project, User } from "../Models";

interface AddProjectProps {
  open: boolean;
  onClose: () => void;
}

const statusOptions = ["Active", "Complete", "On Hold"];

const ROLE_COLORS: Record<string, string> = {
  Manager: "#ef4444",
  Developer: "#3b82f6",
  Tester: "#f59e0b",
};

const STATUS_HEADER: Record<string, string> = {
  Active: "#059669",
  "On Hold": "#D97706",
  Complete: "#4F46E5",
};

const inputSx = {
  "& .MuiOutlinedInput-root": { borderRadius: "10px", fontSize: 13 },
  "& .MuiInputLabel-root": { fontSize: 13 },
};

const AddProject: React.FC<AddProjectProps> = ({ open, onClose }) => {
  const { addProject, users } = useApp();
  const today = new Date().toISOString().split("T")[0];

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Active");
  const [ownerId, setOwnerId] = useState<number | "">("");
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [createdDate, setCreatedDate] = useState(today);

  const handleOwnerChange = useCallback(
    (newOwnerId: number) => {
      const selectedOwner = users.find((user) => user.id === newOwnerId);
      if (!selectedOwner) return;

      setOwnerId(newOwnerId);

      setTeamMembers((prevMembers) => {
        if (prevMembers.some((member) => member.id === newOwnerId)) {
          return prevMembers;
        }
        return [...prevMembers, selectedOwner];
      });
    },
    [users],
  );

  const handleAddMembers = useCallback(
    (userIds: number[]) => {
      const toAdd = userIds
        .map((id) => users.find((u) => u.id === id))
        .filter(
          (u): u is User => !!u && !teamMembers.some((m) => m.id === u.id),
        );
      if (toAdd.length > 0) setTeamMembers((prev) => [...prev, ...toAdd]);
    },
    [teamMembers],
  );

  const handleRemoveMember = useCallback(
    (id: number) => {
      if (id === ownerId) {
        alert("Cannot remove project owner.");
        return;
      }
      setTeamMembers((prev) => prev.filter((m) => m.id !== id));
    },
    [users, teamMembers],
  );

  const handleSave = useCallback(() => {
    if (!name || ownerId === "") return;
    const newProject: Project = {
      id: Date.now(),
      name,
      description,
      status,
      ownerId,
      teamMembers,
      userStories: [],
      createdDate: new Date(createdDate).toISOString(),
    };
    addProject(newProject);
    setName("");
    setDescription("");
    setStatus("Active");
    setOwnerId("");
    setTeamMembers([]);
    setCreatedDate(today);
    onClose();
  }, [users, teamMembers]);

  const availableUsers = useMemo(
    () => users.filter((u) => !teamMembers.some((m) => m.id === u.id)),
    [users, teamMembers]
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
          Add Project
        </Typography>
      </Box>

      <DialogContent sx={{ px: 3, pt: 2.5, pb: 1 }}>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Project Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            sx={inputSx}
          />

          <TextField
            label="Description"
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
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
            type="date"
            label="Created Date"
            value={createdDate}
            onChange={(e) => setCreatedDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            sx={inputSx}
          />

          <TextField
            select
            label="Owner"
            value={ownerId}
            onChange={(e) => handleOwnerChange(Number(e.target.value))}
            fullWidth
            sx={inputSx}
          >
            {users
              .filter((u) => u.role === "Manager" || u.role === "Admin")
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
                      <span style={{ fontSize: 12, fontWeight: 600 }}>
                        {member.name}
                      </span>
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

          {availableUsers.length > 0 && (
            <FormControl fullWidth sx={inputSx}>
              <InputLabel sx={{ fontSize: 13 }}>Add Members</InputLabel>
              <Select
                multiple
                value={[]}
                label="Add Members"
                onChange={(e) => handleAddMembers(e.target.value as number[])}
                renderValue={() => "Select members to add"}
                sx={{ borderRadius: "10px", fontSize: 13 }}
              >
                {availableUsers.map((u) => (
                  <MenuItem key={u.id} value={u.id}>
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={1.5}
                      width="100%"
                    >
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
                      <Typography sx={{ fontSize: 13, flex: 1 }}>
                        {u.name}
                      </Typography>
                      <Chip
                        label={u.role}
                        size="small"
                        sx={{
                          fontSize: 10,
                          fontWeight: 700,
                          height: 20,
                          bgcolor: `${ROLE_COLORS[u.role]}18`,
                          color: ROLE_COLORS[u.role],
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
          onClick={handleSave}
          variant="contained"
          sx={{
            borderRadius: "8px",
            fontWeight: 700,
            fontSize: 13,
            px: 3,
            background: headerColor,
            boxShadow: `0 2px 12px ${headerColor}40`,
            "&:hover": {
              filter: "brightness(0.9)",
              boxShadow: `0 4px 16px ${headerColor}60`,
            },
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProject;
