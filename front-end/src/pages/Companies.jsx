import { useState, useEffect } from "react";
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, CircularProgress } from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Companies() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const res = await API.get("/companies");
      setCompanies(Array.isArray(res.data) ? res.data : []);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCompanies(); }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      try {
        await API.delete(`/companies/${id}`);
        fetchCompanies(); // ✅ Refreshes list so company disappears
      } catch (err) { alert("Delete failed."); }
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
        <Typography variant="h5" fontWeight="700">Companies</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate("/add-company")} sx={{ bgcolor: "#6366F1" }}>Add Company</Button>
      </Box>
      <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #E2E8F0", borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: "#F8FAFC" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "700" }}>Company Name</TableCell>
              <TableCell sx={{ fontWeight: "700" }}>Industry</TableCell>
              <TableCell sx={{ fontWeight: "700" }}>Location</TableCell> {/* ✅ Added */}
              <TableCell align="right" sx={{ fontWeight: "700" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4} align="center"><CircularProgress size={24} /></TableCell></TableRow>
            ) : companies.map((c) => (
              <TableRow key={c._id} hover>
                <TableCell>{c.name}</TableCell>
                <TableCell>{c.industry || "—"}</TableCell>
                <TableCell>{c.location || "—"}</TableCell> {/* ✅ Added */}
                <TableCell align="right">
                  <IconButton onClick={() => navigate(`/edit-company/${c._id}`)} color="primary"><Edit fontSize="small" /></IconButton>
                  <IconButton onClick={() => handleDelete(c._id)} sx={{ color: "#EF4444" }}><Delete fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}