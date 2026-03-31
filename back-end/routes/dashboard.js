const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Task = require("../models/Task");
const Lead = require("../models/Lead");

router.get("/stats", auth, async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const [totalLeads, qualifiedLeads, tasksDueToday, completedTasks, pendingTasks] = await Promise.all([
      Lead.countDocuments({ isDeleted: { $ne: true } }),
      
      Lead.countDocuments({ 
        status: { $regex: /^qualified$/i }, 
        isDeleted: { $ne: true } 
      }),
      
      // ✅ Updated: Only count UNFINISHED tasks for today
      Task.countDocuments({ 
        dueDate: { $gte: startOfToday, $lte: endOfToday },
        status: { $nin: ["Completed", "completed"] }, 
        isDeleted: { $ne: true } 
      }),
      
      Task.countDocuments({ 
        status: { $regex: /^completed$/i }, 
        isDeleted: { $ne: true } 
      }),

      Task.countDocuments({ 
        status: { $regex: /^pending$/i }, 
        isDeleted: { $ne: true } 
      })
    ]);

    res.json({
      totalLeads,
      qualifiedLeads,
      tasksDueToday,
      completedTasks,
      pendingTasks
    });
  } catch (err) {
    console.error("Stats Error:", err);
    res.status(500).json({ message: "Error fetching stats" });
  }
});

module.exports = router;