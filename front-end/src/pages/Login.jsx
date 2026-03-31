import { useState } from "react";
import { TextField, Button, Box, Typography, Paper, IconButton, InputAdornment, CircularProgress, CssBaseline, Link } from "@mui/material";
import { Visibility, VisibilityOff, LockOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Login() {
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // ✅ Add manual frontend validation
    if (!data.email || !data.password) {
      setError("Please fill in all fields.");
      return;
    }

    setError("");
    try {
      setLoading(true);
      const res = await API.post("/auth/login", data);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user || res.data));
      navigate("/dashboard");
      window.location.reload(); 
    } catch (err) { 
      setError("Invalid email or password."); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <Box sx={{ position: "fixed", inset: 0, display: "flex", justifyContent: "center", alignItems: "center", background: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)" }}>
      <CssBaseline /> 
      <Paper elevation={0} sx={{ p: 4, width: "90%", maxWidth: 400, borderRadius: 5, textAlign: "center", background: "rgba(255, 255, 255, 0.92)", backdropFilter: "blur(12px)", border: "1px solid rgba(255, 255, 255, 0.4)", boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}>
        <Box sx={{ mb: 1, display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ bgcolor: '#6366F1', color: 'white', p: 1.5, borderRadius: '50%', display: 'flex' }}>
            <LockOutlined fontSize="small" />
          </Box>
        </Box>
        <Typography variant="h5" fontWeight="900" color="#1E293B">Login</Typography>
        
        {error && <Typography color="error" variant="caption" sx={{ fontWeight: '700', mt: 1, display: 'block' }}>{error}</Typography>}
        
        <form onSubmit={handleLogin}>
          {/* ✅ Added 'required' to Email */}
          <TextField 
            required 
            size="small" 
            fullWidth 
            label="Email" 
            margin="dense" 
            onChange={e => setData({...data, email: e.target.value})} 
          />
          
          {/* ✅ Added 'required' to Password */}
          <TextField 
            required 
            size="small" 
            fullWidth 
            label="Password" 
            margin="dense" 
            type={showPassword ? "text" : "password"} 
            onChange={e => setData({...data, password: e.target.value})} 
            InputProps={{ 
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ) 
            }} 
          />
          
          <Button 
            type="submit" 
            fullWidth 
            variant="contained" 
            disabled={loading} 
            sx={{ mt: 3, py: 1.2, borderRadius: 2.5, fontWeight: '700', bgcolor: '#6366F1', textTransform: 'none' }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
          </Button>
          
          <Typography variant="body2" sx={{ mt: 2 }}>
            Need an account? <Link component="button" type="button" onClick={() => navigate("/")} sx={{ color: "#6366F1", fontWeight: "700", textDecoration: "none" }}>Sign Up</Link>
          </Typography>
        </form>
      </Paper>
    </Box>
  );
}