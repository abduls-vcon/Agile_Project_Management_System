import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Avatar,
  Divider,
  Stack,
} from "@mui/material";
import { useApp } from "../../Context";
import type { UserStory } from "../../Models";

interface Props {
  story: UserStory;
  projectId: string;
}

const UserStoryView: React.FC<Props> = ({ story, projectId }) => {
  const { users, projects } = useApp();

  const assignedUser = users.find((u) => u.id === story.assignedTo);
  const project = projects.find((p) => p.id === projectId);

  const getStatusColor = () => {
    switch (story.status) {
      case "Backlog":
        return "#9e9e9e";
      case "In Progress":
        return "#1976d2";
      case "Testing":
        return "#ed6c02";
      case "Completed":
        return "#2e7d32";
      default:
        return "#9e9e9e";
    }
  };

  const getPriorityColor = () => {
    switch (story.priority) {
      case "Low":
        return "success";
      case "Medium":
        return "warning";
      case "High":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Card
      sx={{
        boxShadow: 6,
        overflow: "hidden",
        transition: "0.3s",
        "&:hover": { boxShadow: 10 },
      }}
    >
      <Box
        sx={{
          height: 6,
          bgcolor: getStatusColor(),
        }}
      />

      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          {story.title}
        </Typography>

        {project && (
          <Chip
            label={project.name}
            size="small"
            sx={{
              mb: 2,
              bgcolor: "rgba(25,118,210,0.08)",
              fontWeight: 500,
            }}
          />
        )}

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 3, lineHeight: 1.6 }}
        >
          {story.description}
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Stack direction="row" spacing={2} mb={3}>
          <Chip
            label={story.status}
            sx={{
              bgcolor: getStatusColor(),
              color: "#fff",
              fontWeight: 600,
            }}
          />

          <Chip
            label={story.priority}
            color={getPriorityColor()}
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
        </Stack>

        {assignedUser && (
          <Box
            display="flex"
            alignItems="center"
            gap={2}
            sx={{
              p: 2,
              bgcolor: "grey.100",
              borderRadius: 3,
            }}
          >
            <Avatar
              sx={{
                bgcolor: assignedUser.avatarColor,
                width: 40,
                height: 40,
                fontWeight: 600,
              }}
            >
              {assignedUser.name.charAt(0)}
            </Avatar>

            <Box>
              <Typography variant="body2" color="text.secondary">
                Assigned To
              </Typography>
              <Typography fontWeight={600}>
                {assignedUser.name}
              </Typography>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default UserStoryView;