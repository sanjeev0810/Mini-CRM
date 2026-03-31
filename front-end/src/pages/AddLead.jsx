import { useState, useEffect } from "react";
import { 
  TextField, Button, MenuItem, Box, Typography, 
  Paper, CircularProgress, Container, Avatar, Fade 
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { PersonAdd, ArrowBack, Save } from "@mui/icons-material";
import API from "../services/api";

// 💎 PREMIUM STYLING CONSTANT (Same as AddCompany)
const premiumInputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2, 
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

export default function AddLead() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);
  const [companies, setCompanies] = useState([]);
  const [users, setUsers] = useState([]); 

  const [lead, setLead] = useState({
    name: "",
    email: "",
    phone: "",
    status: "New",
    company: "",
    assignedTo: "" 
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
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
          const data = leadRes.data;
          
          // Ensure we don't pass 'null' to the controlled inputs
          setLead({
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
            status: data.status || "New",
            company: data.company?._id || data.company || "",
            assignedTo: data.assignedTo?._id || data.assignedTo || ""
          });
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
      alert("Error saving lead. Please check required fields.");
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
      <Container maxWidth="md" sx={{ py: 2 }}> 
        
        {/* NAVIGATION */}
        <Button 
          startIcon={<ArrowBack />} 
          onClick={() => navigate("/leads")} 
          sx={{ 
            mb: 2, textTransform: "none", fontWeight: 700, color: "#64748B",
            "&:hover": { color: "#0F172A", background: "transparent" }
          }}
        >
          Back to Leads
        </Button>

        {/* HEADER */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Avatar sx={{ 
            bgcolor: '#FFFFFF', color: '#6366F1', width: 56, height: 56, 
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.2)', border: '2px solid #F8FAFC'
          }}>
            <PersonAdd />
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight="900" color="#0F172A" sx={{ letterSpacing: -1 }}>
              {id ? "Edit Lead" : "Add New Lead"}
            </Typography>
            <Typography variant="body2" color="#64748B">
              Enter the prospect's contact and assignment details.
            </Typography>
          </Box>
        </Box>

        {/* FORM CARD */}
        <Paper sx={{ 
          p: { xs: 3, md: 4 }, 
          borderRadius: 4, 
          background: "#ffffff", 
          border: "1px solid rgba(226, 232, 240, 0.8)",
          boxShadow: "0 10px 30px -10px rgba(0,0,0,0.05)" 
        }}>
          <form onSubmit={handleSubmit}>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              
              {/* ROW 1: Name & Email */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
                <TextField 
                  fullWidth label="Full Name" required size="large"
                  value={lead.name} onChange={e => setLead({...lead, name: e.target.value})} 
                  sx={premiumInputSx}
                />
                <TextField 
                  fullWidth label="Email Address" required size="large" type="email"
                  value={lead.email} onChange={e => setLead({...lead, email: e.target.value})} 
                  sx={premiumInputSx}
                />
              </Box>

              {/* ROW 2: Phone & Assigned To */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
                <TextField 
                  fullWidth label="Phone Number" size="large"
                  value={lead.phone} onChange={e => setLead({...lead, phone: e.target.value})} 
                  sx={premiumInputSx}
                />
                <TextField 
                  select fullWidth label="Assigned To" size="large"
                  value={lead.assignedTo || ""} onChange={e => setLead({...lead, assignedTo: e.target.value})}
                  sx={premiumInputSx}
                >
                  <MenuItem value=""><em>Unassigned</em></MenuItem>
                  {users.map(u => (
                    <MenuItem key={u._id} value={u._id}>{u.name}</MenuItem>
                  ))}
                </TextField>
              </Box>

              {/* ROW 3: Company & Status */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
                <TextField 
                  select fullWidth label="Company" size="large"
                  value={lead.company || ""} onChange={e => setLead({...lead, company: e.target.value})}
                  sx={premiumInputSx}
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  {companies.map(c => (
                    <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>
                  ))}
                </TextField>
                
                <TextField 
                  select fullWidth label="Status" size="large"
                  value={lead.status} onChange={e => setLead({...lead, status: e.target.value})}
                  sx={premiumInputSx}
                >
                  <MenuItem value="New">New</MenuItem>
                  <MenuItem value="Contacted">Contacted</MenuItem>
                  <MenuItem value="Qualified">Qualified</MenuItem>
                  <MenuItem value="Lost">Lost</MenuItem>
                </TextField>
              </Box>

              {/* DIVIDER & ACTIONS */}
              <Box sx={{ mt: 1, pt: 2.5, borderTop: '1px dashed #E2E8F0', display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button 
                  variant="text" onClick={() => navigate("/leads")} 
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
                  {loading ? "Saving..." : (id ? "Update Lead" : "Save Lead")}
                </Button>
              </Box>

            </Box>
          </form>
        </Paper>
      </Container>
    </Fade>
  );
}