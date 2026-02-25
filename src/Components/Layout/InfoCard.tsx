import React from "react";
import { Card, CardContent, Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { grey } from "@mui/material/colors";

interface InfoCardProps {
  title: string;
  total: number;
  icon?: React.ReactNode;
  color?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({
  title,
  total,
  icon,
  color = "#1976d2",
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm")); // breakpoint for stacking

  return (
    <Card
      elevation={8}
      sx={{
        flex: "1 1 20%",
        width:220,
        borderRadius: 4,
        border: "1px solid",
        borderColor: grey[200],
        background: "linear-gradient(145deg, #ffffff, #f0f3f8)",
        transition: "transform 0.3s, box-shadow 0.3s",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 12px 25px rgba(0,0,0,0.15)",
        },
        cursor: "pointer",
        m:3.3 
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: isSmallScreen ? "column" : "row",
          alignItems: "center",
          gap: 1,
          height: "100%",
        }}
      >
        {icon && (
          <Box
            sx={{
              width: 70,
              height: 70,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: `${color}33`,
              color: color,
              fontSize: isSmallScreen ? 28 : 36,
              boxShadow: `0 4px 15px ${color}33`,
              mb: isSmallScreen ? 2 : 0,
            }}
          >
            {icon}
          </Box>
        )}

        <Box sx={{ flex: 1, textAlign: "center" }}>
          <Typography
            variant="subtitle2"
            fontWeight={600}
            color="text.secondary"
            sx={{ textTransform: "uppercase", letterSpacing: 1 }}
          >
            {title}
          </Typography>

          <Typography
            variant={"h4"}
            fontWeight="bold"
            sx={{ mt: 1, color: color }}
          >
            {total}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default InfoCard;