import { useState, useEffect } from "react";
import { Box, Typography, Paper, CircularProgress, Container, Avatar, IconButton, Tooltip, Fade } from "@mui/material";
import { Groups, Verified, EventNote, TaskAlt, PendingActions, Refresh } from "@mui/icons-material";
import API from "../services/api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalLeads: 0,
    qualifiedLeads: 0,
    tasksDueToday: 0,
    pendingTasks: 0,
    completedTasks: 0
  });
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      if (!isRefreshing) setLoading(true);
      const res = await API.get("/dashboard/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Dashboard Load Error:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <CircularProgress sx={{ color: "#6366F1" }} />
    </Box>
  );

  // 💎 Premium Stat Card Component
  const StatCard = ({ title, value, icon, color, subColor }) => (
    <Paper elevation={0} sx={{ 
      p: 3, 
      borderRadius: 4, 
      background: "#ffffff", 
      border: "1px solid #E2E8F0", 
      boxShadow: "0 10px 30px -10px rgba(0,0,0,0.05)",
      height: '100%', 
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      "&:hover": { 
        transform: "translateY(-4px)", 
        boxShadow: `0 14px 28px -10px ${subColor.replace('0.15)', '0.4)')}`,
        borderColor: color
      }
    }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1.5 }}>
        <Avatar sx={{ bgcolor: subColor, color: color, width: 48, height: 48 }}>
          {icon}
        </Avatar>
        <Typography variant="h3" fontWeight="900" sx={{ color: "#0F172A", letterSpacing: -1 }}>
          {value}
        </Typography>
      </Box>
      <Typography variant="caption" sx={{ color: "#64748B", fontWeight: "800", textTransform: 'uppercase', letterSpacing: 1 }}>
        {title}
      </Typography>
    </Paper>
  );

  return (
    <Fade in={true} timeout={500}>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        
        {/* HEADER SECTION */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" fontWeight="900" color="#0F172A" sx={{ letterSpacing: -1 }}>
              System Metrics
            </Typography>
            <Typography variant="body2" color="#64748B" sx={{ mt: 0.5 }}>
              Live operational data from your CRM database
            </Typography>
          </Box>
          
          <Tooltip title="Refresh Data">
            <IconButton 
              onClick={() => { setIsRefreshing(true); fetchStats(); }} 
              disabled={isRefreshing}
              sx={{ 
                bgcolor: '#FFFFFF', 
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)', 
                '&:hover': { bgcolor: '#F8FAFC' } 
              }}
            >
              <Refresh sx={{ 
                color: "#6366F1", 
                animation: isRefreshing ? "spin 1s linear infinite" : "none", 
                "@keyframes spin": { "0%": { transform: "rotate(0deg)" }, "100%": { transform: "rotate(360deg)" } } 
              }} />
            </IconButton>
          </Tooltip>
        </Box>

        {/* --- BULLETPROOF CSS GRID: Perfect 5 Columns --- */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr',           // Mobile: 1 column
            sm: '1fr 1fr',       // Tablet: 2 columns
            md: 'repeat(5, 1fr)' // Desktop: Exactly 5 equal columns
          }, 
          gap: 3 
        }}>
          <StatCard title="Total Leads" value={stats.totalLeads} icon={<Groups fontSize="small"/>} color="#6366F1" subColor="rgba(99, 102, 241, 0.15)" />
          <StatCard title="Qualified" value={stats.qualifiedLeads} icon={<Verified fontSize="small"/>} color="#10B981" subColor="rgba(16, 185, 129, 0.15)" />
          <StatCard title="Pending" value={stats.pendingTasks} icon={<PendingActions fontSize="small"/>} color="#F59E0B" subColor="rgba(245, 158, 11, 0.15)" />
          <StatCard title="Due Today" value={stats.tasksDueToday} icon={<EventNote fontSize="small"/>} color="#EF4444" subColor="rgba(239, 68, 68, 0.15)" />
          <StatCard title="Completed" value={stats.completedTasks} icon={<TaskAlt fontSize="small"/>} color="#64748B" subColor="rgba(100, 116, 139, 0.15)" />
        </Box>

        {/* Placeholder for future Charts */}
        <Box sx={{ 
          mt: 5, p: 10, textAlign: 'center', 
          border: '2px dashed #CBD5E1', borderRadius: 4, 
          bgcolor: 'rgba(248, 250, 252, 0.5)' 
        }}>
        <Typography variant="h4" color="text.secondary" fontWeight="900">Welcome...</Typography>
        </Box>
        
      </Container>
    </Fade>
  );
}