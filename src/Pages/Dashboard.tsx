import React, { useState, useEffect } from "react";
import Navbar from "../Components/Layout/Navbar";
import Sidebar from "../Components/Layout/Sidebar";
import InfoBar from "../Components/Layout/InfoBar";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import Marquee from "react-fast-marquee";
import {
  BugReport,
  DeveloperBoard,
  ManageAccounts,
} from "@mui/icons-material";

import { Box, Grid, Typography, Paper, Chip } from "@mui/material";
import { blue, green, yellow, grey, red, purple } from "@mui/material/colors";

import { useApp } from "../Context";
import InfoCard from "../Components/Layout/InfoCard";
import ErrorComponent from "../Components/Layout/ErrorComponent";
import { BounceLoader } from "react-spinners";

const Dashboard: React.FC = () => {
  const { users, projects } = useApp();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const totalDevelopers = users.filter(
    (user) => user.role === "Developer",
  ).length;
  const totalTesters = users.filter((user) => user.role === "Tester").length;
  const totalManager = users.filter((user) => user.role === "Manager").length;

  const dashboardCards = [
    {
      title: "Projects",
      total: projects.length,
      icon: <NoteAltIcon fontSize="large" />,
      color: blue[500],
    },
    {
      title: "Users",
      total: users.length,
      icon: <Diversity3Icon fontSize="large" />,
      color: green[500],
    },
    {
      title: "Developers",
      total: totalDevelopers,
      icon: <DeveloperBoard fontSize="large" />,
      color: red[500],
    },
    {
      title: "Testers",
      total: totalTesters,
      icon: <BugReport fontSize="large" />,
      color: yellow[700],
    },
    {
      title: "Managers",
      total: totalManager,
      icon: <ManageAccounts fontSize="large" />,
      color: purple[500],
    },
  ];

  const updates = [
  "Project Alpha deadline moved to 15 March",
  "Login Module completed by Rahul",
  "Sprint 5 ends tomorrow",
  "Project Gamma reached 75% completion",
  "API Integration currently blocked",
  "System maintenance scheduled tonight at 11 PM",
];

  if (!projects || !users) {
    return <ErrorComponent title="Something went wrong" />;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        bgcolor: "#dee4ff",
      }}
    >
      <Navbar />
      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar />
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            p: 3,
          }}
        >
          <InfoBar />
          {loading ? (
            <Box
              sx={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                bgcolor: "rgba(248,250,252,0.8)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9999,
              }}
            >
              <BounceLoader color="#6366F1" size={80} />
            </Box>
          ) : (
            <>
              <Grid
                container
                spacing={7}
                sx={{ display: "flex", justifyContent: "center", pt: 3 }}
              >
                {dashboardCards.map((card) => (
                  <InfoCard
                    key={card.title}
                    title={card.title}
                    total={card.total}
                    icon={card.icon}
                    color={card.color}
                  />
                ))}
              </Grid>

              <Box sx={{ mt: 4 }}>
                <Paper
                  sx={{
                    bgcolor: "#e0e0f2",
                    borderRadius: 3,
                    border: `1px solid ${grey[200]}`,
                    boxShadow: 4,
                    height: 120,
                    display: "flex",
                    alignItems: "center",
                    px: 2,
                    transition: "all 0.3s",
                    "&:hover": { boxShadow: 8 },
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight={900}
                    sx={{ mr: 3, color: "#665fc9", whiteSpace: "nowrap" }}
                  >
                    Project Updates:
                  </Typography>

                  <Marquee pauseOnHover speed={50} gradient={false}>
                    {updates.map((update, index) => (
                      <Chip
                        key={index}
                        label={update}
                        variant="outlined"
                        sx={{
                          mx: 1.5,
                          bgcolor: grey[50],
                          borderColor: '#665fc9',
                          fontWeight: 500,
                          color: '#665fc9',
                          fontStyle:'italic'
                        }}
                      />
                    ))}
                  </Marquee>
                </Paper>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
