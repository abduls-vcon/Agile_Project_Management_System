import React from "react";
import { Box, Typography, Stack } from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { blue, grey } from "@mui/material/colors";

import useDateAndTime from "../../Hooks/useDateAndTime";

const InfoBar: React.FC = () => {
  const clock = useDateAndTime();

  return (
    <Box
      sx={{
        px: 3,
        py: 2,
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        bgcolor: grey[50],
        boxShadow: 2,
        border: `1px solid ${grey[200]}`
      }}
    >
      {/* Organization Section */}
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{
          px: 2,
          height: 40,
          borderRadius: "0 25px 25px 0",
          bgcolor: blue[100],
          border: `1px solid ${blue[400]}`
        }}
      >
        <BusinessIcon sx={{ fontSize: 24, color: blue[700] }} />

        <Typography
          variant="body2"
          fontWeight={500}
          sx={{ color: blue[700] }}
        >
          vConstruct, Pune
        </Typography>
      </Stack>

      {/* Date & Time Section */}
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{
          px: 2,
          height: 40,
          borderRadius: "25px 0 0 25px",
          bgcolor: blue[100],
          border: `1px solid ${blue[400]}`
        }}
      >
        <AccessTimeIcon sx={{ fontSize: 22, color: blue[700] }} />

        <Stack direction="row" spacing={1}>
          <Typography
            variant="body2"
            fontWeight={500}
            sx={{ color: blue[700] }}
          >
            {clock.toLocaleDateString()}
          </Typography>

          <Typography
            variant="body2"
            fontWeight={500}
            sx={{ color: blue[700] }}
          >
            {clock.toLocaleTimeString()}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

export default InfoBar;