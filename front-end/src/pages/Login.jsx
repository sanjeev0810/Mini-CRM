import { useState, useEffect } from "react";
import { TextField, Button, Box, Typography, Paper, IconButton, InputAdornment, CircularProgress, CssBaseline } from "@mui/material";
import { Visibility, VisibilityOff, LockOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Login() {
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { document.title = "Login | Mini CRM"; }, []);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());

  const handleLogin = async () => {
    setError("");
    if (!data.email || !data.password) return setError("Please fill in all fields.");
    if (!validateEmail(data.email)) return setError("Invalid email address.");

    try {
      setLoading(true);
      const res = await API.post("/auth/login", data);
      
      // Save Token and User object for the MainLayout
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user)); 

      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ position: "fixed", inset: 0, display: "flex", justifyContent: "center", alignItems: "center", background: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)", overflow: "hidden" }}>
      <CssBaseline /> 
      <Paper elevation={24} sx={{ p: 5, width: "100%", maxWidth: 400, borderRadius: 6, textAlign: "center", backgroundColor: "rgba(255, 255, 255, 0.98)" }}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ bgcolor: '#6366F1', color: 'white', p: 2, borderRadius: '50%', boxShadow: '0 8px 16px rgba(99, 102, 241, 0.3)' }}>
            <LockOutlined fontSize="large" />
          </Box>
        </Box>
        <Typography variant="h4" fontWeight="900" color="#1E293B" gutterBottom>Login</Typography>
        <Typography variant="body2" color="text.secondary" mb={4}>Please enter your details to continue</Typography>
        {error && <Typography color="error" variant="caption" sx={{ fontWeight: 'bold', mb: 2, display: 'block' }}>{error}</Typography>}
        <TextField fullWidth label="Email" variant="outlined" margin="normal" autoComplete="username" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} />
        <TextField fullWidth label="Password" variant="outlined" margin="normal" autoComplete="current-password" type={showPassword ? "text" : "password"} value={data.password} onChange={(e) => setData({ ...data, password: e.target.value })} onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          InputProps={{ endAdornment: ( <InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)}>{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment> ) }}
        />
        <Button fullWidth size="large" variant="contained" onClick={handleLogin} disabled={loading} sx={{ mt: 4, py: 1.8, borderRadius: 3, fontWeight: '800', backgroundColor: '#6366F1', '&:hover': { backgroundColor: '#4F46E5' }, textTransform: 'none' }}>
          {loading ? <CircularProgress size={26} color="inherit" /> : "Sign In"}
        </Button>
      </Paper>
    </Box>
  );
}