import React, { useState } from "react";
import { Card, CardContent, Typography, Chip, Box, Dialog } from "@mui/material";
import { grey } from "@mui/material/colors";
import { useApp } from "../../Context";
import type { UserStory } from "../../Models";
import { useDragDrop } from "../../Hooks/useDragDrop";
import Avatar from "../Layout/Avatar";
import UserStoryView from "./UserStoryView";

interface Props {
  story: UserStory;
  projectId: string;
}

const UserStoryCard: React.FC<Props> = ({ story, projectId }) => {
  const { users } = useApp();
  const { onDragStart } = useDragDrop();
  const [open, setOpen] = useState(false);

  const assignedUser = users.find((u) => u.id === story.assignedTo);

  return (
    <>
      <Card
        draggable
        onDragStart={onDragStart(story.id)}
        onClick={() => setOpen(true)}
        sx={{
          bgcolor: grey[50],
          border: `1px solid ${grey[500]}`,
          cursor: "pointer",
          "&:hover": { boxShadow: 4 },
          boxShadow:10
        }}
      >
        <CardContent>
          <Typography variant="subtitle1" fontWeight="bold">
            {story.title}
          </Typography>

          <Typography variant="body2" sx={{ mb: 1 }}>
            {story.description}
          </Typography>

          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Chip
              label={story.priority}
              size="small"
              color={
                story.priority === "High"
                  ? "error"
                  : story.priority === "Medium"
                  ? "warning"
                  : "success"
              }
            />

            {assignedUser && (
              <Avatar
                user={assignedUser}
                size={40}
              />
            )}
          </Box>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <UserStoryView story={story} projectId={projectId} />
      </Dialog>
    </>
  );
};

export default UserStoryCard;