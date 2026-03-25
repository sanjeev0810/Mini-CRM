import { useState, useEffect } from "react";
import { TextField, Button, MenuItem, Box, Typography, Paper, Grid, CircularProgress, Container } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

export default function AddCompany() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);

  const [company, setCompany] = useState({
    name: "",
    industry: "",
    location: "", // ✅ Added
    website: "",
    address: ""
  });

  useEffect(() => {
    if (id) {
      const getCompany = async () => {
        try {
          const res = await API.get(`/companies/${id}`);
          const data = res.data.company || res.data; 
          setCompany({
            name: data.name || "",
            industry: data.industry || "",
            location: data.location || "", // ✅ Added
            website: data.website || "",
            address: data.address || ""
          });
        } catch (err) {
          console.error(err);
        } finally { setFetching(false); }
      };
      getCompany();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (id) { await API.put(`/companies/${id}`, company); } 
      else { await API.post("/companies", company); }
      navigate("/companies");
    } catch (err) { alert("Error saving company."); } 
    finally { setLoading(false); }
  };

  if (fetching) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h5" fontWeight="700" mb={3}>{id ? "Edit Company" : "Add New Company"}</Typography>
      <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: "1px solid #E2E8F0" }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Company Name" required value={company.name} onChange={e => setCompany({...company, name: e.target.value})} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField select fullWidth label="Industry" value={company.industry} onChange={e => setCompany({...company, industry: e.target.value})}
                SelectProps={{ MenuProps: { disableAutoFocusItem: true, PaperProps: { style: { maxHeight: 300, width: 250 } } } }}>
                <MenuItem value=""><em>None</em></MenuItem>
                <MenuItem value="Technology">Technology</MenuItem>
                <MenuItem value="Finance">Finance</MenuItem>
                <MenuItem value="Healthcare">Healthcare</MenuItem>
              </TextField>
            </Grid>
            {/* ✅ Added Location Field */}
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Location" value={company.location} onChange={e => setCompany({...company, location: e.target.value})} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Website" value={company.website} onChange={e => setCompany({...company, website: e.target.value})} /></Grid>
            <Grid size={{ xs: 12 }}><TextField fullWidth multiline rows={2} label="Address" value={company.address} onChange={e => setCompany({...company, address: e.target.value})} /></Grid>
            <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
              <Button type="submit" variant="contained" disabled={loading} sx={{ bgcolor: "#6366F1", px: 4 }}>{loading ? "Saving..." : "Save Company"}</Button>
              <Button sx={{ ml: 2 }} onClick={() => navigate("/companies")}>Cancel</Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}