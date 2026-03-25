import { useEffect, useState } from "react";
import { 
  Box, Typography, Button, Paper, TextField, MenuItem, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  IconButton, Chip, Pagination 
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeads();
  }, [search, status, page]);

  const fetchLeads = async () => {
    try {
      const res = await API.get(`/leads?search=${search}&status=${status}&page=${page}`);
      setLeads(res.data.leads);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Fetch error", err);
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5" fontWeight="800">Leads</Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />} 
          onClick={() => navigate("/add-lead")}
          sx={{ bgcolor: "#6366F1", textTransform: "none" }}
        >
          Add Lead
        </Button>
      </Box>

      {/* Search & Status Bar */}
      <Paper sx={{ p: 2, mb: 3, display: "flex", gap: 2, borderRadius: 2 }}>
        <TextField 
          label="Search" size="small" sx={{ flexGrow: 1 }}
          value={search} onChange={(e) => setSearch(e.target.value)} 
        />
        <TextField 
          select label="Status" size="small" sx={{ width: 200 }} 
          value={status} onChange={(e) => setStatus(e.target.value)}
        >
          <MenuItem value="">All Status</MenuItem>
          <MenuItem value="New">New</MenuItem>
          <MenuItem value="Contacted">Contacted</MenuItem>
          <MenuItem value="Lost">Lost</MenuItem>
        </TextField>
      </Paper>

      {/* Main Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
        <Table>
          <TableHead sx={{ bgcolor: "#F8FAFC" }}>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Assigned To</strong></TableCell>
              <TableCell><strong>Company</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leads.map((l) => (
              <TableRow key={l._id} hover>
                <TableCell>{l.name}</TableCell>
                <TableCell>{l.email}</TableCell>
                <TableCell>
                  <Chip label={l.status} size="small" variant="outlined" color="primary" />
                </TableCell>
                {/* DISPLAYING THE POPULATED NAMES HERE */}
                <TableCell>{l.assignedTo?.name || "Unassigned"}</TableCell>
                <TableCell>{l.company?.name || "N/A"}</TableCell>
                
                <TableCell align="center">
                  <IconButton color="primary" onClick={() => navigate(`/edit-lead/${l._id}`)}>
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton color="error" onClick={() => {/* Delete Logic */}}>
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Pagination count={totalPages} page={page} onChange={(e, v) => setPage(v)} color="primary" />
      </Box>
    </Box>
  );
}