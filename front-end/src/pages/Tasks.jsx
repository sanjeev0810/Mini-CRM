import { useState, useEffect } from "react";
import { 
  Box, Typography, Button, Paper, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, 
  CircularProgress, Chip 
} from "@mui/material";
import { Add, CheckCircle, Replay } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Tasks() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await API.get("/tasks");
      setTasks(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ✅ Toggle function: Switches between Pending and Completed
  const handleStatusToggle = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "Completed" ? "Pending" : "Completed";
      await API.put(`/tasks/${id}`, { status: newStatus });
      fetchTasks(); // Refresh list to update Dashboard counts
    } catch (err) {
      alert("Error updating task status");
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4, alignItems: "center" }}>
        <Typography variant="h5" fontWeight="700">Tasks</Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />} 
          onClick={() => navigate("/add-task")}
          sx={{ bgcolor: "#6366F1", textTransform: "none", borderRadius: 2 }}
        >
          Add Task
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: "1px solid #E2E8F0" }}>
        <Table>
          <TableHead sx={{ bgcolor: "#F8FAFC" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "700" }}>Title</TableCell>
              <TableCell sx={{ fontWeight: "700" }}>Lead</TableCell>
              <TableCell sx={{ fontWeight: "700" }}>Due Date</TableCell>
              <TableCell sx={{ fontWeight: "700" }}>Status</TableCell>
              <TableCell align="right" sx={{ fontWeight: "700" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                  <CircularProgress size={30} />
                </TableCell>
              </TableRow>
            ) : tasks.length > 0 ? (
              tasks.map((task) => (
                <TableRow key={task._id} hover>
                  <TableCell sx={{ 
                    textDecoration: task.status === "Completed" ? "line-through" : "none",
                    color: task.status === "Completed" ? "text.secondary" : "inherit"
                  }}>
                    {task.title}
                  </TableCell>
                  <TableCell>{task.lead?.name || "—"}</TableCell>
                  <TableCell>
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-GB', {
                      day: '2-digit', month: 'short'
                    }) : "—"}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={task.status} 
                      size="small"
                      color={task.status === "Completed" ? "success" : "warning"}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Button 
                      size="small" 
                      variant="outlined" 
                      color={task.status === "Completed" ? "secondary" : "success"}
                      startIcon={task.status === "Completed" ? <Replay /> : <CheckCircle />}
                      onClick={() => handleStatusToggle(task._id, task.status)}
                      sx={{ textTransform: "none", fontSize: "0.75rem" }}
                    >
                      {task.status === "Completed" ? "Reopen" : "Done"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                  <Typography color="textSecondary">No tasks found.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}