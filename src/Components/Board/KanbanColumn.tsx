import React from "react";
import { Paper, Typography, Box, Chip } from "@mui/material";
import UserStoryCard from "../UserStory/UserStoryCard";
import { useApp } from "../../Context";
import type { UserStory } from "../../Models";
import { useDragDrop } from "../../Hooks/useDragDrop";
import type { UserStoryStatus } from "../../Models";
import { green, grey, orange, yellow } from "@mui/material/colors";

interface KanbanProps {
  projectId: number;
  status: UserStoryStatus;
  stories: UserStory[];
  priority: string;
}

const statusColors: Record<UserStoryStatus | string, string> = {
  "Backlog":     grey[100],
  "In Progress": yellow[100],
  "Testing":     orange[100],
  "Completed":   green[100],
};

const STATUS_CONFIG: Record<string, { headerBg: string; headerText: string; dot: string; border: string }> = {
  Backlog:       { headerBg: "#E2E8F0", headerText: "#334155", dot: "#64748B", border: "#CBD5E1" },
  "In Progress": { headerBg: "#FEF3C7", headerText: "#92400E", dot: "#F59E0B", border: "#FCD34D" },
  Testing:       { headerBg: "#FFEDD5", headerText: "#9A3412", dot: "#F97316", border: "#FDBA74" },
  Completed:     { headerBg: "#D1FAE5", headerText: "#065F46", dot: "#10B981", border: "#6EE7B7" },
};

const KanbanColumn: React.FC<KanbanProps> = ({ projectId, status, stories }) => {
  const { updateUserStoryStatus } = useApp();
  const { onDragOver, onDrop } = useDragDrop();

  const handleDrop = (storyId: string) => {
    updateUserStoryStatus(projectId, Number(storyId), status);
  };

  const cfg = STATUS_CONFIG[status] ?? { headerBg: "#F1F5F9", headerText: "#475569", dot: "#94A3B8", border: "#E2E8F0" };

  return (
    <Paper
      onDragOver={onDragOver}
      onDrop={onDrop(handleDrop)}
      elevation={0}
      sx={{
        width: 270,
        backdropFilter: "blur(4px)",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        height: "auto",
        bgcolor: statusColors[status] || "white",
        border: `1.5px solid ${cfg.border}`,
        borderRadius: "14px",
        overflow: "hidden",
        boxShadow: `0 2px 12px ${cfg.dot}22`,
      }}
    >
      <Box
        sx={{
          px: 2,
          py: 1.2,
          bgcolor: cfg.headerBg,
          borderBottom: `1.5px solid ${cfg.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: cfg.dot,
            }}
          />
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: cfg.headerText, fontSize: 14 }}
          >
            {status}
          </Typography>
        </Box>

        <Chip
          label={stories.length}
          size="small"
          sx={{
            height: 20,
            fontSize: 11,
            fontWeight: 700,
            bgcolor: "#fff",
            color: cfg.headerText,
            border: `1px solid ${cfg.border}`,
            "& .MuiChip-label": { px: 1 },
          }}
        />
      </Box>

      {/* Cards */}
      <Box display="flex" flexDirection="column" gap={2} sx={{ p: 2 }}>
        {stories.map((story) => (
          <UserStoryCard
            key={story.id}
            story={story}
            projectId={projectId}
          />
        ))}

        {stories.length === 0 && (
          <Box
            sx={{
              minHeight: 70,
              borderRadius: "10px",
              border: `1.5px dashed ${cfg.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography sx={{ fontSize: 12, color: cfg.dot, fontWeight: 500, opacity: 0.7 }}>
              Drop here
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default KanbanColumn;