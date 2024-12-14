const express = require("express");
const Task = require("../models/Task");

const router = express.Router();

// Create Task
router.post("/", async (req, res) => {
  const { title, endTime, priority } = req.body;
  const task = new Task({
    title,
    endTime,
    priority,
  });
  try {
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all tasks
router.get("/", async (req, res) => {
  const { priority, status, sort } = req.query;
  const filters = {};

  if (priority) filters.priority = priority;
  if (status) filters.status = status;

  try {
    const tasks = await Task.find(filters).sort(sort ? { [sort]: 1 } : {});
    res.status(200).json(tasks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update Task
router.put("/:id", async (req, res) => {
  const { title, endTime, priority, status } = req.body;
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, endTime, priority, status },
      { new: true }
    );
    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete Task
router.delete("/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
