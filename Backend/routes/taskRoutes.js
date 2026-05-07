const express = require("express");
const { body } = require("express-validator");
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  toggleStatus
} = require("../controllers/taskController");
const validate = require("../middleware/validateMiddleware");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.post(
  "/",
  [body("title").trim().notEmpty().withMessage("Title is required"), body("description").optional().isString()],
  validate,
  createTask
);

router.get("/", getTasks);

router.put(
  "/:id",
  [body("title").optional().trim().notEmpty().withMessage("Title is required"), body("description").optional().isString()],
  validate,
  updateTask
);

router.delete("/:id", deleteTask);

router.patch(
  "/:id/status",
  [
    body("status")
      .isIn(["pending", "completed"])
      .withMessage("Status must be pending or completed")
  ],
  validate,
  toggleStatus
);

module.exports = router;
