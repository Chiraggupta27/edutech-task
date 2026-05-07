const { matchedData } = require("express-validator");
const mongoose = require("mongoose");
const asyncHandler = require("../utils/asyncHandler");
const Task = require("../models/Task");

const createTask = asyncHandler(async (req, res) => {
  const { title, description } = matchedData(req);

  const task = await Task.create({
    title,
    description: description || "",
    user: req.user._id
  });

  res.status(201).json({
    success: true,
    message: "Task created",
    data: { task }
  });
});

const getTasks = asyncHandler(async (req, res) => {
  const { status, search, page, limit } = req.query;

  const filter = { user: req.user._id };
  if (status === "completed" || status === "pending") {
    filter.status = status;
  }
  if (search && String(search).trim()) {
    const q = String(search).trim();
    filter.$or = [
      { title: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } }
    ];
  }

  const pageNum = Math.max(parseInt(page || "1", 10) || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit || "8", 10) || 8, 1), 50);
  const skip = (pageNum - 1) * limitNum;

  const [total, tasks] = await Promise.all([
    Task.countDocuments(filter),
    Task.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum)
  ]);

  res.json({
    success: true,
    message: "Tasks fetched",
    data: {
      tasks,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.max(Math.ceil(total / limitNum), 1)
      }
    }
  });
});

const updateTask = asyncHandler(async (req, res) => {
  const { title, description } = matchedData(req);
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    res.status(400);
    throw new Error("Invalid task id");
  }

  const task = await Task.findOne({ _id: id, user: req.user._id });
  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  if (typeof title !== "undefined") task.title = title;
  if (typeof description !== "undefined") task.description = description;

  await task.save();

  res.json({
    success: true,
    message: "Task updated",
    data: { task }
  });
});

const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    res.status(400);
    throw new Error("Invalid task id");
  }

  const task = await Task.findOne({ _id: id, user: req.user._id });
  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  await task.deleteOne();

  res.json({
    success: true,
    message: "Task deleted",
    data: null
  });
});

const toggleStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = matchedData(req);

  if (!mongoose.isValidObjectId(id)) {
    res.status(400);
    throw new Error("Invalid task id");
  }

  const task = await Task.findOne({ _id: id, user: req.user._id });
  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  task.status = status;
  await task.save();

  res.json({
    success: true,
    message: "Status updated",
    data: { task }
  });
});

module.exports = { createTask, getTasks, updateTask, deleteTask, toggleStatus };
