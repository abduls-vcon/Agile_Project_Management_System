import React from "react";
import { Paper, Typography, Box } from "@mui/material";
import UserStoryCard from "../UserStory/UserStoryCard";
import { useApp } from "../../Context";
import type { UserStory } from "../../Models";
import { useDragDrop } from "../../Hooks/useDragDrop";

type UserStoryStatus = "Backlog" | "In Progress" | "Testing" | "Completed";

interface Props {
  projectId: string;
  status: UserStoryStatus;
  stories: UserStory[];
}

const KanbanColumn: React.FC<Props> = ({ projectId, status, stories }) => {
  const { updateUserStoryStatus } = useApp();
  const { onDragOver, onDrop } = useDragDrop();

  const handleDrop = (storyId: string) => {
    updateUserStoryStatus(projectId, storyId, status);
  };

  return (
    <Paper
      onDragOver={onDragOver}
      onDrop={onDrop(handleDrop)}
      elevation={3}
      sx={{
        p: 2,
        minHeight: 500,
        width: 290,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(4px)",
      }}
    >
      <Typography variant="h6" gutterBottom>
        {status}
      </Typography>
      <Box display="flex" flexDirection="column" gap={2}>
        {stories.map((story) => (
          <UserStoryCard key={story.id} story={story} projectId={projectId} />
        ))}
      </Box>
    </Paper>
  );
};

export default KanbanColumn;
