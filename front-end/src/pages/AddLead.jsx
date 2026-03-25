import { useState, useEffect } from "react";
import { 
  TextField, Button, MenuItem, Box, Typography, 
  Paper, Grid, CircularProgress, Container 
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

export default function AddLead() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);
  const [companies, setCompanies] = useState([]);
  const [users, setUsers] = useState([]); // ✅ State for users list

  const [lead, setLead] = useState({
    name: "",
    email: "",
    phone: "",
    status: "New",
    company: "",
    assignedTo: "" // ✅ Added field to state
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ Fetching Companies and Users simultaneously
        const [compRes, userRes] = await Promise.all([
          API.get("/companies"),
          API.get("/auth/users") 
        ]);

        const companyData = Array.isArray(compRes.data) ? compRes.data : (compRes.data.companies || []);
        setCompanies(companyData);
        
        const userData = Array.isArray(userRes.data) ? userRes.data : [];
        setUsers(userData);
        
        if (id) {
          const leadRes = await API.get(`/leads/${id}`);
          setLead(leadRes.data);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (id) {
        await API.put(`/leads/${id}`, lead);
      } else {
        await API.post("/leads", lead);
      }
      navigate("/leads");
    } catch (err) {
      alert("Error saving lead");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <Box sx={{ textAlign: 'center', mt: 10 }}><CircularProgress /></Box>;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h5" fontWeight="700" mb={3}>
        {id ? "Edit Lead" : "Add New Lead"}
      </Typography>

      <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: "1px solid #E2E8F0" }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField 
                fullWidth label="Full Name" required 
                value={lead.name} 
                onChange={e => setLead({...lead, name: e.target.value})} 
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField 
                fullWidth label="Email Address" required 
                value={lead.email} 
                onChange={e => setLead({...lead, email: e.target.value})} 
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField 
                fullWidth label="Phone" 
                value={lead.phone} 
                onChange={e => setLead({...lead, phone: e.target.value})} 
              />
            </Grid>

            {/* ✅ Assigned To Selection */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField 
                select fullWidth label="Assigned To" 
                value={lead.assignedTo || ""} 
                onChange={e => setLead({...lead, assignedTo: e.target.value})}
                SelectProps={{
                  MenuProps: { 
                    disableAutoFocusItem: true,
                    PaperProps: { style: { maxHeight: 300, width: 250 } }
                  }
                }}
              >
                <MenuItem value=""><em>Unassigned</em></MenuItem>
                {users.map(u => (
                  <MenuItem key={u._id} value={u._id}>{u.name}</MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Company Selection */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField 
                select fullWidth label="Company" 
                value={lead.company || ""} 
                onChange={e => setLead({...lead, company: e.target.value})}
                SelectProps={{
                  MenuProps: { 
                    disableAutoFocusItem: true,
                    PaperProps: { style: { maxHeight: 300, width: 250 } }
                  }
                }}
              >
                <MenuItem value=""><em>None</em></MenuItem>
                {companies.map(c => (
                  <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField 
                select fullWidth label="Status" 
                value={lead.status} 
                onChange={e => setLead({...lead, status: e.target.value})}
                SelectProps={{ MenuProps: { disableAutoFocusItem: true } }}
              >
                <MenuItem value="New">New</MenuItem>
                <MenuItem value="Contacted">Contacted</MenuItem>
                <MenuItem value="Qualified">Qualified</MenuItem>
                <MenuItem value="Lost">Lost</MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
              <Button type="submit" variant="contained" disabled={loading} sx={{ bgcolor: "#6366F1", px: 4 }}>
                {loading ? "Saving..." : (id ? "Update Lead" : "Save Lead")}
              </Button>
              <Button sx={{ ml: 2 }} onClick={() => navigate("/leads")}>Cancel</Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}