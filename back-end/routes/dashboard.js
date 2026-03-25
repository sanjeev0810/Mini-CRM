const router = require("express").Router();
const auth = require("../middleware/auth");
const Lead = require("../models/Lead");
const Task = require("../models/Task"); 

router.get("/stats", auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalLeads, qualifiedLeads, tasksDueToday, completedTasks] = await Promise.all([
      Lead.countDocuments({ isDeleted: false }),
      Lead.countDocuments({ status: "Qualified", isDeleted: false }),
      Task.countDocuments({ 
        dueDate: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) },
        status: { $ne: "Completed" } 
      }),
      Task.countDocuments({ status: "Completed" })
    ]);

    res.json({
      totalLeads,
      qualifiedLeads,
      tasksDueToday,
      completedTasks
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching stats" });
  }
});

module.exports = router;