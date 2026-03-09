import React, { useState, useMemo, useCallback } from "react";
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
  AvatarGroup,
} from "@mui/material";
import { grey, green, blue, yellow } from "@mui/material/colors";
import FreeCancellationSharpIcon from "@mui/icons-material/FreeCancellationSharp";
import { Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import type { Project } from "../../Models";
import { useApp } from "../../Context";
import UpdateProjectDialog from "./UpdateProjectDialog";
import { useDateFormat } from "../../Hooks/useDateFormat";

interface ProjectCardProps {
  project: Project;
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
  Active:    "#059669",
  "On Hold": "#D97706",
  Complete:  "#4F46E5",
};

const ProjectCard: React.FC<ProjectCardProps> = React.memo(({ project }) => {
  const { users } = useApp();
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  const owner = useMemo(
    () => users.find((u) => Number(u.id) === Number(project.ownerId)),
    [users, project.ownerId],
  );

  const formattedCreated = useDateFormat(project.createdDate);

  const handleEditClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenDialog(true);
  }, []);

  const handleCardDoubleClick = useCallback(() => {
    navigate(`/board/${project.id}`);
  }, [navigate, project.id]);

  const teamMembers = project.teamMembers ?? [];
  const headerGrad = STATUS_HEADER[project.status];

  return (
    <>
      <Card
        onDoubleClick={handleCardDoubleClick}
        elevation={0}
        sx={{
          width: 280,
          minHeight: 260,
          borderRadius: 3,
          overflow: "hidden",
          bgcolor: "#fff",
          border: `1px solid ${grey[200]}`,
          cursor: "pointer",
          transition: "transform 0.3s, box-shadow 0.3s",
          boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
          "&:hover": { transform: "translateY(-4px)", boxShadow: "0 10px 28px rgba(0,0,0,0.12)" },
        }}
      >
        <Box
          sx={{
            background: headerGrad,
            px: 2,
            py: 1.2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight={700}
            noWrap
            sx={{ color: "#fff", textShadow: "0 1px 3px rgba(0,0,0,0.2)", fontSize: 15, flex: 1, pr: 1 }}
          >
            {project.name}
          </Typography>

          <Edit
            onClick={handleEditClick}
            sx={{
              cursor: "pointer",
              color: "rgba(255,255,255,0.85)",
              fontSize: 19,
              flexShrink: 0,
              "&:hover": { color: "#fff" },
            }}
          />
        </Box>

        <CardContent sx={{ p: 2 }}>
          <Divider sx={{ mb: 1.5, borderColor: grey[100] }} />

          <Grid container spacing={1}>
            <Grid sx={{ xs: 6 }}>
              <InfoBox
                label="Status"
                value={project.status}
                bgColor={green[50]}
                borderColor={green[200]}
                color={green[700]}
              />
            </Grid>

            <Grid sx={{ xs: 6 }}>
              <InfoBox
                label="Stories"
                value={
                  <Typography variant="subtitle1" fontWeight="bold" color={blue[700]}>
                    {project.userStories.length}
                  </Typography>
                }
                bgColor={blue[50]}
                borderColor={blue[200]}
              />
            </Grid>

            <Grid sx={{ xs: 6 }}>
              <InfoBox
                label="Admin"
                value={owner?.name ?? "—"}
                bgColor={yellow[50]}
                borderColor={yellow[200]}
                color={yellow[800]}
              />
            </Grid>

            <Grid sx={{ xs: 6 }}>
              <InfoBox
                label="Users"
                value={
                  teamMembers.length > 0 ? (
                    <AvatarGroup
                      max={3}
                      sx={{
                        "& .MuiAvatar-root": {
                          width: 24,
                          height: 24,
                          fontSize: 12,
                          border: "2px solid white",
                          boxShadow: "0 0 0 1px rgba(0,0,0,0.08)",
                        },
                      }}
                    >
                      {teamMembers.map((user) => (
                        <Avatar key={user.id} sx={{ bgcolor: user.avatarColor }}>
                          {user.name.charAt(0).toUpperCase()}
                        </Avatar>
                      ))}
                    </AvatarGroup>
                  ) : (
                    <Typography variant="caption" color="text.secondary">
                      No Members
                    </Typography>
                  )
                }
                bgColor="#fff"
                borderColor={grey[200]}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 1.5, borderColor: grey[100] }} />

          <Stack direction="row" spacing={1} alignItems="center">
            <FreeCancellationSharpIcon sx={{ color: green[400], fontSize: 18 }} />
            <Typography variant="caption" fontWeight={500} color={grey[500]}>
              {formattedCreated}
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      {openDialog && (
        <UpdateProjectDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          project={project}
        />
      )}
    </>
  );
});

export default ProjectCard;