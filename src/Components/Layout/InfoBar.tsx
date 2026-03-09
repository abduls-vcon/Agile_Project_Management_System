import React from "react";
import { Box, Typography, Stack } from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import useDateAndTime from "../../Hooks/useDateAndTime";

const InfoBar: React.FC = () => {
  const clock = useDateAndTime();

  return (
    <Box
      sx={{
        px: 3,
        py: 1.5,
        width: "97%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        bgcolor: "#EEF2FF",
        flexWrap: "wrap",
        gap: 1,
      }}
    >
      <Stack
        direction="row"
        spacing={1.2}
        alignItems="center"
        sx={{
          px: 2,
          py: 0.6,
          borderRadius: "20px",
          bgcolor: "rgba(255,255,255,0.18)",
          border: "2px solid #665FC9",
          backdropFilter: "blur(6px)",
          minWidth: 160,
        }}
      >
        <BusinessIcon sx={{ fontSize: 20, color: "#665FC9" }} />
        <Typography
          variant="body2"
          fontWeight={600}
          sx={{ color: "#665FC9", whiteSpace: "nowrap", fontSize: 13 }}
        >
          vConstruct, Pune
        </Typography>
      </Stack>

      <Stack
        direction="row"
        spacing={1.2}
        alignItems="center"
        sx={{
          px: 2,
          py: 0.6,
          borderRadius: "20px",
          bgcolor: "rgba(255,255,255,0.18)",
          border: "2px solid #665FC9",
          backdropFilter: "blur(6px)",
          minWidth: 160,
          justifyContent: "center",
        }}
      >
        <AccessTimeIcon sx={{ fontSize: 18, color: "#665FC9" }} />
        <Stack direction="row" spacing={0.5}>
          <Typography variant="body2" fontWeight={700} sx={{ color: "#665FC9", fontSize: 13 }}>
            {clock.toLocaleDateString()}
          </Typography>
          <Typography variant="body2" fontWeight={700} sx={{ color: "#665FC9", fontSize: 13 }}>
            {clock.toLocaleTimeString()}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

export default InfoBar;