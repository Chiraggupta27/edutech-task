const { matchedData } = require("express-validator");
const asyncHandler = require("../utils/asyncHandler");
const generateToken = require("../utils/generateToken");
const User = require("../models/User");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = matchedData(req);

  if (!password) {
    res.status(400);
    throw new Error("Password is required");
  }

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(409);
    throw new Error("Email already in use");
  }

  const user = await User.create({ name, email, password });

  res.status(201).json({
    success: true,
    message: "Registration successful",
    data: {
      user: { id: user._id, name: user.name, email: user.email },
      token: generateToken(user._id)
    }
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = matchedData(req);

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  const ok = await user.matchPassword(password);
  if (!ok) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  res.json({
    success: true,
    message: "Login successful",
    data: {
      user: { id: user._id, name: user.name, email: user.email },
      token: generateToken(user._id)
    }
  });
});

const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: "User profile",
    data: {
      user: { id: req.user._id, name: req.user.name, email: req.user.email }
    }
  });
});

module.exports = { registerUser, loginUser, getMe };
