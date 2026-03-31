import { useState } from "react";
import { TextField, Button, Box, Typography, Paper, Link, CssBaseline, CircularProgress, IconButton, InputAdornment } from "@mui/material";
import { PersonAddOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.confirmPassword) return setError("Passwords do not match!");
    
    try {
      setLoading(true);
      await API.post("/auth/register", { name: formData.name, email: formData.email, password: formData.password });
      alert("Registration Successful!");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally { setLoading(false); }
  };

  return (
    <Box sx={{ position: "fixed", inset: 0, display: "flex", justifyContent: "center", alignItems: "center", background: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)" }}>
      <CssBaseline /> 
      <Paper elevation={0} sx={{ p: 4, width: "90%", maxWidth: 400, borderRadius: 5, textAlign: "center", background: "rgba(255, 255, 255, 0.92)", backdropFilter: "blur(12px)", border: "1px solid rgba(255, 255, 255, 0.4)", boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}>
        <Box sx={{ mb: 1, display: 'flex', justifyContent: 'center' }}><Box sx={{ bgcolor: '#6366F1', color: 'white', p: 1.5, borderRadius: '50%', display: 'flex' }}><PersonAddOutlined fontSize="small" /></Box></Box>
        <Typography variant="h5" fontWeight="900" color="#1E293B">Register</Typography>
        {error && <Typography color="error" variant="caption" sx={{ fontWeight: '700', mt: 1, display: 'block' }}>{error}</Typography>}
        <form onSubmit={handleSubmit}>
          <TextField size="small" fullWidth label="Full Name" margin="dense" onChange={e => setFormData({...formData, name: e.target.value})} />
          <TextField size="small" fullWidth label="Email" margin="dense" onChange={e => setFormData({...formData, email: e.target.value})} />
          <TextField size="small" fullWidth label="Password" margin="dense" type={showPassword ? "text" : "password"} onChange={e => setFormData({...formData, password: e.target.value})} InputProps={{ endAdornment: <InputAdornment position="end"><IconButton size="small" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}</IconButton></InputAdornment> }} />
          <TextField size="small" fullWidth label="Confirm Password" margin="dense" type="password" onChange={e => setFormData({...formData, confirmPassword: e.target.value})} error={formData.confirmPassword !== "" && formData.password !== formData.confirmPassword} />
          <Button type="submit" fullWidth variant="contained" disabled={loading} sx={{ mt: 3, py: 1.2, borderRadius: 2.5, fontWeight: '700', bgcolor: '#6366F1', textTransform: 'none' }}>{loading ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}</Button>
          <Typography variant="body2" sx={{ mt: 2 }}>Already a member? <Link component="button" type="button" onClick={() => navigate("/login")} sx={{ color: "#6366F1", fontWeight: "700", textDecoration: "none" }}>Log In</Link></Typography>
        </form>
      </Paper>
    </Box>
  );
}