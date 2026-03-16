import React from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Chip,
  IconButton,
  Divider,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EmailIcon from "@mui/icons-material/Email";
import BadgeIcon from "@mui/icons-material/Badge";
import { useApp } from "../../Context";
import Avatar from "./Avatar";
import { grey } from "@mui/material/colors";

interface UserProfileProps {
  open: boolean;
  onClose: () => void;
}

const ROLE_COLORS: Record<string, string> = {
  Admin: "#665fc9",
  Manager: "#ef4444",
  Developer: "#3b82f6",
  Tester: "#f59e0b",
};

const UserProfile: React.FC<UserProfileProps> = ({ open, onClose }) => {
  const { currentUser } = useApp();

  if (!currentUser) return null;

  const roleColor = ROLE_COLORS[currentUser.role] || grey[600];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0 24px 48px rgba(0,0,0,0.2)",
        },
      }}
    >
      <Box
        sx={{
          height: 100,
          bgcolor: roleColor,
          position: "relative",
          display: "flex",
          justifyContent: "flex-end",
          p: 1,
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            color: "white",
            width: 24,
            height: 24,
            p:2,
            bgcolor: "rgba(0,0,0,0.1)",
            "&:hover": { bgcolor: "rgba(0,0,0,0.2)" },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ pt: 0, px: 4, pb: 4, mt: -6, textAlign: "center" }}>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <Box sx={{ p: 0.5, bgcolor: "white", borderRadius: "50%" }}>
            <Avatar user={currentUser} size={100} />
          </Box>
        </Box>

        <Typography
          variant="h5"
          fontWeight={800}
          sx={{ color: "#1e293b", mb: 0.5 }}
        >
          {currentUser.name}
        </Typography>

        <Chip
          label={currentUser.role}
          sx={{
            bgcolor: `${roleColor}15`,
            color: roleColor,
            fontWeight: 700,
            fontSize: "0.75rem",
            height: 24,
            mb: 3,
          }}
        />

        <Stack
          spacing={2}
          sx={{ textAlign: "left", bgcolor: grey[50], p: 2, borderRadius: 3 }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ color: roleColor, display: "flex" }}>
              <EmailIcon />
            </Box>
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: grey[500],
                  fontWeight: 600,
                  textTransform: "uppercase",
                }}
              >
                Email
              </Typography>
              <Typography variant="body2" fontWeight={600} color="#334155">
                {currentUser.email}
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ borderColor: grey[200] }} />
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ color: roleColor, display: "flex" }}>
              <BadgeIcon />
            </Box>
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: grey[500],
                  fontWeight: 600,
                  textTransform: "uppercase",
                }}
              >
                User ID
              </Typography>
              <Typography variant="body2" fontWeight={600} color="#334155">
                #{currentUser.id}
              </Typography>
            </Box>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfile;