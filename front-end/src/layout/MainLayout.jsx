import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { 
  Drawer, List, ListItemButton, ListItemIcon, ListItemText, 
  AppBar, Toolbar, Typography, Button, Box, CssBaseline, 
  Avatar, Divider, Tooltip 
} from "@mui/material";
import { 
  Dashboard, Work, Business, Assignment, Logout, 
  AccountCircle, NotificationsNone 
} from "@mui/icons-material";

const drawerWidth = 260;

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState({ name: "User", email: "user@example.com" });

  useEffect(() => {
    // ✅ Safely retrieve user data
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing user data");
      }
    }
  }, []);

  const menu = [
    { text: "Dashboard", path: "/dashboard", icon: <Dashboard /> },
    { text: "Leads", path: "/leads", icon: <Work /> },
    { text: "Companies", path: "/companies", icon: <Business /> },
    { text: "Tasks", path: "/tasks", icon: <Assignment /> }
  ];

  const handleLogout = () => {
    // ✅ Clear specific items to keep app settings if needed, or clear all for total logout
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload(); // Ensures the state is fully reset
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", width: "100vw", overflow: "hidden", bgcolor: "#F1F5F9" }}>
      <CssBaseline />
      
      {/* --- SIDEBAR --- */}
      <Drawer 
        variant="permanent" 
        sx={{ 
          width: drawerWidth, 
          flexShrink: 0, 
          "& .MuiDrawer-paper": { 
            width: drawerWidth, 
            backgroundColor: "#0f2027", 
            backgroundImage: "linear-gradient(180deg, #0f2027 0%, #203a43 100%)", 
            color: "#fff", 
            border: "none",
            display: "flex",
            flexDirection: "column"
          } 
        }}
      >
        <Box sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h5" fontWeight="900" sx={{ letterSpacing: 1, color: "#6366F1" }}>
            MINI CRM
          </Typography>
        </Box>

        <List sx={{ px: 2, flexGrow: 1 }}>
          {menu.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItemButton 
                key={item.text} 
                onClick={() => navigate(item.path)} 
                selected={isActive} 
                sx={{ 
                  borderRadius: 2, 
                  mb: 1, 
                  py: 1.2,
                  "&.Mui-selected": { 
                    bgcolor: "rgba(99, 102, 241, 0.15)",
                    borderLeft: "4px solid #6366F1",
                    "&:hover": { bgcolor: "rgba(99, 102, 241, 0.25)" }
                  }, 
                  "&:hover": { bgcolor: "rgba(255,255,255,0.05)" } 
                }}
              >
                <ListItemIcon sx={{ color: isActive ? "#6366F1" : "#94A3B8", minWidth: 45 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ fontWeight: isActive ? "700" : "500", fontSize: "0.95rem" }} 
                />
              </ListItemButton>
            );
          })}
        </List>

        <Divider sx={{ bgcolor: "rgba(255,255,255,0.1)", mx: 2 }} />

        {/* --- LOGOUT BUTTON --- */}
        <Box sx={{ p: 2 }}>
          <Button 
            fullWidth 
            startIcon={<Logout />} 
            onClick={handleLogout} 
            sx={{ 
              color: "#FDA4AF", 
              justifyContent: "flex-start", 
              textTransform: "none",
              fontWeight: "600",
              borderRadius: 2,
              "&:hover": { bgcolor: "rgba(253, 164, 175, 0.1)" }
            }}
          >
            Logout
          </Button>
        </Box>
      </Drawer>

      {/* --- MAIN CONTENT AREA --- */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        
        {/* --- TOP NAVBAR --- */}
        <AppBar position="static" elevation={0} sx={{ bgcolor: "#fff", borderBottom: "1px solid #E2E8F0", color: "#1E293B" }}>
          <Toolbar sx={{ justifyContent: "space-between", px: 3 }}>
            <Typography variant="h6" fontWeight="800">
              {menu.find(m => m.path === location.pathname)?.text || "Dashboard"}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              {/* Profile Section */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box sx={{ textAlign: "right", display: { xs: "none", sm: "block" } }}>
                  <Typography variant="body2" fontWeight="800" sx={{ color: "#1E293B" }}>
                    {user.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#64748B", display: "block" }}>
                    {user.email}
                  </Typography>
                </Box>
                <Avatar 
                  sx={{ 
                    bgcolor: "#6366F1", 
                    width: 40, 
                    height: 40, 
                    fontSize: "1rem", 
                    fontWeight: "bold",
                    boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)" 
                  }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>

        {/* --- DYNAMIC PAGE CONTENT --- */}
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            p: { xs: 2, md: 4 }, 
            overflowY: "auto",
            "&::-webkit-scrollbar": { width: "6px" },
            "&::-webkit-scrollbar-thumb": { bgcolor: "#CBD5E1", borderRadius: "10px" }
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}