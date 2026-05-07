const express = require("express");
const { body } = require("express-validator");
const { registerUser, loginUser, getMe } = require("../controllers/authController");
const validate = require("../middleware/validateMiddleware");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

router.post(
  "/register",
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ min: 2, max: 80 })
      .withMessage("Name must be between 2 and 80 characters"),
    body("email")
      .trim()
      .matches(EMAIL_REGEX)
      .withMessage("Enter a valid email (e.g. name@example.com)")
      .normalizeEmail(),
    body("password")
      .isString()
      .trim()
      .matches(PASSWORD_REGEX)
      .withMessage(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
      )
  ],
  validate,
  registerUser
);

router.post(
  "/login",
  [
    body("email")
      .trim()
      .matches(EMAIL_REGEX)
      .withMessage("Enter a valid email")
      .normalizeEmail(),
    body("password")
      .isString()
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .matches(PASSWORD_REGEX)
      .withMessage(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
      )
  ],
  validate,
  loginUser
);

router.get("/me", protect, getMe);

module.exports = router;
