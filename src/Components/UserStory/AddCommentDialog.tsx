import React, { useState, useCallback, useEffect } from "react";
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

const ACCENT = "#665fc9";

const AddCommentDialog: React.FC<AddCommentDialogProps> = ({
  open,
  onClose,
  storyId,
  projectId,
}) => {
  const { addUserStoryComment, currentUser } = useApp();
  const [commentText, setCommentText] = useState("");

  const isDisabled = !commentText.trim();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setCommentText(e.target.value);
    },
    []
  );

  const handleAddComment = useCallback(() => {
    if (!currentUser || isDisabled) return;

    addUserStoryComment(projectId, storyId, commentText.trim());
    setCommentText("");
    onClose();
  }, [addUserStoryComment, projectId, storyId, commentText, currentUser, onClose, isDisabled]);

  const handleClose = useCallback(() => {
    setCommentText("");
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) setCommentText("");
  }, [open]);

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <Box sx={{ p: 2, bgcolor: ACCENT }}>
        <Typography sx={{ fontWeight: 700, fontSize: 15, color: "#fff" }}>
          Add Comment
        </Typography>
      </Box>

      <DialogContent sx={{ pt: 2 }}>
        <TextField
          autoFocus
          label="Your comment"
          fullWidth
          multiline
          rows={4}
          value={commentText}
          onChange={handleChange}
        />
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} sx={{ color: grey[600] }}>
          Cancel
        </Button>

        <Button
          onClick={handleAddComment}
          variant="contained"
          disabled={isDisabled}
          sx={{
            bgcolor: ACCENT,
            "&:hover": { bgcolor: "#554eb0" },
          }}
        >
          Add Comment
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCommentDialog;