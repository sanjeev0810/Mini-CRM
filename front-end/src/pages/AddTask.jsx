import { useState, useEffect } from "react";
import { 
  TextField, Button, MenuItem, Box, Typography, 
  Paper, Grid, CircularProgress, Container 
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function AddTask() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingLeads, setFetchingLeads] = useState(true);

  const [task, setTask] = useState({
    title: "",
    lead: "",
    dueDate: new Date().toISOString().split('T')[0],
    status: "Pending"
  });

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setFetchingLeads(true);
        const res = await API.get("/leads");
        const data = Array.isArray(res.data) ? res.data : (res.data.leads || []);
        setLeads(data);
      } catch (err) {
        console.error("Error fetching leads:", err);
      } finally {
        setFetchingLeads(false);
      }
    };
    fetchLeads();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task.lead) return alert("Please select a lead");
    try {
      setLoading(true);
      await API.post("/tasks", task);
      navigate("/tasks");
    } catch (err) {
      alert("Error creating task.");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingLeads) return <Box sx={{ textAlign: 'center', mt: 10 }}><CircularProgress /></Box>;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h5" fontWeight="700" mb={3}>Create New Task</Typography>

      <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: "1px solid #E2E8F0" }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            
            {/* Title Field */}
            <Grid size={{ xs: 12 }}> 
              <TextField 
                fullWidth 
                label="Task Title" 
                required 
                value={task.title} 
                onChange={(e) => setTask({ ...task, title: e.target.value })} 
              />
            </Grid>

            {/* Lead Selection with Scroll Limit */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField 
                select 
                fullWidth 
                label="Related Lead" 
                required
                value={task.lead} 
                onChange={(e) => setTask({ ...task, lead: e.target.value })}
                // ✅ UI Tip: Added Scroll Limit and Accessibility Fix
                SelectProps={{
                  MenuProps: { 
                    disableAutoFocusItem: true,
                    PaperProps: {
                      style: {
                        maxHeight: 300, // ✅ Keeps the menu at a fixed height
                        width: 250,      // ✅ Keeps the width consistent
                      },
                    },
                  }
                }}
              >
                <MenuItem value=""><em>-- Select a Lead --</em></MenuItem>
                {leads.map((l) => (
                  <MenuItem key={l._id} value={l._id}>{l.name}</MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Date Field */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField 
                fullWidth 
                label="Due Date" 
                type="date" 
                required
                InputLabelProps={{ shrink: true }}
                value={task.dueDate} 
                onChange={(e) => setTask({ ...task, dueDate: e.target.value })} 
              />
            </Grid>

            <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
              <Button type="submit" variant="contained" disabled={loading} sx={{ bgcolor: "#6366F1", px: 4 }}>
                {loading ? "Saving..." : "Save Task"}
              </Button>
              <Button sx={{ ml: 2 }} onClick={() => navigate("/tasks")}>Cancel</Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}