import React from "react";
import Navbar from "../Components/Layout/Navbar";
import Sidebar from "../Components/Layout/Sidebar";
import InfoBar from "../Components/Layout/InfoBar";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import { BugReport, DeveloperBoard, Info, ManageAccounts } from "@mui/icons-material";

import { Box, Grid, Typography, Paper } from "@mui/material";
import { blue, green, yellow, grey, red, purple } from "@mui/material/colors";

import { useApp } from "../Context";
import InfoCard from "../Components/Layout/InfoCard";
import ErrorComponent from "../Components/Layout/ErrorComponent";

const Dashboard: React.FC = () => {
  const { users, projects } = useApp();

  const totalDevelopers = users.filter((user) => user.role === "Developer").length;
  const totalTesters = users.filter((user) => user.role === "Tester").length;
  const totalManager = users.filter((user) => user.role === "Manager").length;

  const dashboardCards = [
    { title: "Projects", total: projects.length, icon: <NoteAltIcon fontSize="large" />, color: blue[500] },
    { title: "Users", total: users.length, icon: <Diversity3Icon fontSize="large" />, color: green[500] },
    { title: "Developers", total: totalDevelopers, icon: <DeveloperBoard fontSize="large" />, color: red[500] },
    { title: "Testers", total: totalTesters, icon: <BugReport fontSize="large" />, color: yellow[700] },
    { title: "Managers", total: totalManager, icon: <ManageAccounts fontSize="large" />, color: purple[500] },
  ];

  if (!projects || !users) {
    return <ErrorComponent title="Something went wrong" />;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", bgcolor: grey[50] }}>
      <Navbar />
      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar />
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto", p: 3 }}>
          <InfoBar />
          <Grid container spacing={9} sx={{display:'flex',justifyContent:'center',pt:3}}>
            {dashboardCards.map((card) => (
              <InfoCard title={card.title} total={card.total} icon={card.icon} color={card.color}/>
            ))}
          </Grid>
          <Box sx={{ mt: 4 }}>
            <Paper
              sx={{
                bgcolor: "#fff",
                borderRadius: 3,
                border: `1px solid ${grey[200]}`,
                boxShadow: 4,
                height: 500,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                transition: "all 0.3s",
                "&:hover": { boxShadow: 8 },
              }}
            >
              <Typography variant="h3" sx={{ color: grey[300], mb: 1 }}>
                <Info sx={{fontSize:50}}/>
              </Typography>
              <Typography variant="h6" fontWeight={500} color={grey[400]}>
                No Updates
              </Typography>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;