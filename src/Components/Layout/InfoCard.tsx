import React from "react";
import {Box, Paper, Grid, Typography } from "@mui/material";

interface InfoCardProps {
  title: string;
  total: number;
  icon?: React.ReactNode;
  color?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ color, icon, total, title }) => {
  return (
    <Grid sx={{xs:12, sm:6, md:4, lg:2}}>
      <Paper
        sx={{
          m: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
          borderRadius: 3,
          bgcolor: color,
          color: "#fff",
          height: 140,
          width: 140,
          transition: "transform 0.3s, box-shadow 0.3s",
          "&:hover": { transform: "translateY(-5px)", boxShadow: 8 },
        }}
      >
        {icon && <Box mb={1}>{icon}</Box>}
        <Typography variant="h5" fontWeight={700}>
          {total}
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{ textTransform: "uppercase", opacity: 0.8, textAlign: "center" }}
        >
          {title}
        </Typography>
      </Paper>
    </Grid>
  );
};

export default InfoCard;