const router = require("express").Router();
const auth = require("../middleware/auth");
const Task = require("../models/Task");

// GET ALL TASKS
router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("lead", "name")
      .populate("assignedTo", "name");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tasks" });
  }
});

// CREATE TASK
router.post("/", auth, async (req, res) => {
  try {
    const newTask = new Task(req.body);
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(400).json({ message: "Error creating task" });
  }
});

// UPDATE TASK (Used for status changes like "Completed")
router.put("/:id", auth, async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: "Update failed" });
  }
});

// DELETE TASK
router.delete("/:id", auth, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;