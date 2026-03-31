import { useState, useEffect } from "react";
import { 
  Box, Typography, Button, Paper, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, 
  CircularProgress, Chip, TextField, MenuItem, IconButton, Tooltip, Container, Avatar, Pagination, Fade
} from "@mui/material";
import { Add, CheckCircle, Replay, Edit , Delete, Assignment, Person } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Tasks() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/tasks?search=${search}&status=${statusFilter}&page=${page}`);
      setTasks(res.data.tasks || (Array.isArray(res.data) ? res.data : []));
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [search, statusFilter, page]);

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "Completed" ? "Pending" : "Completed";
      await API.put(`/tasks/${id}`, { status: newStatus });
      fetchTasks(); 
    } catch (err) {
      alert("Error updating task status");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await API.delete(`/tasks/${id}`);
        fetchTasks();
      } catch (err) {
        alert("Error deleting task");
      }
    }
  };

  return (
    <Fade in={true} timeout={500}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        
        {/* HEADER SECTION */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4, alignItems: "center" }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: '#F59E0B', boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)' }}>
              <Assignment />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight="900" color="#1E293B" sx={{ letterSpacing: -1 }}>Tasks</Typography>
              <Typography variant="body2" color="text.secondary">Operational workflow management</Typography>
            </Box>
          </Box>
          <Button 
            variant="contained" 
            startIcon={<Add />} 
            onClick={() => navigate("/add-task")}
            sx={{ 
              background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)", 
              textTransform: "none", fontWeight: '800', 
              borderRadius: 2, px: 3, py: 1, 
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
              "&:hover": { transform: 'translateY(-1px)', boxShadow: '0 6px 16px rgba(245, 158, 11, 0.4)' } 
            }}
          >
            Add Task
          </Button>
        </Box>

        {/* SEARCH & FILTER BAR */}
        <Paper sx={{ 
          p: 2.5, mb: 4, display: "flex", gap: 3, borderRadius: 4, 
          background: "rgba(255, 255, 255, 0.8)", backdropFilter: "blur(10px)", 
          border: "1px solid rgba(226, 232, 240, 0.8)", boxShadow: "0 10px 30px rgba(0,0,0,0.03)" 
        }}>
          <TextField 
            label="Search tasks..." size="large" sx={{ flexGrow: 1 }}
            value={search} onChange={(e) => setSearch(e.target.value)} 
            InputProps={{ sx: { borderRadius: 2, bgcolor: '#F8FAFC' } }}
          />
          <TextField 
            select label="Status Filter" size="large" sx={{ width: 220 }} 
            value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            InputProps={{ sx: { borderRadius: 2, bgcolor: '#F8FAFC' } }}
          >
            <MenuItem value="">All Statuses</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </TextField>
        </Paper>

        {/* MAIN TABLE SECTION */}
        <TableContainer component={Paper} sx={{ 
          borderRadius: 4, background: "#ffffff", 
          border: "1px solid #E2E8F0", boxShadow: "0 10px 40px -10px rgba(0,0,0,0.08)" 
        }}>
          <Table>
            <TableHead sx={{ bgcolor: "#F8FAFC" }}>
              <TableRow>
                {/* ✅ Added specific width percentages to lock the spacing in place */}
                <TableCell sx={{ width: '30%', fontWeight: "800", color: "#64748B", py: 2 }}>TASK TITLE</TableCell>
                <TableCell sx={{ width: '25%', fontWeight: "800", color: "#64748B" }}>ASSOCIATED LEAD</TableCell>
                <TableCell sx={{ width: '15%', fontWeight: "800", color: "#64748B" }}>DUE DATE</TableCell>
                <TableCell sx={{ width: '15%', fontWeight: "800", color: "#64748B" }}>STATUS</TableCell>
                <TableCell sx={{ width: '15%', fontWeight: "800", color: "#64748B" }} align="right">ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                    <CircularProgress size={40} sx={{ color: "#F59E0B" }} />
                  </TableCell>
                </TableRow>
              ) : tasks.length > 0 ? (
                tasks.map((task) => {
                  const isDone = task.status === "Completed";
                  return (
                    <TableRow 
                      key={task._id} 
                      hover 
                      sx={{ 
                        transition: 'all 0.2s', 
                        bgcolor: isDone ? '#F8FAFC' : 'inherit',
                        borderLeft: isDone ? '3px solid #10B981' : '3px solid transparent'
                      }}
                    >
                      
                      <TableCell>
                        <Typography fontWeight={isDone ? "600" : "800"} sx={{ color: isDone ? '#64748B' : '#1E293B' }}>
                          {task.title}
                        </Typography>
                      </TableCell>
                      
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Person sx={{ fontSize: 16, color: '#94A3B8' }} />
                          <Typography fontWeight="600" color={isDone ? "#94A3B8" : (task.lead ? "#334155" : "#94A3B8")}>
                            {task.lead?.name || "—"}
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell sx={{ fontWeight: "600", color: isDone ? "#94A3B8" : "#64748B" }}>
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "—"}
                      </TableCell>

                      <TableCell>
                        <Chip 
                          label={task.status} 
                          size="small"
                          sx={{ 
                            fontWeight: '800', fontSize: '0.75rem', borderRadius: 1.5,
                            bgcolor: isDone ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                            color: isDone ? '#059669' : '#D97706',
                            border: 'none'
                          }} 
                        />
                      </TableCell>

                      <TableCell align="right">
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, alignItems: 'center' }}>
                          
                          {isDone ? (
                            <Button 
                              size="small" 
                              variant="outlined"
                              onClick={() => handleStatusToggle(task._id, task.status)} 
                              startIcon={<Replay />}
                              sx={{ 
                                color: '#94A3B8', borderColor: '#E2E8F0',
                                '&:hover': { borderColor: '#F59E0B', color: '#F59E0B', bgcolor: 'rgba(245, 158, 11, 0.05)' }, 
                                borderRadius: 2, textTransform: 'none', fontWeight: 700, px: 1.5, py: 0.5 
                              }}
                            >
                              Reopen
                            </Button>
                          ) : (
                            <Button 
                              size="small" 
                              variant="contained"
                              disableElevation
                              onClick={() => handleStatusToggle(task._id, task.status)} 
                              startIcon={<CheckCircle />}
                              sx={{ 
                                color: '#475569', bgcolor: '#F1F5F9',
                                '&:hover': { bgcolor: '#10B981', color: '#FFFFFF', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }, 
                                borderRadius: 2, textTransform: 'none', fontWeight: 700, px: 1.5, py: 0.5 
                              }}
                            >
                              Complete
                            </Button>
                          )}

                          {/* <Tooltip title="Edit Task">
                            <IconButton size="small" sx={{ color: '#94A3B8', '&:hover': { color: '#6366F1' } }} onClick={() => navigate(`/edit-task/${task._id}`)}>
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip> */}
                          <Tooltip title="Delete Task">
                            <IconButton size="small" sx={{ color: '#94A3B8', '&:hover': { color: '#EF4444' } }} onClick={() => handleDelete(task._id)}>
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>

                        </Box>
                      </TableCell>

                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                    <Typography color="textSecondary" fontWeight="600">No tasks match your search criteria.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* PAGINATION */}
        {/* <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={(e, v) => setPage(v)} 
            color="primary" 
            sx={{ '& .MuiPaginationItem-root': { fontWeight: '800' } }}
          />
        </Box> */}
      </Container>
    </Fade>
  );
}