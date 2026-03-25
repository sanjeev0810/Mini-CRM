import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import AddLead from "./pages/AddLead";
import Companies from "./pages/Companies";
import AddCompany from "./pages/AddCompany"; // This handles both Add and Edit
import CompanyDetails from "./pages/CompanyDetails";
import Tasks from "./pages/Tasks";
import AddTask from "./pages/AddTask";
import MainLayout from "./layout/MainLayout";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          
          <Route path="/leads" element={<Leads />} />
          <Route path="/add-lead" element={<AddLead />} />
          <Route path="/edit-lead/:id" element={<AddLead />} /> 

          <Route path="/companies" element={<Companies />} />
          <Route path="/add-company" element={<AddCompany />} />
          {/* ✅ FIXED: Added specific edit route for companies */}
          <Route path="/edit-company/:id" element={<AddCompany />} /> 
          <Route path="/companies/:id" element={<CompanyDetails />} />

          <Route path="/tasks" element={<Tasks />} />
          <Route path="/add-task" element={<AddTask />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;