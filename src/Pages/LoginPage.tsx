import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  CircularProgress,
  TextField,
  InputAdornment,
  IconButton,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { Admin } from "../Models";
import { useApp } from "../Context";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import { grey } from "@mui/material/colors";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const BG = "#dee4ff";
const ACCENT = "#665fc9";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAdmin, setCurrentUser} = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasRegisteredAdmins, setHasRegisteredAdmins] = useState(false);

  useEffect(() => {
    const storedAdmins = localStorage.getItem("admins");
    const allAdmins: Admin[] = storedAdmins ? JSON.parse(storedAdmins) : [];
    setHasRegisteredAdmins(allAdmins.length > 0);
  }, []);

  const loginAdmin = (): number | null => {
    const storedAdmins = localStorage.getItem("admins");
    const allAdmins: Admin[] = storedAdmins ? JSON.parse(storedAdmins) : [];

    for (const adm of allAdmins) {
      const user = adm.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (user && user.password === password) {
        setAdmin(adm);
        setCurrentUser(user);
        return adm.id;
      }
    }
    return null;
  };

  const handleLogin = () => {
    setError("");
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    setLoading(true);

    setTimeout(() => {
      const adminId = loginAdmin();
      if (adminId) {
        navigate(`/dashboard/${adminId}`);
        setLoading(false);
      } else {
        setError("Invalid email or password.");
        setLoading(false);
      }
    }, 1500);
  };

  if (!hasRegisteredAdmins) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: BG, display: "flex", alignItems: "center", justifyContent: "center", p: 3, textAlign: 'center' }}>
        <Paper elevation={6} sx={{ p: 5, borderRadius: 4 }}>
            <Typography variant="h5" fontWeight={800} color="#0a0e33" mb={2}>No Organisation Registered</Typography>
            <Typography color={grey[600]} mb={3}>Please register an organisation first to be able to log in.</Typography>
            <Button variant="contained" onClick={() => navigate('/registration')} sx={{bgcolor: ACCENT, '&:hover': {bgcolor: '#554eb0'}}}>
                Go to Registration
            </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: BG, display: "flex", flexDirection: "column" }}>
      <Box sx={{ py: 2, px: { xs: 3, md: 6 }, bgcolor: ACCENT, display: "flex", alignItems: "center", gap: 1 }}>
        <ViewKanbanIcon sx={{ color: "#fefefe", fontSize: 34 }} />
        <Typography sx={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "1.1rem", color: "#fff" }}>
          Azure<Box component="span" sx={{ color: "#0a0e33", mx: 0.4 }}>DevOps</Box>
        </Typography>
      </Box>

      <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", p: 3 }}>
        <Paper elevation={6} sx={{ borderRadius: 4, p: { xs: 4, md: 5 }, maxWidth: 480, width: "100%", border: `1px solid ${grey[200]}` }}>
          <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 900, color: "#0a0e33", mb: 1, textAlign: "center" }}>
            Welcome Back!
          </Typography>
          <Typography sx={{ color: grey[600], mb: 4, textAlign: "center", fontSize: '0.9rem' }}>
            Log in to your workspace.
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

          <Stack spacing={2.5} mb={3}>
            <TextField
              fullWidth
              type="email"
              label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ fontSize: 18, color: ACCENT }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              type={showPassword ? "text" : "password"}
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (<InputAdornment position="start"><LockIcon sx={{ fontSize: 18, color: ACCENT }} /></InputAdornment>),
                endAdornment: (<InputAdornment position="end"><IconButton aria-label="toggle password visibility" onClick={() => setShowPassword((show) => !show)} onMouseDown={(e) => e.preventDefault()} edge="end">{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>)
              }}
            />
          </Stack>

          <Button
            variant="contained"
            fullWidth
            disabled={loading}
            onClick={handleLogin}
            sx={{
              bgcolor: ACCENT,
              borderRadius: "10px",
              py: 1.6,
              fontSize: "1rem",
              fontWeight: 800,
              boxShadow: `0 6px 20px rgba(102,95,201,0.35)`,
              "&:hover": { bgcolor: "#554eb0" },
              "&:disabled": { bgcolor: grey[300] }
            }}
          >
            {loading ? <CircularProgress size={24} sx={{color: 'white'}} /> : "Log In"}
          </Button>
          <Typography sx={{ textAlign: "center", mt: 2.5, fontSize: "0.78rem", color: grey[500] }}>
            Don't have an account?
            <Box component="span" onClick={() => navigate("/registration")} sx={{ color: ACCENT, fontWeight: 800, cursor: "pointer", "&:hover": { textDecoration: "underline" } }}>
              Register here
            </Box>
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default LoginPage;