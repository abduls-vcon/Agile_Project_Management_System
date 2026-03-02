import React from "react";
import { Paper, Typography, Box } from "@mui/material";
import UserStoryCard from "../UserStory/UserStoryCard";
import { useApp } from "../../Context";
import type { UserStory } from "../../Models";
import { useDragDrop } from "../../Hooks/useDragDrop";
import type { UserStoryStatus } from "../../Models";
import { green, grey, orange, yellow } from "@mui/material/colors";

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
        width: 270,
        backdropFilter: "blur(4px)",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        height: "auto",
        bgcolor:
        status === "Backlog"
          ? grey[100]
          : status === "In Progress"
          ? yellow[100]
          : status === "Testing"
          ? orange[100]
          : status === "Completed"
          ? green[100]
          : "white",
      }}
    >
      <Typography sx={{ fontWeight:"bold", color: grey[700], mb: 2 }}variant="h6" gutterBottom>
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