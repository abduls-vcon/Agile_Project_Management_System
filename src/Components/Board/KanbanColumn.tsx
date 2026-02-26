import React from "react";
import { Paper, Typography, Box } from "@mui/material";
import UserStoryCard from "../UserStory/UserStoryCard";
import { useApp } from "../../Context";
import type { UserStory } from "../../Models";
import { useDragDrop } from "../../Hooks/useDragDrop";
import type { UserStoryStatus } from "../../Models";

interface KanbanProps {
  projectId: string;
  status: UserStoryStatus;
  stories: UserStory[];
  priority?:string
}

const KanbanColumn: React.FC<KanbanProps> = ({ projectId, status, stories }) => {
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
        width: 280,
        minWidth: 280,
        backgroundColor: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(4px)",
        display: "flex",
        flexDirection: "column",
        maxHeight: "80vh",
        overflowY: "auto",
        height: "auto", 
      }}
    >
      <Typography variant="h6" gutterBottom>
        {status}
      </Typography>

      <Box display="flex" flexDirection="column" gap={2}>
        {stories.map((story) => (
          <UserStoryCard
            key={story.id}
            story={story}
            projectId={projectId}
          />
        ))}
      </Box>
    </Paper>
  );
};

export default KanbanColumn;