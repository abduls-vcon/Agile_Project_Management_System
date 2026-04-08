import React from "react";
import { Box, Typography, type SxProps, type Theme } from "@mui/material";
import { blue } from "@mui/material/colors";

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  boxSx?: SxProps<Theme>;
  titleSx?: SxProps<Theme>;
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  children,
  boxSx,
  titleSx,
}) => {
  return (
    <Box
      sx={{
        mt: 5,
        bgcolor: "white",
        p: 3,
        borderRadius: 3,
        border: "1px solid lightBlue",
        ...boxSx,
      }}
    >
      <Typography
        sx={{
          color: "#665FC9",
          fontWeight: "bold",
          bgcolor: blue[50],
          px: 2,
          py: 1,
          borderRadius: 10,
          border: "1px solid #665FC9",
          fontSize: 10,
          letterSpacing: 1,
          ...titleSx,
        }}
      >
        {title}
      </Typography>
      {children}
    </Box>
  );
};

export default ChartCard;