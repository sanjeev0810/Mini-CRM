const router = require("express").Router();
const auth = require("../middleware/auth");
const Company = require("../models/Company");
const Lead = require("../models/Lead");

// ✅ 1. GET ALL COMPANIES (Excludes Soft-Deleted)
router.get("/", auth, async (req, res) => {
  try {
    const companies = await Company.find({ isDeleted: { $ne: true } }).sort({ name: 1 });
    res.json(companies); 
  } catch (err) {
    res.status(500).json({ message: "Error fetching companies" });
  }
});

// ✅ 2. GET SINGLE COMPANY
router.get("/:id", auth, async (req, res) => {
  try {
    const company = await Company.findOne({ _id: req.params.id, isDeleted: { $ne: true } });
    if (!company) return res.status(404).json({ message: "Company not found" });
    const leads = await Lead.find({ company: req.params.id, isDeleted: false });
    res.json({ company, leads });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ 3. CREATE COMPANY
router.post("/", auth, async (req, res) => {
  try {
    const newCompany = await Company.create({ ...req.body, isDeleted: false });
    res.status(201).json(newCompany);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ 4. UPDATE COMPANY
router.put("/:id", auth, async (req, res) => {
  try {
    const updatedCompany = await Company.findOneAndUpdate(
      { _id: req.params.id, isDeleted: { $ne: true } },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedCompany) return res.status(404).json({ message: "Not found" });
    res.json(updatedCompany);
  } catch (err) {
    res.status(400).json({ message: "Update failed" });
  }
});

// ✅ 5. DELETE COMPANY (Soft Delete)
router.delete("/:id", auth, async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, { isDeleted: true });
    if (!company) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Company deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;