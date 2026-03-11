import React from "react";
import Grid from "@mui/material/Grid";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Stack,
  Divider,
  Avatar,
} from "@mui/material";
import { grey, blue, orange, green, red } from "@mui/material/colors";
import PestControlIcon from "@mui/icons-material/PestControl";
import DescriptionIcon from "@mui/icons-material/Description";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { useApp } from "../../Context";
import type { UserStory } from "../../Models";

interface UserStoryViewProps {
  story: UserStory;
  projectId: number;
  onClose: () => void;
}

interface InfoBoxProps {
  label: string;
  value: React.ReactNode;
  bgColor: string;
  borderColor: string;
  color?: string;
}

const InfoBox: React.FC<InfoBoxProps> = ({ label, value, bgColor, borderColor, color }) => (
  <Box
    sx={{
      p: 1.2,
      borderRadius: 2,
      bgcolor: bgColor,
      border: `1px solid ${borderColor}`,
      display: "flex",
      flexDirection: "column",
      gap: 0.5,
      transition: "transform 0.3s, box-shadow 0.2s",
      "&:hover": { transform: "translateY(-2px)", boxShadow: `0 4px 10px ${borderColor}99` },
      width: 95,
    }}
  >
    <Typography
      variant="caption"
      sx={{
        textTransform: "uppercase",
        color: "#94A3B8",
        fontWeight: 700,
        fontSize: 9.5,
        letterSpacing: "0.4px",
      }}
    >
      {label}
    </Typography>

    {typeof value === "string" || typeof value === "number" ? (
      <Chip
        label={value}
        size="small"
        sx={{
          mt: 0.5,
          bgcolor: "#fff",
          color: color,
          fontWeight: 700,
          border: `1px solid ${borderColor}`,
          fontSize: 11,
        }}
      />
    ) : (
      <Box mt={0.5}>{value}</Box>
    )}
  </Box>
);

const STATUS_HEADER: Record<string, string> = {
  "Backlog":     "#64748B",
  "In Progress": "#2563EB",
  "Testing":     "#D97706",
  "Completed":   "#059669",
};

const UserStoryView: React.FC<UserStoryViewProps> = ({ story, projectId }) => {
  const { users, projects } = useApp();

  const assignedUser = users.find((u) => u.id === story.assignedTo);
  const project = projects.find((p) => p.id === projectId);

  const getPriorityColors = () => {
    switch (story.priority) {
      case "Low":    return { bg: green[50],  border: green[200],  color: green[700] };
      case "Medium": return { bg: orange[50], border: orange[200], color: orange[800] };
      case "High":   return { bg: red[50],    border: red[200],    color: red[700] };
      default:       return { bg: grey[50],   border: grey[200],   color: grey[700] };
    }
  };

  const priorityColors = getPriorityColors();
  const headerColor = STATUS_HEADER[story.status] ?? "#64748B";

  return (
    <Card
      elevation={0}
      sx={{
        width: 598,
        minHeight: 260,
        borderRadius: 1,
        overflow: "hidden",
        bgcolor: "#fff",
        border: `1px solid ${grey[200]}`,
        cursor: "default",
        transition: "transform 0.3s, box-shadow 0.3s",
        boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
        "&:hover": { transform: "translateY(-4px)", boxShadow: "0 10px 28px rgba(0,0,0,0.12)" },
      }}
    >
      <Box
        sx={{
          background: headerColor,
          px: 2,
          py: 1.2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Typography
          variant="subtitle1"
          fontWeight={700}
          noWrap
          sx={{
            color: "#fff",
            textShadow: "0 1px 3px rgba(0,0,0,0.2)",
            fontSize: 15,
            flex: 1,
            pr: 1,
          }}
        >
          {story.title}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            px: 1,
            py: 0.4,
            borderRadius: 1,
            bgcolor: "rgba(255,255,255,0.15)",
            flexShrink: 0,
          }}
        >
          {story.isBug ? (
            <PestControlIcon sx={{ fontSize: 13, color: "#fff" }} />
          ) : (
            <DescriptionIcon sx={{ fontSize: 13, color: "#fff" }} />
          )}
          <Typography
            sx={{
              fontFamily: "monospace",
              fontSize: "0.62rem",
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {story.isBug ? "Bug" : "Story"}
          </Typography>
        </Box>
      </Box>

      <CardContent sx={{ p: 2 }}>
        <Divider sx={{ mb: 1.5, borderColor: grey[100] }} />

        <Grid container spacing={1}>
          <Grid sx={{ xs: 6 }}>
            <InfoBox
              label="Status"
              value={story.status}
              bgColor={green[50]}
              borderColor={green[200]}
              color={green[700]}
            />
          </Grid>

          <Grid sx={{ xs: 6 }}>
            <InfoBox
              label="Priority"
              value={story.priority}
              bgColor={priorityColors.bg}
              borderColor={priorityColors.border}
              color={priorityColors.color}
            />
          </Grid>

          {project && (
            <Grid sx={{ xs: 12}}>
              <InfoBox
                label="Project"
                value={project.name}
                bgColor={blue[50]}
                borderColor={blue[200]}
                color={blue[700]}
              />
            </Grid>
          )}
        </Grid>

        <Divider sx={{ my: 1.5, borderColor: grey[100] }} />

        {story.description && (
          <Typography
            variant="caption"
            color={grey[500]}
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              lineHeight: 1.6,
              mb: 1.5,
              fontSize: "0.72rem",
            }}
          >
            {story.description}
          </Typography>
        )}

        <Stack direction="row" spacing={1} alignItems="center">
          {assignedUser ? (
            <>
              <Avatar
                sx={{
                  bgcolor: assignedUser.avatarColor,
                  width: 22,
                  height: 22,
                  fontSize: 11,
                  fontWeight: 700,
                  border: "2px solid white",
                  boxShadow: "0 0 0 1px rgba(0,0,0,0.08)",
                }}
              >
                {assignedUser.name.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="caption" fontWeight={500} color={grey[500]}>
                {assignedUser.name}
              </Typography>
            </>
          ) : (
            <>
              <PersonOutlineIcon sx={{ color: grey[400], fontSize: 18 }} />
              <Typography variant="caption" fontWeight={500} color={grey[400]}>
                Unassigned
              </Typography>
            </>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default UserStoryView;