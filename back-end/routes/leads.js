const router = require("express").Router();
const auth = require("../middleware/auth");
const Lead = require("../models/Lead");

// ✅ Helper function to clean incoming data
// Converts empty strings to null so MongoDB doesn't throw a validation error
const sanitizeLeadData = (data) => {
  const cleanData = { ...data };
  if (cleanData.assignedTo === "") cleanData.assignedTo = null;
  if (cleanData.company === "") cleanData.company = null;
  return cleanData;
};

// ✅ 1. CREATE LEAD
router.post("/", auth, async (req, res) => {
  try {
    const cleanBody = sanitizeLeadData(req.body);
    const lead = await Lead.create(cleanBody);
    res.status(201).json(lead);
  } catch (err) {
    console.error("Create Lead Error:", err.message);
    res.status(400).json({ message: "Validation failed", error: err.message });
  }
});

// ✅ 2. GET ALL LEADS (With Search, Pagination, and Population)
router.get("/", auth, async (req, res) => {
  try {
    const { search = "", status = "", page = 1 } = req.query;
    const limit = 5;
    const skip = (page - 1) * limit;

    const query = { isDeleted: false };
    
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    
    if (status) query.status = status;

    const totalLeads = await Lead.countDocuments(query);

    const leads = await Lead.find(query)
      .populate("assignedTo", "name") 
      .populate("company", "name")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      leads,
      totalPages: Math.ceil(totalLeads / limit),
      currentPage: Number(page)
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ 3. GET SINGLE LEAD DETAILS
router.get("/:id", auth, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate("assignedTo", "name email")
      .populate("company", "name industry");
    
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: "Error fetching lead" });
  }
});

// ✅ 4. UPDATE LEAD (With Sanitization)
router.put("/:id", auth, async (req, res) => {
  try {
    const cleanBody = sanitizeLeadData(req.body);
    
    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id, 
      cleanBody, 
      { new: true, runValidators: true }
    );
    
    if (!updatedLead) return res.status(404).json({ message: "Lead not found" });
    res.json(updatedLead);
  } catch (err) {
    console.error("Backend PUT Error:", err.message);
    // Returning the specific Mongoose error helps you debug in the browser console
    res.status(400).json({ message: err.message });
  }
});

// ✅ 5. SOFT DELETE LEAD
router.delete("/:id", auth, async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id, 
      { isDeleted: true }, 
      { new: true }
    );

    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.json({ message: "Lead soft-deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Deletion failed" });
  }
});

module.exports = router;