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
        borderRadius: 3,
        overflow: "hidden",
        transition: "transform 0.3s, box-shadow 0.3s",
        "&:hover": { boxShadow: 12, transform: "translateY(-3px)" },
      }}
    >
      <Box
        sx={{
          height: 6,
          background: `linear-gradient(90deg, ${getStatusColor()} 0%, ${getStatusColor()}90 100%)`,
        }}
      />

      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom color="grey.800">
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
              minWidth: 90,
            }}
          />
          <Chip
            label={story.priority}
            color={getPriorityColor()}
            variant="outlined"
            sx={{
              fontWeight: 600,
              minWidth: 90,
            }}
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
                width: 48,
                height: 48,
                fontWeight: 600,
                fontSize: 18,
              }}
            >
              {assignedUser.name.charAt(0)}
            </Avatar>

            <Box>
              <Typography variant="caption" color="text.secondary">
                Assigned To
              </Typography>
              <Typography fontWeight={600} color="grey.800">
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