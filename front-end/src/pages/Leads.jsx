import { useEffect, useState } from "react";
import { 
  Box, Typography, Button, Paper, TextField, MenuItem, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  IconButton, Chip, Pagination, Container, Avatar, CircularProgress, Tooltip, Fade
} from "@mui/material";
import { Edit, Delete, Add, Groups, Business, Person, Email } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/leads?search=${search}&status=${status}&page=${page}`);
      setLeads(res.data.leads || (Array.isArray(res.data) ? res.data : []));
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [search, status, page]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      try {
        await API.delete(`/leads/${id}`);
        fetchLeads();
      } catch (err) {
        alert("Error deleting lead");
      }
    }
  };

  const getStatusColor = (statusText) => {
    switch (statusText) {
      case 'New': return { bg: 'rgba(99, 102, 241, 0.1)', color: '#6366F1', border: '#6366F1' };
      case 'Contacted': return { bg: 'rgba(245, 158, 11, 0.1)', color: '#D97706', border: '#F59E0B' };
      case 'Qualified': return { bg: 'rgba(16, 185, 129, 0.1)', color: '#059669', border: '#10B981' };
      case 'Lost': return { bg: 'rgba(239, 68, 68, 0.1)', color: '#DC2626', border: '#EF4444' };
      default: return { bg: '#F1F5F9', color: '#64748B', border: '#CBD5E1' };
    }
  };

  return (
    <Fade in={true} timeout={500}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        
        {/* HEADER SECTION */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4, alignItems: "center" }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: '#6366F1', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)' }}>
              <Groups />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight="900" color="#1E293B" sx={{ letterSpacing: -1 }}>Leads</Typography>
              <Typography variant="body2" color="text.secondary">Manage your prospects and assignments</Typography>
            </Box>
          </Box>
          <Button 
            variant="contained" 
            startIcon={<Add />} 
            onClick={() => navigate("/add-lead")}
            sx={{ 
              bgcolor: "#6366F1", textTransform: "none", fontWeight: '800', 
              borderRadius: 2, px: 3, py: 1, boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
              "&:hover": { bgcolor: "#4F46E5", transform: 'translateY(-1px)' } 
            }}
          >
            Add Lead
          </Button>
        </Box>

        {/* SEARCH & FILTER BAR */}
        <Paper sx={{ 
          p: 2.5, mb: 4, display: "flex", gap: 3, borderRadius: 4, 
          background: "rgba(255, 255, 255, 0.8)", backdropFilter: "blur(10px)", 
          border: "1px solid rgba(226, 232, 240, 0.8)", boxShadow: "0 10px 30px rgba(0,0,0,0.03)" 
        }}>
          <TextField 
            label="Search leads..." size="large" sx={{ flexGrow: 1 }}
            value={search} onChange={(e) => setSearch(e.target.value)} 
            InputProps={{ sx: { borderRadius: 2, bgcolor: '#F8FAFC' } }}
          />
          <TextField 
            select label="Status Filter" size="large" sx={{ width: 220 }} 
            value={status} onChange={(e) => setStatus(e.target.value)}
            InputProps={{ sx: { borderRadius: 2, bgcolor: '#F8FAFC' } }}
          >
            <MenuItem value="">All Statuses</MenuItem>
            <MenuItem value="New">New</MenuItem>
            <MenuItem value="Contacted">Contacted</MenuItem>
            <MenuItem value="Qualified">Qualified</MenuItem>
            <MenuItem value="Lost">Lost</MenuItem>
          </TextField>
        </Paper>

        {/* MAIN TABLE */}
        <TableContainer component={Paper} sx={{ 
          borderRadius: 4, background: "#ffffff", 
          border: "1px solid #E2E8F0", boxShadow: "0 10px 40px -10px rgba(0,0,0,0.08)" 
        }}>
          <Table>
            <TableHead sx={{ bgcolor: "#F8FAFC" }}>
              <TableRow>
                {/* ✅ Balanced Column Widths */}
                <TableCell sx={{ width: '35%', fontWeight: "800", color: "#64748B", py: 2 }}>LEAD INFO</TableCell>
                <TableCell sx={{ width: '15%', fontWeight: "800", color: "#64748B" }}>STATUS</TableCell>
                <TableCell sx={{ width: '20%', fontWeight: "800", color: "#64748B" }}>ASSIGNED TO</TableCell>
                <TableCell sx={{ width: '15%', fontWeight: "800", color: "#64748B" }}>COMPANY</TableCell>
                <TableCell sx={{ width: '15%', fontWeight: "800", color: "#64748B" }} align="right">ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                    <CircularProgress size={40} sx={{ color: "#6366F1" }} />
                  </TableCell>
                </TableRow>
              ) : leads.length > 0 ? (
                leads.map((l) => {
                  const sColor = getStatusColor(l.status);
                  return (
                    <TableRow key={l._id} hover sx={{ transition: 'all 0.2s' }}>
                      <TableCell>
                        <Typography fontWeight="800" color="#1E293B">{l.name}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Email sx={{ fontSize: 14, color: '#94A3B8' }} />
                          <Typography variant="body2" color="#64748B">{l.email}</Typography>
                        </Box>
                      </TableCell>
                      
                      <TableCell>
                        <Chip 
                          label={l.status} 
                          size="small"
                          sx={{ 
                            fontWeight: '800', fontSize: '0.75rem', borderRadius: 1.5,
                            bgcolor: sColor.bg, color: sColor.color, border: `1px solid ${sColor.border}`
                          }} 
                        />
                      </TableCell>

                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Person sx={{ fontSize: 16, color: '#94A3B8' }} />
                          <Typography fontWeight="600" color={l.assignedTo ? "#334155" : "#94A3B8"}>
                            {l.assignedTo?.name || "Unassigned"}
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Business sx={{ fontSize: 16, color: '#94A3B8' }} />
                          <Typography fontWeight="600" color={l.company ? "#6366F1" : "#94A3B8"}>
                            {l.company?.name || "—"}
                          </Typography>
                        </Box>
                      </TableCell>
                      
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                          <Tooltip title="Edit Lead">
                            <IconButton size="small" sx={{ color: '#94A3B8', '&:hover': { color: '#6366F1' } }} onClick={() => navigate(`/edit-lead/${l._id}`)}>
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Lead">
                            <IconButton size="small" sx={{ color: '#94A3B8', '&:hover': { color: '#EF4444' } }} onClick={() => handleDelete(l._id)}>
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
                    <Typography color="textSecondary" fontWeight="600">No leads found matching your criteria.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={(e, v) => setPage(v)} 
            color="primary" 
            sx={{ '& .MuiPaginationItem-root': { fontWeight: '800' } }}
          />
        </Box>
      </Container>
    </Fade>
  );
}