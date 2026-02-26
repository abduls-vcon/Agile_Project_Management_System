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

const InfoBox: React.FC<InfoBoxProps> = ({
  label,
  value,
  bgColor,
  borderColor,
  color,
}) => (
  <Box
    sx={{
      p: 2,
      borderRadius: 3,
      bgcolor: bgColor,
      border: `1px solid ${borderColor}`,
      display: "flex",
      flexDirection: "column",
      gap: 1,
      width: 140,
      transition: "transform 0.3s",
      "&:hover": { transform: "translateY(-3px)" },
    }}
  >
    <Typography
      variant="caption"
      sx={{
        textTransform: "uppercase",
        color: "text.secondary",
        fontWeight: 600,
      }}
    >
      {label}
    </Typography>
    {typeof value === "string" || typeof value === "number" ? (
      <Chip
        label={value}
        sx={{
          mt: 1,
          bgcolor: grey[50],
          color: color,
          fontWeight: "bold",
          border: `1px solid ${borderColor}`,
          fontSize: 15,
        }}
      />
    ) : (
      <Box mt={1}>{value}</Box>
    )}
  </Box>
);

const ProjectCard: React.FC<ProjectCardProps> = React.memo(({ project }) => {
  const { users } = useApp();
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  const owner = useMemo(
    () => users.find((u) => Number(u.id) === Number(project.ownerId)),
    [users, project.ownerId]
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

  return (
    <>
      <Card
        onDoubleClick={handleCardDoubleClick}
        elevation={8}
        sx={{
          width: 400,
          height: 380,
          borderRadius: 4,
          bgcolor: grey[50],
          border: `1px solid ${grey[200]}`,
          cursor: "pointer",
          transition: "transform 0.3s, box-shadow 0.3s",
          "&:hover": { transform: "translateY(-5px)", boxShadow: 10 },
        }}
      >
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight={600} color={blue[700]}>
              {project.name}
            </Typography>
            <Edit
              sx={{
                cursor: "pointer",
                color: blue[600],
                "&:hover": { color: blue[800] },
              }}
              onClick={handleEditClick}
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box display="flex" justifyContent="center">
            <Grid container spacing={2} justifyContent="center">
              <Grid sx={{ width: 170 }}>
                <InfoBox
                  label="Status"
                  value={project.status}
                  bgColor={green[50]}
                  borderColor={green[200]}
                  color={green[700]}
                />
              </Grid>

              <Grid sx={{ width: 170 }}>
                <InfoBox
                  label="User Stories"
                  value={
                    <Typography variant="h5" fontWeight="bold" color={blue[700]}>
                      {project.userStories.length}
                    </Typography>
                  }
                  bgColor={blue[50]}
                  borderColor={blue[200]}
                  color={blue[700]}
                />
              </Grid>

              <Grid sx={{ width: 170 }}>
                <InfoBox
                  label="Admin"
                  value={owner?.name ?? "—"}
                  bgColor={yellow[50]}
                  borderColor={yellow[200]}
                  color={yellow[800]}
                />
              </Grid>

              <Grid sx={{ width: 170 }}>
                <InfoBox
                  label="Users"
                  value={
                    teamMembers.length > 0 ? (
                      <AvatarGroup max={3} sx={{ justifyContent: "flex-start" }}>
                        {teamMembers.map((user) => (
                          <Avatar
                            key={user.id}
                            sx={{
                              bgcolor: user.avatarColor,
                              width: 40,
                              height: 40,
                              fontSize: 14,
                              border: "2px solid white",
                            }}
                          >
                            {user.name.charAt(0).toUpperCase()}
                          </Avatar>
                        ))}
                      </AvatarGroup>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No Team Members
                      </Typography>
                    )
                  }
                  bgColor="#fff"
                  borderColor={grey[200]}
                />
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={1} alignItems="center">
              <FreeCancellationSharpIcon sx={{ color: green[400] }} />
              <Typography variant="body2" fontWeight={500} color={grey[600]}>
                {formattedCreated}
              </Typography>
            </Stack>
          </Box>
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