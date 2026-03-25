const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  industry: String,
  location: String, // ✅ Added
  website: String,  // ✅ Added
  address: String,  // ✅ Added
  isDeleted: { type: Boolean, default: false } // ✅ Required for Soft Delete
}, { timestamps: true });

module.exports = mongoose.model("Company", companySchema);