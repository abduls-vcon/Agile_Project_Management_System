import React, { useState } from "react";
import {Box, Card, CardContent, Typography, Chip, Dialog, Stack } from "@mui/material";
import { grey } from "@mui/material/colors";
import { useApp } from "../../Context";
import type { UserStory } from "../../Models";
import { useDragDrop } from "../../Hooks/useDragDrop";
import Avatar from "../Layout/Avatar";
import UserStoryView from "./UserStoryView";
import { Delete } from "@mui/icons-material";


interface Props {
  story: UserStory;
  projectId: string;
  priority?:string
}

const UserStoryCard: React.FC<Props> = ({ story, projectId}) => {
  const { users, deleteUserStory } = useApp();
  const { onDragStart } = useDragDrop();
  const [open, setOpen] = useState(false);

  const assignedUser = users.find((u) => u.id === story.assignedTo);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "error";
      case "Medium":
        return "warning";
      case "Low":
      default:
        return "success";
    }
  };

  return (
    <>
      <Card
        draggable
        onDragStart={onDragStart(story.id)}
        onClick={() => setOpen(true)}
        sx={{
          bgcolor: grey[50],
          border: `1px solid ${grey[300]}`,
          cursor: "pointer",
          borderRadius: 3,
          transition: "transform 0.3s, box-shadow 0.3s",
          "&:hover": { boxShadow: 8, transform: "translateY(-3px)" },
          mb: 2,
        }}
      >
        <CardContent>
          <Box sx={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
            <Typography variant="subtitle1" fontWeight="bold" color={grey[800]} gutterBottom>
            {story.title}
          </Typography>
          <Box sx={{display:"flex", justifyContent:"space-between", alignItems:"center", gap:3}}>
            <Delete sx={{color:grey[500]}} onClick={() => deleteUserStory(projectId,story.id)}/>
          </Box>
          </Box>
          <Typography variant="body2" sx={{ mb: 2, color: grey[600], minHeight: 40 }}>
            {story.description}
          </Typography>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Chip
              label={story.priority}
              size="small"
              color={getPriorityColor(story.priority)}
              sx={{ fontWeight: 600 }}
            />
            {assignedUser && <Avatar user={assignedUser} size={36} />} 
          </Stack>
        </CardContent>
      </Card>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <UserStoryView story={story} projectId={projectId} />
      </Dialog>
    </>
  );
};

export default UserStoryCard;