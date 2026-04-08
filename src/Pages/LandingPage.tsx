import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Chip,
  Avatar,
  Stack,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import { BugReport, DeveloperBoard, ManageAccounts } from "@mui/icons-material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BoltIcon from "@mui/icons-material/Bolt";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import GroupsIcon from "@mui/icons-material/Groups";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import { blue, green, yellow, grey, red, purple } from "@mui/material/colors";
import Marquee from "react-fast-marquee";

const BG = "#dee4ff";
const ACCENT = "#665fc9";
const ACCENT_DARK = "#554eb0";
const SURFACE = "#e0e0f2";
const WHITE = "#ffffff";

const updates = [
  "Project Alpha deadline moved to 15 March",
  "Login Module completed by Rahul",
  "Sprint 5 ends tomorrow",
  "Project Gamma reached 75% completion",
  "API Integration currently blocked",
  "System maintenance scheduled tonight at 11 PM",
];

const InfoCard: React.FC<{
  title: string;
  total: number | string;
  icon: React.ReactNode;
  color: string;
}> = ({ title, total, icon, color }) => (
  <Paper
    elevation={4}
    sx={{
      borderRadius: 3,
      p: 3,
      bgcolor: WHITE,
      border: `1px solid ${grey[200]}`,
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      gap: 1.5,
      minWidth: { xs: "100%", sm: 160 },
      flex: "1 1 auto",
      width: "100%",
      transition: "all 0.3s",
      "&:hover": {
        boxShadow: 8,
        transform: "translateY(-4px)",
        borderColor: color,
      },
    }}
  >
    <Box
      sx={{
        width: 52,
        height: 52,
        borderRadius: "14px",
        bgcolor: `${color}18`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color,
      }}
    >
      {icon}
    </Box>
    <Box>
      <Typography
        variant="h4"
        fontWeight={900}
        sx={{ color: "#0a0a1a", lineHeight: 1, letterSpacing: "-1px" }}
      >
        {total}
      </Typography>
      <Typography
        variant="body2"
        fontWeight={700}
        sx={{ color: grey[600], mt: 0.25, fontSize: "0.82rem" }}
      >
        {title}
      </Typography>
    </Box>
  </Paper>
);
const FeatureCard: React.FC<{
  icon: React.ReactNode;
  color: string;
  title: string;
  desc: string;
  index: number;
}> = ({ icon, color, title, desc }) => (
  <Paper
    elevation={4}
    sx={{
      borderRadius: 3,
      p: 3.5,
      bgcolor: WHITE,
      border: `1px solid ${grey[200]}`,
      display: "flex",
      gap: 2.5,
      alignItems: "flex-start",
      transition: "all 0.3s",
      "&:hover": {
        boxShadow: 8,
        transform: "translateY(-4px)",
        borderColor: color,
      },
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "3px",
        bgcolor: color,
        borderRadius: "12px 12px 0 0",
      },
      position: "relative",
      overflow: "hidden",
    }}
  >
    <Box
      sx={{
        width: 48,
        height: 48,
        borderRadius: "12px",
        bgcolor: `${color}18`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color,
        flexShrink: 0,
      }}
    >
      {icon}
    </Box>
    <Box>
      <Typography
        fontWeight={800}
        sx={{ color: "#0a0a1a", mb: 0.75, fontSize: "1rem" }}
      >
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: grey[600], lineHeight: 1.65 }}>
        {desc}
      </Typography>
    </Box>
  </Paper>
);

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [count, setCount] = useState({
    projects: 0,
    users: 0,
    teams: 0,
    bugs: 0,
  });

  useEffect(() => {
    const targets = useRef({ projects: 240, users: 1800, teams: 95, bugs: 12000 });
    const duration = 1800;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setCount({
        projects: Math.round(ease * targets.current.projects),
        users: Math.round(ease * targets.current.users),
        teams: Math.round(ease * targets.current.teams),
        bugs: Math.round(ease * targets.current.bugs),
      });
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, []);

  const statCards = [
    {
      title: "Projects",
      total: `${count.projects}+`,
      icon: <NoteAltIcon fontSize="large" />,
      color: blue[500],
    },
    {
      title: "Active Users",
      total: `${count.users}+`,
      icon: <Diversity3Icon fontSize="large" />,
      color: green[500],
    },
    {
      title: "Dev Teams",
      total: `${count.teams}+`,
      icon: <DeveloperBoard fontSize="large" />,
      color: red[500],
    },
    {
      title: "Bugs Squashed",
      total: `${count.bugs}+`,
      icon: <BugReport fontSize="large" />,
      color: yellow[700],
    },
    {
      title: "Managers",
      total: "500+",
      icon: <ManageAccounts fontSize="large" />,
      color: purple[500],
    },
  ];

  const features = [
    {
      icon: <ViewKanbanIcon fontSize="medium" />,
      color: ACCENT,
      title: "Kanban Boards",
      desc: "Drag-and-drop sprint boards with WIP limits, swim lanes, and real-time updates. See your work, move your work.",
    },
    {
      icon: <GroupsIcon fontSize="medium" />,
      color: green[600],
      title: "Team Management",
      desc: "Assign Developers, Testers, and Managers to the right projects. Track individual and team-level workload.",
    },
    {
      icon: <BugReport fontSize="medium" />,
      color: red[500],
      title: "Issue Tracking",
      desc: "Log bugs, feature requests, and tasks. Link issues to sprints and watch them close in real time.",
    },
    {
      icon: <TrendingUpIcon fontSize="medium" />,
      color: yellow[700],
      title: "Velocity Analytics",
      desc: "Burndown charts, story point metrics, and sprint forecasting to make every delivery predictable.",
    },
    {
      icon: <AssignmentTurnedInIcon fontSize="medium" />,
      color: purple[500],
      title: "Sprint Planning",
      desc: "Groom your backlog, set capacity, and auto-balance stories across your team with a single click.",
    },
    {
      icon: <RocketLaunchIcon fontSize="medium" />,
      color: blue[600],
      title: "Release Management",
      desc: "Tag releases, write changelogs, and track deployment status from a unified release dashboard.",
    },
  ];

  const perks = [
    "Free 14-day trial, no credit card",
    "Role-based access control built in",
    "Real-time sync across your team",
    "Export reports to CSV or PDF",
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: BG,
        display: "flex",
        flexDirection: "column",
      }}
    >

      <Box
        component="nav"
        sx={{
          py: 2,
          px: { xs: 3, md: 6 },
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: ACCENT,
          position: "sticky",
          top: 0,
          zIndex: 100,
          borderBottom: `1px solid ${grey[200]}`,
          boxShadow: 4,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ViewKanbanIcon sx={{ color: "#fefefe", fontSize: 38 }} />
          <Typography
            sx={{
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 900,
              fontSize: "1.2rem",
              color: "#fff",
              letterSpacing: "-0.4px",
            }}
          >
            Azure
            <Box component="span" sx={{ color: "#0a0e33", mx: 0.4 }}>
              DevOps
            </Box>
          </Typography>
        </Box>
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3.5 }}>
          {["Features", "Pricing", "Docs", "Changelog"].map((l) => (
            <Typography
              key={l}
              sx={{
                fontSize: "0.9rem",
                fontWeight: 700,
                color: "rgba(255,255,255,0.75)",
                cursor: "pointer",
                transition: "color 0.2s",
                "&:hover": { color: "#fff" },
              }}
            >
              {l}
            </Typography>
          ))}
        </Box>
        <Stack direction="row" spacing={1.5}>
          <Button
            onClick={() => navigate("/login")}
            sx={{
              color: "#fff",
              fontWeight: 700,
              textTransform: "none",
              fontSize: "0.9rem",
            }}
          >
            Log In
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate("/registration")}
            sx={{
              bgcolor: WHITE,
              color: ACCENT,
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 800,
              fontSize: "0.9rem",
              px: 2.5,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              "&:hover": { bgcolor: "#f0efff", transform: "translateY(-1px)" },
              transition: "all 0.2s",
            }}
          >
            Get Started
          </Button>
        </Stack>
      </Box>
      <Box
        sx={{
          pt: { xs: 8, md: 11 },
          pb: { xs: 6, md: 10 },
          px: { xs: 3, md: 6 },
          bgcolor: BG,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "-10%",
            right: "-5%",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(102,95,201,0.18) 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />
        <Box
          sx={{
            maxWidth: 1200,
            mx: "auto",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            gap: 6,
          }}
        >
          {/* Copy */}
          <Box sx={{ flex: "0 0 54%", maxWidth: { xs: "100%", md: "54%" } }}>
            <Box className="s1" sx={{ mb: 2.5 }}>
              <Chip
                icon={
                  <BoltIcon
                    sx={{
                      fontSize: "14px !important",
                      color: `${ACCENT} !important`,
                    }}
                  />
                }
                label="New · AI Sprint Forecasting is live"
                sx={{
                  bgcolor: `${ACCENT}18`,
                  color: ACCENT,
                  fontWeight: 700,
                  fontSize: "0.78rem",
                  border: `1px solid ${ACCENT}44`,
                  borderRadius: "100px",
                  px: 0.5,
                }}
              />
            </Box>
            <Typography
              className="s2"
              sx={{
                fontFamily: "'Playfair Display', serif",
                fontSize: { xs: "2.6rem", md: "3.8rem" },
                fontWeight: 900,
                lineHeight: 1.1,
                letterSpacing: "-1.8px",
                color: "#0a0e33",
                mb: 2.5,
              }}
            >
              Manage every sprint,{" "}
              <Box
                component="span"
                sx={{
                  color: ACCENT,
                  position: "relative",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: 2,
                    left: 0,
                    right: 0,
                    height: 5,
                    bgcolor: yellow[400],
                    borderRadius: 3,
                    zIndex: -1,
                    opacity: 0.6,
                  },
                }}
              >
                ship with velocity.
              </Box>
            </Typography>
            <Typography
              className="s3"
              sx={{
                fontSize: "1.05rem",
                color: grey[600],
                lineHeight: 1.75,
                mb: 4.5,
                maxWidth: 500,
                fontWeight: 500,
              }}
            >
              Azure DevOps brings together project boards, bug tracking, team
              management, and analytics in one tightly integrated suite — built
              for teams who ship software.
            </Typography>
            <Stack
              className="s3"
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              mb={4}
            >
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate("/dashboard")}
                endIcon={<ArrowForwardIcon />}
                sx={{
                  bgcolor: ACCENT,
                  borderRadius: "10px",
                  px: 4,
                  py: 1.6,
                  fontSize: "1rem",
                  fontWeight: 800,
                  textTransform: "none",
                  boxShadow: `0 8px 24px rgba(102,95,201,0.4)`,
                  "&:hover": {
                    bgcolor: ACCENT_DARK,
                    transform: "translateY(-2px)",
                    boxShadow: `0 12px 32px rgba(102,95,201,0.5)`,
                  },
                  transition: "all 0.25s",
                }}
              >
                Go to Dashboard
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate("/projects")}
                sx={{
                  borderRadius: "10px",
                  px: 4,
                  py: 1.6,
                  fontSize: "1rem",
                  fontWeight: 700,
                  textTransform: "none",
                  borderColor: ACCENT,
                  borderWidth: 2,
                  color: ACCENT,
                  "&:hover": {
                    borderWidth: 2,
                    borderColor: ACCENT_DARK,
                    bgcolor: `${ACCENT}0a`,
                  },
                }}
              >
                View Projects
              </Button>
            </Stack>
            <Box
              className="fi"
              sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}
            >
              {perks.map((p) => (
                <Box
                  key={p}
                  sx={{ display: "flex", alignItems: "center", gap: 0.75 }}
                >
                  <CheckCircleIcon sx={{ fontSize: 16, color: green[500] }} />
                  <Typography
                    sx={{
                      fontSize: "0.8rem",
                      color: grey[600],
                      fontWeight: 600,
                    }}
                  >
                    {p}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          <Box
            className="s4"
            sx={{ flex: 1, position: "relative", width: { xs: "100%", md: "50%" } }}
          >
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background: `radial-gradient(circle at 50% 50%, rgba(102,95,201,0.15) 0%, transparent 70%)`,
                pointerEvents: "none",
              }}
            />
            <Paper
              elevation={8}
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                border: `1px solid ${grey[200]}`,
                transform: {
                  xs: "none",
                  md: "perspective(1200px) rotateY(-6deg) rotateX(3deg)",
                },
                transition: "transform 0.5s ease",
                "&:hover": {
                  transform:
                    "perspective(1200px) rotateY(0) rotateX(0) translateY(-4px)",
                },
              }}
            >
              <Box
                sx={{
                  bgcolor: ACCENT,
                  px: 2.5,
                  py: 1.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <ViewKanbanIcon sx={{ color: "white", fontSize: 22 }} />
                <Typography
                  sx={{ fontWeight: 900, color: "white", fontSize: "0.9rem" }}
                >
                  Azure{" "}
                  <Box component="span" sx={{ color: "#0a0e33" }}>
                    DevOps
                  </Box>
                </Typography>
                <Box sx={{ flex: 1 }} />
                {["Dashboard", "Projects", "Users"].map((t) => (
                  <Typography
                    key={t}
                    sx={{
                      fontSize: "0.7rem",
                      color: "rgba(255,255,255,0.7)",
                      fontWeight: 600,
                    }}
                  >
                    {t}
                  </Typography>
                ))}
              </Box>
              <Box sx={{ bgcolor: BG, p: 2.5 }}>
                <Paper
                  elevation={2}
                  sx={{
                    borderRadius: 2,
                    p: 2,
                    mb: 2.5,
                    bgcolor: WHITE,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontSize: "0.8rem",
                        fontWeight: 800,
                        color: "#0a0e33",
                      }}
                    >
                      👋 Welcome back,{" "}
                      <Box component="span" sx={{ color: ACCENT }}>
                        Rahul
                      </Box>
                    </Typography>
                    <Typography sx={{ fontSize: "0.65rem", color: grey[500] }}>
                      Monday, 15 March · Sprint 23
                    </Typography>
                  </Box>
                  <Chip
                    label="Active Sprint"
                    size="small"
                    sx={{
                      bgcolor: `${green[500]}18`,
                      color: green[700],
                      fontWeight: 700,
                      fontSize: "0.65rem",
                    }}
                  />
                </Paper>
                <Box
                  sx={{ display: "flex", gap: 1.5, mb: 2.5, flexWrap: "wrap" }}
                >
                  {[
                    {
                      label: "Projects",
                      val: "12",
                      color: blue[500],
                      icon: <NoteAltIcon sx={{ fontSize: 18 }} />,
                    },
                    {
                      label: "Users",
                      val: "48",
                      color: green[500],
                      icon: <Diversity3Icon sx={{ fontSize: 18 }} />,
                    },
                    {
                      label: "Bugs",
                      val: "7",
                      color: red[400],
                      icon: <BugReport sx={{ fontSize: 18 }} />,
                    },
                    {
                      label: "Managers",
                      val: "4",
                      color: purple[400],
                      icon: <ManageAccounts sx={{ fontSize: 18 }} />,
                    },
                  ].map((c) => (
                    <Paper
                      key={c.label}
                      elevation={3}
                      sx={{
                        borderRadius: 2,
                        px: 2,
                        py: 1.25,
                        bgcolor: WHITE,
                        display: "flex",
                        alignItems: "center",
                        gap: 1.25,
                        flex: "1 1 80px",
                        border: `1px solid ${grey[100]}`,
                        transition: "all 0.2s",
                        "&:hover": { borderColor: c.color, boxShadow: 4 },
                      }}
                    >
                      <Box sx={{ color: c.color }}>{c.icon}</Box>
                      <Box>
                        <Typography
                          sx={{
                            fontWeight: 900,
                            fontSize: "1rem",
                            lineHeight: 1,
                            color: "#0a0e33",
                          }}
                        >
                          {c.val}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "0.6rem",
                            color: grey[500],
                            fontWeight: 600,
                          }}
                        >
                          {c.label}
                        </Typography>
                      </Box>
                    </Paper>
                  ))}
                </Box>
                <Paper
                  elevation={2}
                  sx={{
                    borderRadius: 2,
                    p: 1.5,
                    bgcolor: SURFACE,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    border: `1px solid ${grey[200]}`,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.68rem",
                      fontWeight: 900,
                      color: ACCENT,
                      whiteSpace: "nowrap",
                    }}
                  >
                    Updates:
                  </Typography>
                  <Marquee
                    pauseOnHover
                    speed={35}
                    gradient={false}
                    style={{ overflow: "hidden" }}
                  >
                    {updates.map((u, i) => (
                      <Chip
                        key={i}
                        label={u}
                        variant="outlined"
                        size="small"
                        sx={{
                          mx: 1,
                          bgcolor: grey[50],
                          borderColor: ACCENT,
                          color: ACCENT,
                          fontWeight: 500,
                          fontSize: "0.6rem",
                          fontStyle: "italic",
                        }}
                      />
                    ))}
                  </Marquee>
                </Paper>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>

      <Box sx={{ py: 6, px: { xs: 3, md: 6 }, bgcolor: BG }}>
        <Box sx={{ maxWidth: 1200, mx: "auto" }}>
          <Typography
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontSize: { xs: "1.8rem", md: "2.4rem" },
              fontWeight: 900,
              color: "#0a0e33",
              textAlign: "center",
              letterSpacing: "-1px",
              mb: 4,
            }}
          >
            Trusted by thousands of teams worldwide
          </Typography>
          <Grid
            container
            spacing={3}
            columns={{ xs: 12, sm: 12, md: 10 }}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            {statCards.map((card) => (
              <Grid  key={card.title} sx={{ display: "flex", width: "100%",xs:12,sm:6, md:2 }}>
                <InfoCard
                  title={card.title}
                  total={card.total}
                  icon={card.icon}
                  color={card.color}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      <Box sx={{ px: { xs: 3, md: 6 }, pb: 4, bgcolor: BG }}>
        <Box sx={{ maxWidth: 1200, mx: "auto" }}>
          <Paper
            sx={{
              bgcolor: SURFACE,
              borderRadius: 3,
              border: `1px solid ${grey[200]}`,
              boxShadow: 4,
              height: 72,
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
              sx={{
                mr: 3,
                color: ACCENT,
                whiteSpace: "nowrap",
                fontSize: "1rem",
              }}
            >
              Live Updates:
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
                    borderColor: ACCENT,
                    fontWeight: 500,
                    color: ACCENT,
                    fontStyle: "italic",
                  }}
                />
              ))}
            </Marquee>
          </Paper>
        </Box>
      </Box>

      <Box sx={{ py: { xs: 8, md: 12 }, px: { xs: 3, md: 6 }, bgcolor: BG }}>
        <Box sx={{ maxWidth: 1200, mx: "auto" }}>
          <Box textAlign="center" mb={{ xs: 5, md: 8 }}>
            <Typography
              sx={{
                fontFamily: "'Playfair Display', serif",
                fontSize: { xs: "1.8rem", md: "2.8rem" },
                fontWeight: 900,
                color: "#0a0e33",
                letterSpacing: "-1px",
                mb: 1.5,
              }}
            >
              Everything your team needs
            </Typography>
            <Typography
              sx={{
                fontSize: "1rem",
                color: grey[600],
                maxWidth: 520,
                mx: "auto",
                lineHeight: 1.7,
              }}
            >
              From sprint planning to release management — one platform, zero
              compromises.
            </Typography>
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
              gap: 3,
            }}
          >
            {features.map((f, i) => (
              <FeatureCard key={i} {...f} index={i} />
            ))}
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          py: { xs: 8, md: 12 },
          px: { xs: 3, md: 6 },
          bgcolor: `${ACCENT}0d`,
        }}
      >
        <Box sx={{ maxWidth: 1200, mx: "auto" }}>
          <Typography
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontSize: { xs: "1.8rem", md: "2.8rem" },
              fontWeight: 900,
              color: "#0a0e33",
              textAlign: "center",
              letterSpacing: "-1px",
              mb: 8,
            }}
          >
            How it works
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
              gap: 4,
            }}
          >
            {[
              {
                step: "01",
                title: "Create your project",
                desc: "Set up in seconds. Add team members, define roles — Developer, Tester, Manager — and you're ready to sprint.",
                color: blue[500],
              },
              {
                step: "02",
                title: "Plan your sprint",
                desc: "Groom the backlog, estimate story points, drag tasks into your board. Kanban columns update live for the whole team.",
                color: ACCENT,
              },
              {
                step: "03",
                title: "Track & ship",
                desc: "Monitor velocity, resolve blockers, and hit your release date. Real-time analytics keep everyone aligned.",
                color: green[600],
              },
            ].map((s) => (
              <Paper
                key={s.step}
                elevation={4}
                sx={{
                  borderRadius: 3,
                  p: 4,
                  bgcolor: WHITE,
                  border: `1px solid ${grey[200]}`,
                  position: "relative",
                  overflow: "hidden",
                  transition: "all 0.3s",
                  "&:hover": { boxShadow: 8, transform: "translateY(-4px)" },
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "4.5rem",
                    fontWeight: 900,
                    color: `${s.color}18`,
                    lineHeight: 1,
                    position: "absolute",
                    top: 12,
                    right: 20,
                    userSelect: "none",
                  }}
                >
                  {s.step}
                </Typography>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "12px",
                    bgcolor: `${s.color}18`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2.5,
                  }}
                >
                  <Typography
                    sx={{ fontWeight: 900, color: s.color, fontSize: "1rem" }}
                  >
                    {s.step}
                  </Typography>
                </Box>
                <Typography
                  fontWeight={800}
                  sx={{ color: "#0a0e33", mb: 1.25, fontSize: "1.05rem" }}
                >
                  {s.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: grey[600], lineHeight: 1.7 }}
                >
                  {s.desc}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Box>
      </Box>

      <Box sx={{ py: { xs: 8, md: 12 }, px: { xs: 3, md: 6 }, bgcolor: BG }}>
        <Box sx={{ maxWidth: 1200, mx: "auto" }}>
          <Typography
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontSize: { xs: "1.8rem", md: "2.8rem" },
              fontWeight: 900,
              color: "#0a0e33",
              textAlign: "center",
              letterSpacing: "-1px",
              mb: 8,
            }}
          >
            What teams are saying
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
              gap: 3,
            }}
          >
            {[
              {
                quote:
                  "Azure DevOps cut our release cycle by 40%. The kanban boards are exactly what our team needed — no fluff, just clarity.",
                author: "Rahul Sharma",
                role: "Lead Developer, TechCorp",
                color: ACCENT,
                initials: "RS",
              },
              {
                quote:
                  "Sprint planning used to take half a day. Now it's done in 30 minutes and everyone actually sticks to it.",
                author: "Anita Patel",
                role: "Engineering Manager, Finvex",
                color: green[600],
                initials: "AP",
              },
              {
                quote:
                  "Bug tracking across multiple projects was a nightmare. This solved it completely — clean UI, real-time updates.",
                author: "Kevin D'Souza",
                role: "QA Lead, Pixelworks",
                color: red[500],
                initials: "KD",
              },
            ].map((t, i) => (
              <Paper
                key={i}
                elevation={4}
                sx={{
                  borderRadius: 3,
                  p: 4,
                  bgcolor: WHITE,
                  border: `1px solid ${grey[200]}`,
                  transition: "all 0.3s",
                  position: "relative",
                  "&:hover": {
                    boxShadow: 8,
                    transform: "translateY(-4px)",
                    borderColor: t.color,
                  },
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "3px",
                    bgcolor: t.color,
                    borderRadius: "12px 12px 0 0",
                  },
                }}
              >
                <Typography
                  sx={{
                    fontSize: "2.5rem",
                    color: t.color,
                    lineHeight: 1,
                    mb: 2,
                    fontFamily: "Georgia, serif",
                  }}
                >
                  "
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.9rem",
                    color: grey[700],
                    lineHeight: 1.7,
                    mb: 3,
                    fontStyle: "italic",
                  }}
                >
                  {t.quote}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Avatar
                    sx={{
                      width: 38,
                      height: 38,
                      bgcolor: t.color,
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      borderRadius: "10px",
                    }}
                  >
                    {t.initials}
                  </Avatar>
                  <Box>
                    <Typography
                      sx={{
                        fontSize: "0.85rem",
                        fontWeight: 800,
                        color: "#0a0e33",
                      }}
                    >
                      {t.author}
                    </Typography>
                    <Typography sx={{ fontSize: "0.72rem", color: grey[500] }}>
                      {t.role}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          py: { xs: 8, md: 12 },
          px: { xs: 3, md: 6 },
          bgcolor: ACCENT,
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />
        <Box sx={{ position: "relative", maxWidth: 620, mx: "auto" }}>
          <Typography
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontSize: { xs: "2rem", md: "3rem" },
              fontWeight: 900,
              color: "white",
              letterSpacing: "-1.5px",
              lineHeight: 1.1,
              mb: 2,
            }}
          >
            Ready to ship faster?
          </Typography>
          <Typography
            sx={{
              fontSize: "1.05rem",
              color: "rgba(255,255,255,0.75)",
              mb: 5,
              lineHeight: 1.7,
            }}
          >
            Join thousands of teams already using Azure DevOps to build, track,
            and deploy great software.
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/dashboard")}
              endIcon={<ArrowForwardIcon />}
              sx={{
                bgcolor: WHITE,
                color: ACCENT,
                borderRadius: "10px",
                px: 5,
                py: 1.8,
                fontSize: "1rem",
                fontWeight: 800,
                textTransform: "none",
                boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                "&:hover": {
                  bgcolor: "#f0efff",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.25s",
              }}
            >
              Go to Dashboard
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate("/projects")}
              sx={{
                borderRadius: "10px",
                px: 5,
                py: 1.8,
                fontSize: "1rem",
                fontWeight: 700,
                textTransform: "none",
                borderColor: "rgba(255,255,255,0.5)",
                borderWidth: 2,
                color: "white",
                "&:hover": {
                  borderWidth: 2,
                  borderColor: "white",
                  bgcolor: "rgba(255,255,255,0.08)",
                },
              }}
            >
              View Projects
            </Button>
          </Stack>
        </Box>
      </Box>


      <Box sx={{ py: 5, bgcolor: "#0a0e33", px: { xs: 3, md: 6 } }}>
        <Box
          sx={{
            maxWidth: 1200,
            mx: "auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ViewKanbanIcon sx={{ color: ACCENT, fontSize: 28 }} />
            <Typography
              sx={{ fontWeight: 900, color: "white", fontSize: "1rem" }}
            >
              Azure
              <Box component="span" sx={{ color: ACCENT }}>
                DevOps
              </Box>
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 3.5 }}>
            {["Privacy", "Terms", "Security", "Docs", "Status"].map((item) => (
              <Typography
                key={item}
                sx={{
                  fontSize: "0.8rem",
                  color: "rgba(255,255,255,0.35)",
                  cursor: "pointer",
                  transition: "color 0.2s",
                  "&:hover": { color: "rgba(255,255,255,0.8)" },
                }}
              >
                {item}
              </Typography>
            ))}
          </Box>
          <Typography
            sx={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.3)" }}
          >
            © {new Date().getFullYear()} Azure DevOps. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default LandingPage;
