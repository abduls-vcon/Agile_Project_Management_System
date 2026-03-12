import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { useApp } from "../../Context";

interface AddCommentDialogProps {
  open: boolean;
  onClose: () => void;
  storyId: number;
  projectId: number;
}

const AddCommentDialog: React.FC<AddCommentDialogProps> = ({
  open,
  onClose,
  storyId,
  projectId,
}) => {
  const [commentText, setCommentText] = useState("");
  const { addUserStoryComment } = useApp();

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    addUserStoryComment(projectId, storyId, commentText);
    setCommentText("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <Box sx={{ p: 2, bgcolor: "#665fc9" }}>
        <Typography sx={{ fontWeight: 700, fontSize: 15, color: "#fff" }}>
          Add Comment
        </Typography>
      </Box>
      <DialogContent sx={{ pt: "20px !important" }}>
        <TextField
          autoFocus
          margin="dense"
          label="Your comment"
          type="text"
          fullWidth
          multiline
          rows={4}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} sx={{ color: grey[600] }}>
          Cancel
        </Button>
        <Button
          onClick={handleAddComment}
          variant="contained"
          sx={{ background: "#665fc9" }}
        >
          Add Comment
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCommentDialog;