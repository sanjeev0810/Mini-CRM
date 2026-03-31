import { useState, useEffect } from "react";
import { 
  TextField, Button, MenuItem, Box, Typography, Paper, 
  CircularProgress, Container, Avatar, Collapse, Fade 
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { Business, ArrowBack, Save } from "@mui/icons-material";
import API from "../services/api";

// 💎 PREMIUM STYLING CONSTANT (Kept the sleek look)
const premiumInputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2, // Slightly tighter radius
    backgroundColor: '#F8FAFC', 
    transition: 'all 0.2s ease-in-out',
    '& fieldset': { borderColor: '#E2E8F0' },
    '&:hover': { backgroundColor: '#F1F5F9' },
    '&.Mui-focused': {
      backgroundColor: '#FFFFFF',
      boxShadow: '0 0 0 4px rgba(99, 102, 241, 0.15)',
      '& fieldset': { borderColor: '#6366F1', borderWidth: '1px' },
    }
  }
};

export default function AddCompany() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);
  const [showOtherIndustry, setShowOtherIndustry] = useState(false);

  const [company, setCompany] = useState({
    name: "",
    industry: "None",
    otherIndustry: "",
    location: "",
    website: ""
  });

  useEffect(() => {
    if (id) {
      const getCompany = async () => {
        try {
          const res = await API.get(`/companies/${id}`);
          const data = res.data.company || res.data;
          
          const standardList = ["Technology", "Finance", "Healthcare", "Manufacturing", "Education", "None"];
          const isOther = data.industry && !standardList.includes(data.industry);

          setCompany({
            name: data.name || "",
            industry: isOther ? "Other" : (data.industry || "None"),
            otherIndustry: isOther ? data.industry : "",
            location: data.location || "",
            website: data.website || ""
          });
          if (isOther) setShowOtherIndustry(true);
        } catch (err) {
          console.error("Fetch Error:", err);
        } finally { setFetching(false); }
      };
      getCompany();
    }
  }, [id]);

  const handleIndustryChange = (e) => {
    const value = e.target.value;
    setCompany({ ...company, industry: value });
    setShowOtherIndustry(value === "Other");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const finalData = {
        ...company,
        industry: company.industry === "Other" ? company.otherIndustry : company.industry
      };
      
      if (id) { await API.put(`/companies/${id}`, finalData); } 
      else { await API.post("/companies", finalData); }
      navigate("/companies");
    } catch (err) { 
      alert("Error saving company."); 
    } finally { 
      setLoading(false); 
    }
  };

  if (fetching) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <CircularProgress sx={{ color: "#6366F1" }} />
    </Box>
  );

  return (
    <Fade in={true} timeout={500}>
      {/* 📉 Reduced outer padding from py: 6 to py: 2 */}
      <Container maxWidth="md" sx={{ py: 2 }}> 
        
        {/* NAVIGATION */}
        <Button 
          startIcon={<ArrowBack />} 
          onClick={() => navigate("/companies")} 
          sx={{ 
            mb: 2, textTransform: "none", fontWeight: 700, color: "#64748B",
            "&:hover": { color: "#0F172A", background: "transparent" }
          }}
        >
          Back to Companies
        </Button>

        {/* HEADER - 📉 Tightened gap and bottom margin */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Avatar sx={{ 
            bgcolor: '#FFFFFF', color: '#6366F1', width: 56, height: 56, 
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.2)', border: '2px solid #F8FAFC'
          }}>
            <Business />
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight="900" color="#0F172A" sx={{ letterSpacing: -1 }}>
              {id ? "Edit Company" : "Add New Company"}
            </Typography>
            <Typography variant="body2" color="#64748B">
              Enter the organization's details below.
            </Typography>
          </Box>
        </Box>

        {/* FORM CARD - 📉 Reduced inner padding from p: 6 to p: 4 */}
        <Paper sx={{ 
          p: { xs: 3, md: 4 }, 
          borderRadius: 4, 
          background: "#ffffff", 
          border: "1px solid rgba(226, 232, 240, 0.8)",
          boxShadow: "0 10px 30px -10px rgba(0,0,0,0.05)" 
        }}>
          <form onSubmit={handleSubmit}>
            {/* 📉 Reduced gap between rows from gap: 4 to gap: 2.5 */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              
              {/* ROW 1: Name & Industry */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
                <TextField 
                  fullWidth label="Company Name" required size="large"
                  value={company.name} onChange={e => setCompany({...company, name: e.target.value})} 
                  sx={premiumInputSx}
                />
                <TextField 
                  select fullWidth label="Industry" size="large"
                  value={company.industry} onChange={handleIndustryChange}
                  sx={premiumInputSx}
                >
                  <MenuItem value="None">None</MenuItem>
                  <MenuItem value="Technology">Technology</MenuItem>
                  <MenuItem value="Finance">Finance</MenuItem>
                  <MenuItem value="Healthcare">Healthcare</MenuItem>
                  <MenuItem value="Manufacturing">Manufacturing</MenuItem>
                  <MenuItem value="Education">Education</MenuItem>
                  <MenuItem value="Other" sx={{ fontWeight: '800', color: '#6366F1' }}>+ Other (Manual Type)</MenuItem>
                </TextField>
              </Box>

              {/* Custom Industry Field */}
              <Collapse in={showOtherIndustry}>
                <TextField 
                  fullWidth label="Specify Industry" required={showOtherIndustry} size="large"
                  placeholder="e.g. Real Estate"
                  value={company.otherIndustry} onChange={e => setCompany({...company, otherIndustry: e.target.value})} 
                  sx={premiumInputSx} 
                />
              </Collapse>

              {/* ROW 2: Location & Website */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
                <TextField 
                  fullWidth label="Location" size="large"
                  value={company.location} onChange={e => setCompany({...company, location: e.target.value})} 
                  sx={premiumInputSx}
                />
                <TextField 
                  fullWidth label="Website (URL)" size="large"
                  placeholder="https://example.com"
                  value={company.website} onChange={e => setCompany({...company, website: e.target.value})} 
                  sx={premiumInputSx}
                />
              </Box>

              {/* DIVIDER & ACTIONS - 📉 Tighter padding */}
              <Box sx={{ mt: 1, pt: 2.5, borderTop: '1px dashed #E2E8F0', display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button 
                  variant="text" onClick={() => navigate("/companies")} 
                  sx={{ 
                    px: 3, py: 1, borderRadius: 2, textTransform: 'none', fontWeight: 700, color: '#64748B',
                    '&:hover': { background: '#F1F5F9', color: '#0F172A' }
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" variant="contained" disabled={loading} startIcon={<Save />}
                  sx={{ 
                    background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
                    px: 4, py: 1, borderRadius: 2, fontWeight: 800, textTransform: 'none',
                    boxShadow: '0 4px 12px -4px rgba(99, 102, 241, 0.6)',
                    transition: 'all 0.3s ease',
                    '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 6px 16px -4px rgba(99, 102, 241, 0.8)' }
                  }}
                >
                  {loading ? "Saving..." : "Save Company"}
                </Button>
              </Box>

            </Box>
          </form>
        </Paper>
      </Container>
    </Fade>
  );
}