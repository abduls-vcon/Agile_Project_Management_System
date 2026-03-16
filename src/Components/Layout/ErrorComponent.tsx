import { Box, Typography, Button } from "@mui/material";
import NotFound from "../../assets/not-found.jpg";
import { blue, grey } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
type ErrorProps = {
  title: string;
};
const ErrorComponent: React.FC<ErrorProps> = ({ title }) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        gap: 5,
      }}
    >
      <img
        src={NotFound}
        alt="NotFound"
        style={{ maxWidth: "10%", height: "auto" }}
      />
      <Typography
        sx={{ fontSize: 35, mt: 2, fontWeight: "bold", color: grey[700] }}
      >
        {title}
      </Typography>
      <Button
        sx={{
          background: blue[500],
          px: 5,
          py: 1,
          color: "white",
          fontWeight: "medium",
        }}
        onClick={() => navigate("/")}
      >
        Go Back
      </Button>
    </Box>
  );
};

export default ErrorComponent;
