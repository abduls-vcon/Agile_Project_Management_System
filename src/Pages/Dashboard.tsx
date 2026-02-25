import React from "react";
import Navbar from "../Components/Layout/Navbar";
import Sidebar from "../Components/Layout/Sidebar";
import InfoBar from "../Components/Layout/InfoBar";
import InfoCard from "../Components/Layout/InfoCard";

import NoteAltIcon from "@mui/icons-material/NoteAlt";
import Diversity3Icon from "@mui/icons-material/Diversity3";

import { Box, Grid, Typography } from "@mui/material";
import { blue, green, yellow, grey, red, purple } from "@mui/material/colors";

import { useApp } from "../Context";
import { BugReport, DeveloperBoard, ManageAccounts } from "@mui/icons-material";

const Dashboard: React.FC = () => {
  const { users, projects } = useApp();
  const totalDevelopers = users.filter(
    (user) => user.role === "Developer",
  ).length;
  const totalTesters = users.filter((user) => user.role === "Tester").length;
  const totalManager = users.filter((user) => user.role === "Manager").length;

  const dashboardCards = [
    {
      title: "Projects",
      total: projects.length,
      icon: <NoteAltIcon />,
      color: blue[600],
    },
    {
      title: "Users",
      total: users.length,
      icon: <Diversity3Icon />,
      color: green[600],
    },
    {
      title: "Developers",
      total: totalDevelopers,
      icon: <DeveloperBoard />,
      color: red[600],
    },
    {
      title: "Testers",
      total: totalTesters,
      icon: <BugReport />,
      color: yellow[600],
    },
    {
      title:"Manager",
      total: totalManager,
      icon: <ManageAccounts/>,
      color: purple[600]
    }
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Navbar />
      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar />
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            bgcolor: blue[50],
          }}
        >
          <InfoBar />
          <Box sx={{ps:-10}}>
            <Grid container spacing={2} justifyContent="center">
              {dashboardCards.map((card, index) => (
                <Grid key={index} sx={{xs:12, sm:6, md:4, lg:2.4}}>
                  <InfoCard
                    title={card.title}
                    total={card.total}
                    icon={card.icon}
                    color={card.color}
                  />
                </Grid>
              ))}
            </Grid>

              <Grid size={12} margin={2}>
                <Box
                  sx={{
                    bgcolor: "#fff",
                    borderRadius: 3,
                    border: `1px solid ${grey[200]}`,
                    boxShadow: 6,
                    height: 500,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mt: 3,
                  }}
                >
                  <Typography variant="h6" fontWeight={500} color={grey[400]}>
                    No Updates
                  </Typography>
                </Box>
              </Grid>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
