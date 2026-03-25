import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, AppBar, Toolbar, Typography, Button, Box, CssBaseline, Avatar, Divider } from "@mui/material";
import { Dashboard, Work, Business, Assignment, Logout } from "@mui/icons-material";

const drawerWidth = 260;

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState({ name: "User", email: "" });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const menu = [
    { text: "Dashboard", path: "/dashboard", icon: <Dashboard /> },
    { text: "Leads", path: "/leads", icon: <Work /> },
    { text: "Companies", path: "/companies", icon: <Business /> },
    { text: "Tasks", path: "/tasks", icon: <Assignment /> }
  ];

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", width: "100vw", overflow: "hidden", bgcolor: "#F8FAFC" }}>
      <CssBaseline />
      <Drawer variant="permanent" sx={{ width: drawerWidth, flexShrink: 0, "& .MuiDrawer-paper": { width: drawerWidth, backgroundColor: "#0f2027", backgroundImage: "linear-gradient(180deg, #0f2027 0%, #203a43 100%)", color: "#fff", border: "none" } }}>
        <Box sx={{ p: 3, mb: 2, textAlign: "center" }}>
          <Typography variant="h5" fontWeight="900">Mini CRM</Typography>
        </Box>
        <List sx={{ px: 2, flexGrow: 1 }}>
          {menu.map((item) => (
            <ListItemButton key={item.text} onClick={() => navigate(item.path)} selected={location.pathname === item.path} sx={{ borderRadius: 2, mb: 1, "&.Mui-selected": { bgcolor: "rgba(99, 102, 241, 0.2)" }, "&:hover": { bgcolor: "rgba(255,255,255,0.05)" } }}>
              <ListItemIcon sx={{ color: location.pathname === item.path ? "#6366F1" : "#94A3B8", minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
        </List>
        <Box sx={{ p: 2 }}>
          <Button fullWidth startIcon={<Logout />} onClick={logout} sx={{ color: "#ff7675", justifyContent: "flex-start", textTransform: "none" }}>Logout</Button>
        </Box>
      </Drawer>
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <AppBar position="static" elevation={0} sx={{ bgcolor: "#fff", borderBottom: "1px solid #e0e0e0", color: "#333" }}>
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Typography variant="h6" fontWeight="700">{menu.find(m => m.path === location.pathname)?.text || "Dashboard"}</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ textAlign: "right" }}>
                <Typography variant="body2" fontWeight="700">{user.name}</Typography>
                <Typography variant="caption" color="text.secondary">{user.email}</Typography>
              </Box>
              <Avatar sx={{ bgcolor: "#6366F1" }}>{user.name.charAt(0).toUpperCase()}</Avatar>
            </Box>
          </Toolbar>
        </AppBar>
        <Box component="main" sx={{ flexGrow: 1, p: 4, overflowY: "auto" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}