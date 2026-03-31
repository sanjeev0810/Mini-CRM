import { useState, useEffect } from "react";
import { 
  Box, Typography, Button, Paper, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, 
  CircularProgress, TextField, IconButton, Tooltip, Container, Avatar, Pagination
} from "@mui/material";
import { Add, Business, Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Companies() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/companies?search=${search}&page=${page}`);
      setCompanies(res.data.companies || (Array.isArray(res.data) ? res.data : []));
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching companies:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [search, page]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      try {
        await API.delete(`/companies/${id}`);
        fetchCompanies();
      } catch (err) {
        alert("Error deleting company");
      }
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4, alignItems: "center" }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: '#6366F1', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)' }}>
            <Business />
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight="900" color="#1E293B" sx={{ letterSpacing: -1 }}>Companies</Typography>
            <Typography variant="body2" color="text.secondary">Corporate directory management</Typography>
          </Box>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<Add />} 
          onClick={() => navigate("/add-company")}
          sx={{ bgcolor: "#6366F1", textTransform: "none", fontWeight: '700', borderRadius: 2, px: 3 }}
        >
          Add Company
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 4, borderRadius: 4, background: "rgba(255, 255, 255, 0.6)", backdropFilter: "blur(10px)", border: "1px solid rgba(255, 255, 255, 0.3)" }}>
        <TextField 
          label="Search companies..." size="small" fullWidth
          value={search} onChange={(e) => setSearch(e.target.value)} 
        />
      </Paper>

      <TableContainer component={Paper} sx={{ borderRadius: 4, background: "rgba(255, 255, 255, 0.9)", border: "1px solid rgba(255, 255, 255, 0.3)", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
        <Table>
          <TableHead sx={{ bgcolor: "rgba(241, 245, 249, 0.6)" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "800" }}>COMPANY NAME</TableCell>
              <TableCell sx={{ fontWeight: "800" }}>INDUSTRY</TableCell>
              <TableCell sx={{ fontWeight: "800" }}>WEBSITE</TableCell>
              <TableCell align="right" sx={{ fontWeight: "800" }}>ACTIONS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4} align="center" sx={{ py: 10 }}><CircularProgress color="primary" /></TableCell></TableRow>
            ) : companies.map((company) => (
              <TableRow key={company._id} hover>
                <TableCell sx={{ fontWeight: "700" }}>{company.name}</TableCell>
                <TableCell>{company.industry || "General"}</TableCell>
                <TableCell>{company.website || "—"}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => navigate(`/edit-company/${company._id}`)}><Edit fontSize="small" /></IconButton>
                  <IconButton color="error" onClick={() => handleDelete(company._id)}><Delete fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Pagination count={totalPages} page={page} onChange={(e, v) => setPage(v)} color="primary" />
      </Box> */}
    </Container>
  );
}