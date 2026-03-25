const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true 
  },
  phone: { 
    type: String 
  },
  status: { 
    type: String, 
    default: "New" 
  },
  
  company: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Company", 
    default: null 
  },
  assignedTo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    default: null 
  },

  isDeleted: { 
    type: Boolean, 
    default: false 
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model("Lead", leadSchema);