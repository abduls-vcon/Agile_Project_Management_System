import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  InputAdornment,
  Chip,
  Stack,
  Alert,
  CircularProgress,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import { useApp } from "../Context";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CategoryIcon from "@mui/icons-material/Category";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HomeIcon from "@mui/icons-material/Home";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import MapIcon from "@mui/icons-material/Map";
import PublicIcon from "@mui/icons-material/Public";
import { IconButton } from "@mui/material";
import { blue, green, grey, red, purple, yellow } from "@mui/material/colors";
import type { Admin, User, Project } from "../Models";


const BG = "#dee4ff";
const ACCENT = "#665fc9";
const ACCENT_DARK = "#554eb0";
const SURFACE = "#e0e0f2";
const WHITE = "#ffffff";

const INDUSTRIES = [
  "Software & Technology",
  "Finance & Banking",
  "Healthcare & Pharma",
  "E-Commerce & Retail",
  "Manufacturing",
  "Education & EdTech",
  "Media & Entertainment",
  "Logistics & Supply Chain",
  "Consulting & Services",
  "Government & Public Sector",
  "Energy & Utilities",
  "Real Estate",
  "Other",
];

const COUNTRIES = [
  "India", "United States", "United Kingdom", "Canada", "Australia",
  "Germany", "France", "Singapore", "UAE", "Japan", "Brazil", "Other",
];

type FormData = {
  email: string;
  password: string;
  companyName: string;
  address: { street: string; city: string; state: string; country: string };
  industry: string;
};

type Errors = Partial<{
  email: string;
  password: string;
  companyName: string;
  street: string;
  city: string;
  state: string;
  country: string;
  industry: string;
}>;

const STEPS = ["Account", "Company Info", "Address", "Industry", "Review"];

const Field: React.FC<{
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  error?: string;
  color?: string;
}> = ({ label, icon, children, error, color = ACCENT }) => (
  <Box sx={{ mb: 0.5 }}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
      <Box sx={{ color, display: "flex", alignItems: "center" }}>{icon}</Box>
      <Typography sx={{ fontSize: "0.82rem", fontWeight: 700, color: grey[700], letterSpacing: "0.03em" }}>
        {label}
      </Typography>
    </Box>
    {children}
    {error && (
      <Typography sx={{ fontSize: "0.72rem", color: red[500], mt: 0.5, fontWeight: 600 }}>{error}</Typography>
    )}
  </Box>
);


const ReviewRow: React.FC<{ label: string; value: string; color: string }> = ({ label, value }) => (
  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", py: 1.5, borderBottom: `1px solid ${grey[100]}` }}>
    <Typography sx={{ fontSize: "0.82rem", color: grey[500], fontWeight: 600, minWidth: 120 }}>{label}</Typography>
    <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: "#0a0e33", textAlign: "right", flex: 1 }}>{value || "—"}</Typography>
  </Box>
);

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { addAdmin} = useApp();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState<FormData>({
    email: "",
    password: "",
    companyName: "",
    address: { street: "", city: "", state: "", country: "" },
    industry: "",
  });
  const [errors, setErrors] = useState<Errors>({});

  const set = (
    key: keyof Omit<FormData, "address">,
    val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const setAddr = (key: keyof FormData["address"], val: string) =>
    setForm((f) => ({ ...f, address: { ...f.address, [key]: val } }));

  const validate = (): boolean => {
    const e: Errors = {};
    if (step === 0) {
      if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Please enter a valid email address";
      if (form.password.length < 8) e.password = "Password must be at least 8 characters long";
    }
    if (step === 1 && !form.companyName.trim()) e.companyName = "Company name is required";
    if (step === 2) {
      if (!form.address.street.trim()) e.street = "Street is required";
      if (!form.address.city.trim()) e.city = "City is required";
      if (!form.address.state.trim()) e.state = "State is required";
      if (!form.address.country) e.country = "Country is required";
    }
    if (step === 3 && !form.industry) e.industry = "Please select an industry";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate()) setStep((s) => s + 1); };
  const back = () => { setErrors({}); setStep((s) => s - 1); };

  const generateRandomHexColor = () => {
    return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1800));

    const adminUser: User = { id: Date.now(), name: form.email.split('@')[0] || 'admin', email: form.email, role: "Admin", avatarColor: generateRandomHexColor(), password: form.password };

    const initialProject: Project = {
        id: Date.now() + 1,
        name: `${form.companyName}'s Workspace`,
        description: `Initial workspace for ${form.companyName}.`,
        status: "Active",
        ownerId: adminUser.id,
        teamMembers: [adminUser],
        userStories: [],
        createdDate: new Date().toISOString(),
    };

    const newAdminData: Omit<Admin, "id"> = {
      companyName: form.companyName,
      address: form.address,
      industry: form.industry,
      users: [adminUser],
      projects: [initialProject]
    };
    addAdmin(newAdminData);

    setSubmitting(false);
    setSubmitted(true);
  };

  const inputSx = (hasError?: string) => ({
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      bgcolor: WHITE,
      fontSize: "0.92rem",
      fontFamily: "'Nunito', sans-serif",
      fontWeight: 600,
      "& fieldset": { borderColor: hasError ? red[400] : grey[300], borderWidth: "1.5px" },
      "&:hover fieldset": { borderColor: hasError ? red[400] : ACCENT },
      "&.Mui-focused fieldset": { borderColor: hasError ? red[400] : ACCENT, borderWidth: "2px" },
    },
    "& .MuiInputBase-input": { py: 1.4, color: "#0a0e33" },
  });

  const industryColors: Record<string, string> = {
    "Software & Technology": ACCENT,
    "Finance & Banking": green[600],
    "Healthcare & Pharma": red[500],
    "E-Commerce & Retail": yellow[700],
    "Manufacturing": grey[600],
    "Education & EdTech": blue[600],
    "Media & Entertainment": purple[500],
    "Logistics & Supply Chain": "#F97316",
    "Consulting & Services": "#0EA5E9",
    "Government & Public Sector": "#64748B",
    "Energy & Utilities": "#EAB308",
    "Real Estate": "#10B981",
    "Other": grey[500],
  };

  if (submitted) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: BG, display: "flex", flexDirection: "column", }}>
        {/* Nav */}
        <Box sx={{ py: 2, px: { xs: 3, md: 6 }, bgcolor: ACCENT, display: "flex", alignItems: "center", gap: 1 }}>
          <ViewKanbanIcon sx={{ color: "#fefefe", fontSize: 34 }} />
          <Typography sx={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "1.1rem", color: "#fff" }}>
            Azure<Box component="span" sx={{ color: "#0a0e33", mx: 0.4 }}>DevOps</Box>
          </Typography>
        </Box>
        <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", p: 3 }}>
          <Paper elevation={6} sx={{ borderRadius: 4, p: { xs: 4, md: 6 }, maxWidth: 500, width: "100%", textAlign: "center", border: `1px solid ${grey[200]}` }}>
            <Box sx={{
              width: 80, height: 80, borderRadius: "50%", bgcolor: `${green[500]}18`,
              display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 3,
              animation: "pop 0.5s cubic-bezier(0.16,1,0.3,1) both",
              "@keyframes pop": { from: { transform: "scale(0)", opacity: 0 }, to: { transform: "scale(1)", opacity: 1 } },
            }}>
              <CheckCircleIcon sx={{ fontSize: 44, color: green[500] }} />
            </Box>
            <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 900, color: "#0a0e33", mb: 1 }}>
              You're all set!
            </Typography>
            <Typography sx={{ color: grey[600], mb: 1, lineHeight: 1.7 }}>
              <Box component="span" sx={{ fontWeight: 800, color: ACCENT }}>{form.companyName}</Box> has been registered successfully.
            </Typography>
            <Chip label={form.industry} sx={{ bgcolor: `${industryColors[form.industry] || ACCENT}18`, color: industryColors[form.industry] || ACCENT, fontWeight: 700, mb: 3 }} />
            <Button variant="contained" fullWidth onClick={() => navigate("/dashboard")} endIcon={<ArrowForwardIcon />} sx={{
              bgcolor: ACCENT, borderRadius: "10px", py: 1.6, fontSize: "1rem", fontWeight: 800, textTransform: "none",
              boxShadow: `0 8px 24px rgba(102,95,201,0.4)`,
              "&:hover": { bgcolor: ACCENT_DARK, transform: "translateY(-1px)" }, transition: "all 0.2s",
            }}>Go to Dashboard</Button>
          </Paper>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: BG, display: "flex", flexDirection: "column"}}>

      <Box component="nav" sx={{ py: 2, px: { xs: 3, md: 6 }, bgcolor: ACCENT, display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ViewKanbanIcon sx={{ color: "#fefefe", fontSize: 34 }} />
          <Typography sx={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "1.1rem", color: "#fff" }}>
            Azure<Box component="span" sx={{ color: "#0a0e33", mx: 0.4 }}>DevOps</Box>
          </Typography>
        </Box>
        <Button onClick={() => navigate("/")} sx={{ color: "rgba(255,255,255,0.8)", textTransform: "none", fontWeight: 700, fontSize: "0.85rem" }}>
          ← Back to Home
        </Button>
      </Box>

      <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", p: { xs: 2, md: 4 }, position: "relative", overflow: "hidden" }}>

        <Box sx={{ position: "absolute", top: "-10%", right: "-5%", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, rgba(102,95,201,0.18) 0%, transparent 70%)`, pointerEvents: "none" }} />
        <Box sx={{ position: "absolute", bottom: "-5%", left: "-5%", width: 320, height: 320, borderRadius: "50%", background: `radial-gradient(circle, rgba(102,95,201,0.12) 0%, transparent 70%)`, pointerEvents: "none" }} />

        <Box sx={{ width: "100%", maxWidth: 640, position: "relative" }}>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: { xs: "1.8rem", md: "2.4rem" }, fontWeight: 900, color: "#0a0e33", letterSpacing: "-1px", lineHeight: 1.1 }}>
              Register your{" "}
              <Box component="span" sx={{ color: ACCENT, position: "relative", "&::after": { content: '""', position: "absolute", bottom: 1, left: 0, right: 0, height: 4, bgcolor: yellow[400], borderRadius: 2, zIndex: -1, opacity: 0.65 } }}>
                organisation
              </Box>
            </Typography>
            <Typography sx={{ color: grey[600], mt: 1, fontSize: "0.92rem", fontWeight: 500 }}>
              Set up your workspace in just a few steps
            </Typography>
          </Box>

          <Paper elevation={6} sx={{ borderRadius: 4, overflow: "hidden", border: `1px solid ${grey[200]}` }}>
            <Box sx={{ bgcolor: SURFACE, px: { xs: 2, md: 4 }, pt: 3, pb: 2.5, borderBottom: `1px solid ${grey[200]}` }}>
              <Stepper activeStep={step} alternativeLabel>
                {STEPS.map((label, i) => (
                  <Step key={label} completed={i < step}>
                    <StepLabel
                      StepIconProps={{
                        sx: {
                          color: i < step ? `${green[500]} !important` : i === step ? `${ACCENT} !important` : `${grey[300]} !important`,
                          "&.Mui-active": { color: `${ACCENT} !important` },
                          "&.Mui-completed": { color: `${green[500]} !important` },
                        },
                      }}
                    >
                      {label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
              <Box sx={{ mt: 2, height: 4, bgcolor: grey[200], borderRadius: 2, overflow: "hidden" }}>
                <Box sx={{ height: "100%", width: `${((step) / (STEPS.length - 1)) * 100}%`, bgcolor: ACCENT, borderRadius: 2, transition: "width 0.4s ease" }} />
              </Box>
            </Box>

            <Box sx={{ px: { xs: 3, md: 5 }, py: 4 }}>

              {step === 0 && (
                <Box className="step-panel">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                    <Box sx={{ width: 42, height: 42, borderRadius: "12px", bgcolor: `${ACCENT}18`, display: "flex", alignItems: "center", justifyContent: "center", color: ACCENT }}>
                      <PersonIcon />
                    </Box>
                    <Box>
                      <Typography fontWeight={800} sx={{ color: "#0a0e33", fontSize: "1.05rem" }}>Account Setup</Typography>
                      <Typography sx={{ color: grey[500], fontSize: "0.78rem" }}>Create your admin account</Typography>
                    </Box>
                  </Box>
                  <Stack spacing={2.5}>
                    <Field label="EMAIL ADDRESS" icon={<EmailIcon sx={{ fontSize: 16 }} />} error={errors.email}>
                      <TextField
                        fullWidth
                        type="email"
                        placeholder="e.g. admin@company.com"
                        value={form.email}
                        onChange={(e) => set("email", e.target.value)}
                        error={!!errors.email}
                        sx={inputSx(errors.email)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon sx={{ fontSize: 18, color: errors.email ? red[400] : ACCENT }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Field>
                    <Field label="PASSWORD" icon={<LockIcon sx={{ fontSize: 16 }} />} error={errors.password}>
                      <TextField
                        fullWidth
                        type={showPassword ? "text" : "password"}
                        placeholder="8+ characters"
                        value={form.password}
                        onChange={(e) => set("password", e.target.value)}
                        error={!!errors.password}
                        sx={inputSx(errors.password)}
                        InputProps={{
                          startAdornment: (<InputAdornment position="start"><LockIcon sx={{ fontSize: 18, color: errors.password ? red[400] : ACCENT }} /></InputAdornment>),
                          endAdornment: (<InputAdornment position="end"><IconButton aria-label="toggle password visibility" onClick={() => setShowPassword((show) => !show)} onMouseDown={(e) => e.preventDefault()} edge="end">{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>)
                        }}
                      />
                    </Field>
                  </Stack>
                </Box>
              )}

              {step === 1 && (
                <Box className="step-panel">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                    <Box sx={{ width: 42, height: 42, borderRadius: "12px", bgcolor: `${ACCENT}18`, display: "flex", alignItems: "center", justifyContent: "center", color: ACCENT }}>
                      <BusinessIcon />
                    </Box>
                    <Box>
                      <Typography fontWeight={800} sx={{ color: "#0a0e33", fontSize: "1.05rem" }}>Company Information</Typography>
                      <Typography sx={{ color: grey[500], fontSize: "0.78rem" }}>Tell us about your organisation</Typography>
                    </Box>
                  </Box>
                  <Field label="COMPANY NAME" icon={<BusinessIcon sx={{ fontSize: 16 }} />} error={errors.companyName}>
                    <TextField
                      fullWidth
                      placeholder="e.g. Acme Technologies Pvt. Ltd."
                      value={form.companyName}
                      onChange={(e) => set("companyName", e.target.value)}
                      error={!!errors.companyName}
                      sx={inputSx(errors.companyName)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <BusinessIcon sx={{ fontSize: 18, color: errors.companyName ? red[400] : ACCENT }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Field>
                  <Box sx={{ mt: 3, p: 2.5, bgcolor: `${ACCENT}08`, borderRadius: 2, border: `1px solid ${ACCENT}22` }}>
                    <Typography sx={{ fontSize: "0.78rem", color: grey[600], lineHeight: 1.6 }}>
                      💡 <strong>Tip:</strong> Use your official registered company name. This will appear across your workspace, reports, and invoices.
                    </Typography>
                  </Box>
                </Box>
              )}

              {step === 2 && (
                <Box className="step-panel">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                    <Box sx={{ width: 42, height: 42, borderRadius: "12px", bgcolor: `${blue[500]}18`, display: "flex", alignItems: "center", justifyContent: "center", color: blue[500] }}>
                      <LocationOnIcon />
                    </Box>
                    <Box>
                      <Typography fontWeight={800} sx={{ color: "#0a0e33", fontSize: "1.05rem" }}>Office Address</Typography>
                      <Typography sx={{ color: grey[500], fontSize: "0.78rem" }}>Your primary business location</Typography>
                    </Box>
                  </Box>

                  <Stack spacing={2.5}>
                    <Field label="STREET ADDRESS" icon={<HomeIcon sx={{ fontSize: 16 }} />} error={errors.street} color={blue[500]}>
                      <TextField
                        fullWidth
                        placeholder="e.g. 42 MG Road, Banjara Hills"
                        value={form.address.street}
                        onChange={(e) => setAddr("street", e.target.value)}
                        error={!!errors.street}
                        sx={inputSx(errors.street)}
                        InputProps={{ startAdornment: <InputAdornment position="start"><HomeIcon sx={{ fontSize: 18, color: errors.street ? red[400] : blue[500] }} /></InputAdornment> }}
                      />
                    </Field>

                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                      <Field label="CITY" icon={<LocationCityIcon sx={{ fontSize: 16 }} />} error={errors.city} color={blue[500]}>
                        <TextField
                          fullWidth
                          placeholder="e.g. Hyderabad"
                          value={form.address.city}
                          onChange={(e) => setAddr("city", e.target.value)}
                          error={!!errors.city}
                          sx={inputSx(errors.city)}
                          InputProps={{ startAdornment: <InputAdornment position="start"><LocationCityIcon sx={{ fontSize: 18, color: errors.city ? red[400] : blue[500] }} /></InputAdornment> }}
                        />
                      </Field>
                      <Field label="STATE / PROVINCE" icon={<MapIcon sx={{ fontSize: 16 }} />} error={errors.state} color={blue[500]}>
                        <TextField
                          fullWidth
                          placeholder="e.g. Telangana"
                          value={form.address.state}
                          onChange={(e) => setAddr("state", e.target.value)}
                          error={!!errors.state}
                          sx={inputSx(errors.state)}
                          InputProps={{ startAdornment: <InputAdornment position="start"><MapIcon sx={{ fontSize: 18, color: errors.state ? red[400] : blue[500] }} /></InputAdornment> }}
                        />
                      </Field>
                    </Box>

                    <Field label="COUNTRY" icon={<PublicIcon sx={{ fontSize: 16 }} />} error={errors.country} color={blue[500]}>
                      <TextField
                        select
                        fullWidth
                        value={form.address.country}
                        onChange={(e) => setAddr("country", e.target.value)}
                        error={!!errors.country}
                        sx={inputSx(errors.country)}
                        SelectProps={{ displayEmpty: true }}
                        InputProps={{ startAdornment: <InputAdornment position="start"><PublicIcon sx={{ fontSize: 18, color: errors.country ? red[400] : blue[500] }} /></InputAdornment> }}
                      >
                        <MenuItem value="" disabled sx={{ color: grey[400], fontStyle: "italic" }}>Select country…</MenuItem>
                        {COUNTRIES.map((c) => (
                          <MenuItem key={c} value={c} sx={{ fontFamily: "'Nunito', sans-serif", fontWeight: 600 }}>{c}</MenuItem>
                        ))}
                      </TextField>
                    </Field>
                  </Stack>
                </Box>
              )}

              {step === 3 && (
                <Box className="step-panel">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                    <Box sx={{ width: 42, height: 42, borderRadius: "12px", bgcolor: `${purple[500]}18`, display: "flex", alignItems: "center", justifyContent: "center", color: purple[500] }}>
                      <CategoryIcon />
                    </Box>
                    <Box>
                      <Typography fontWeight={800} sx={{ color: "#0a0e33", fontSize: "1.05rem" }}>Industry Sector</Typography>
                      <Typography sx={{ color: grey[500], fontSize: "0.78rem" }}>Helps us tailor your experience</Typography>
                    </Box>
                  </Box>

                  {errors.industry && <Alert severity="error" sx={{ mb: 2, borderRadius: 2, fontSize: "0.82rem" }}>{errors.industry}</Alert>}

                  <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 1.5 }}>
                    {INDUSTRIES.map((ind) => {
                      const color = industryColors[ind] || ACCENT;
                      const selected = form.industry === ind;
                      return (
                        <Box
                          key={ind}
                          onClick={() => { set("industry", ind); setErrors({}); }}
                          sx={{
                            p: 2,
                            borderRadius: "12px",
                            border: `2px solid ${selected ? color : grey[200]}`,
                            bgcolor: selected ? `${color}12` : WHITE,
                            cursor: "pointer",
                            transition: "all 0.2s",
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            "&:hover": { borderColor: color, bgcolor: `${color}08`, transform: "translateY(-2px)", boxShadow: `0 4px 14px ${color}22` },
                          }}
                        >
                          {selected && <CheckCircleIcon sx={{ fontSize: 16, color, flexShrink: 0 }} />}
                          <Typography sx={{ fontSize: "0.78rem", fontWeight: selected ? 800 : 600, color: selected ? color : grey[700], lineHeight: 1.3 }}>
                            {ind}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              )}

              {step === 4 && (
                <Box className="step-panel">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                    <Box sx={{ width: 42, height: 42, borderRadius: "12px", bgcolor: `${green[500]}18`, display: "flex", alignItems: "center", justifyContent: "center", color: green[500] }}>
                      <CheckCircleIcon />
                    </Box>
                    <Box>
                      <Typography fontWeight={800} sx={{ color: "#0a0e33", fontSize: "1.05rem" }}>Review & Confirm</Typography>
                      <Typography sx={{ color: grey[500], fontSize: "0.78rem" }}>Double-check your details before submitting</Typography>
                    </Box>
                  </Box>

                  <Paper elevation={0} sx={{ borderRadius: 3, border: `1px solid ${grey[200]}`, overflow: "hidden", mb: 2 }}>
                    <Box sx={{ bgcolor: `${ACCENT}0c`, px: 2.5, py: 1.25, borderBottom: `1px solid ${grey[100]}`, display: "flex", alignItems: "center", gap: 1 }}>
                      <PersonIcon sx={{ fontSize: 16, color: ACCENT }} />
                      <Typography sx={{ fontSize: "0.75rem", fontWeight: 800, color: ACCENT, textTransform: "uppercase", letterSpacing: "0.05em" }}>Account</Typography>
                    </Box>
                    <Box sx={{ px: 2.5, py: 1 }}>
                      <ReviewRow label="Email" value={form.email} color={ACCENT} />
                    </Box>
                  </Paper>

                  <Paper elevation={0} sx={{ borderRadius: 3, border: `1px solid ${grey[200]}`, overflow: "hidden", mb: 2 }}>
                    <Box sx={{ bgcolor: `${blue[500]}0c`, px: 2.5, py: 1.25, borderBottom: `1px solid ${grey[100]}`, display: "flex", alignItems: "center", gap: 1 }}>
                      <BusinessIcon sx={{ fontSize: 16, color: blue[500] }} />
                      <Typography sx={{ fontSize: "0.75rem", fontWeight: 800, color: blue[500], textTransform: "uppercase", letterSpacing: "0.05em" }}>Company</Typography>
                    </Box>
                    <Box sx={{ px: 2.5, py: 1 }}>
                      <ReviewRow label="Company Name" value={form.companyName} color={ACCENT} />
                    </Box>
                  </Paper>

                  <Paper elevation={0} sx={{ borderRadius: 3, border: `1px solid ${grey[200]}`, overflow: "hidden", mb: 2 }}>
                    <Box sx={{ bgcolor: `${purple[500]}0c`, px: 2.5, py: 1.25, borderBottom: `1px solid ${grey[100]}`, display: "flex", alignItems: "center", gap: 1 }}>
                      <LocationOnIcon sx={{ fontSize: 16, color: purple[500] }} />
                      <Typography sx={{ fontSize: "0.75rem", fontWeight: 800, color: purple[500], textTransform: "uppercase", letterSpacing: "0.05em" }}>Address</Typography>
                    </Box>
                    <Box sx={{ px: 2.5, py: 1 }}>
                      <ReviewRow label="Street" value={form.address.street} color={blue[500]} />
                      <ReviewRow label="City" value={form.address.city} color={blue[500]} />
                      <ReviewRow label="State" value={form.address.state} color={blue[500]} />
                      <ReviewRow label="Country" value={form.address.country} color={blue[500]} />
                    </Box>
                  </Paper>

                  <Paper elevation={0} sx={{ borderRadius: 3, border: `1px solid ${grey[200]}`, overflow: "hidden", mb: 3 }}>
                    <Box sx={{ bgcolor: `${yellow[700]}0c`, px: 2.5, py: 1.25, borderBottom: `1px solid ${grey[100]}`, display: "flex", alignItems: "center", gap: 1 }}>
                      <CategoryIcon sx={{ fontSize: 16, color: yellow[700] }} />
                      <Typography sx={{ fontSize: "0.75rem", fontWeight: 800, color: yellow[700], textTransform: "uppercase", letterSpacing: "0.05em" }}>Industry</Typography>
                    </Box>
                    <Box sx={{ px: 2.5, py: 1.5 }}>
                      <Chip
                        label={form.industry}
                        sx={{
                          bgcolor: `${industryColors[form.industry] || ACCENT}18`,
                          color: industryColors[form.industry] || ACCENT,
                          fontWeight: 800,
                          fontSize: "0.82rem",
                          border: `1px solid ${industryColors[form.industry] || ACCENT}44`,
                        }}
                      />
                    </Box>
                  </Paper>
                </Box>
              )}

              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2, pt: 3, borderTop: `1px solid ${grey[100]}` }}>
                <Button
                  onClick={back}
                  disabled={step === 0}
                  startIcon={<ArrowBackIcon />}
                  sx={{
                    borderRadius: "10px", px: 3, py: 1.25, fontWeight: 700, textTransform: "none", fontSize: "0.9rem",
                    color: step === 0 ? grey[300] : grey[600],
                    "&:hover": { bgcolor: `${ACCENT}08`, color: ACCENT },
                    visibility: step === 0 ? "hidden" : "visible",
                  }}
                >
                  Back
                </Button>

                {step < STEPS.length - 1 ? (
                  <Button
                    variant="contained"
                    onClick={next}
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      bgcolor: ACCENT, borderRadius: "10px", px: 4, py: 1.25, fontWeight: 800, textTransform: "none", fontSize: "0.9rem",
                      boxShadow: `0 6px 20px rgba(102,95,201,0.35)`,
                      "&:hover": { bgcolor: ACCENT_DARK, transform: "translateY(-1px)" }, transition: "all 0.2s",
                    }}
                  >
                    Continue
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={submitting}
                    startIcon={submitting ? <CircularProgress size={16} sx={{ color: "white" }} /> : <CheckCircleIcon />}
                    sx={{
                      bgcolor: green[600], borderRadius: "10px", px: 4, py: 1.25, fontWeight: 800, textTransform: "none", fontSize: "0.9rem",
                      boxShadow: `0 6px 20px ${green[200]}`,
                      "&:hover": { bgcolor: green[700], transform: "translateY(-1px)" },
                      "&:disabled": { bgcolor: grey[300] },
                      transition: "all 0.2s",
                    }}
                  >
                    {submitting ? "Registering…" : "Complete Registration"}
                  </Button>
                )}
              </Box>
            </Box>
          </Paper>

          <Typography sx={{ textAlign: "center", mt: 2.5, fontSize: "0.78rem", color: grey[500] }}>
            Already registered?{" "}
            <Box component="span" onClick={() => navigate("/")} sx={{ color: ACCENT, fontWeight: 800, cursor: "pointer", "&:hover": { textDecoration: "underline" } }}>
              Go to Dashboard →
            </Box>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default RegisterPage;