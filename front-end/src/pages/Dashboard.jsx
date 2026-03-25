import { useState, useEffect } from "react";
import { Box, Typography, Grid, Paper, CircularProgress, Container } from "@mui/material";
import API from "../services/api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalLeads: 0,
    qualifiedLeads: 0,
    tasksDueToday: 0,
    completedTasks: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await API.get("/dashboard/stats");
      // This sets the 4 counters from your aggregation API
      setStats(res.data);
    } catch (err) {
      console.error("Dashboard Load Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
      <CircularProgress />
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h5" fontWeight="700" mb={4} color="#1E293B">
        Dashboard
      </Typography>

      <Grid container spacing={4}>
        {/* TOP ROW: LEADS */}
        <Grid item xs={12} sm={6}>
          <Paper elevation={0} sx={{ p: 5, textAlign: 'center', border: "1px solid #E2E8F0", borderRadius: 2 }}>
            <Typography variant="subtitle1" color="textSecondary" fontWeight="600" mb={1}>
              Total Leads
            </Typography>
            <Typography variant="h2" fontWeight="800" color="#6366F1">
              [ {stats.totalLeads} ]
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Paper elevation={0} sx={{ p: 5, textAlign: 'center', border: "1px solid #E2E8F0", borderRadius: 2 }}>
            <Typography variant="subtitle1" color="textSecondary" fontWeight="600" mb={1}>
              Qualified Leads
            </Typography>
            <Typography variant="h2" fontWeight="800" color="#10B981">
              [ {stats.qualifiedLeads} ]
            </Typography>
          </Paper>
        </Grid>

        {/* BOTTOM ROW: TASKS */}
        <Grid item xs={12} sm={6}>
          <Paper elevation={0} sx={{ p: 5, textAlign: 'center', border: "1px solid #E2E8F0", borderRadius: 2 }}>
            <Typography variant="subtitle1" color="textSecondary" fontWeight="600" mb={1}>
              Tasks Due Today
            </Typography>
            <Typography variant="h2" fontWeight="800" color="#F59E0B">
              [ {stats.tasksDueToday} ]
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Paper elevation={0} sx={{ p: 5, textAlign: 'center', border: "1px solid #E2E8F0", borderRadius: 2 }}>
            <Typography variant="subtitle1" color="textSecondary" fontWeight="600" mb={1}>
              Completed Tasks
            </Typography>
            <Typography variant="h2" fontWeight="800" color="#64748B">
              [ {stats.completedTasks} ]
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}