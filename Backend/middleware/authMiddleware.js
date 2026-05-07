const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const User = require("../models/User");

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const hasBearer = authHeader.toLowerCase().startsWith("bearer ");

  if (!hasBearer) {
    res.status(401);
    throw new Error("Not authorized");
  }

  const token = authHeader.split(" ")[1];
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    res.status(500);
    throw new Error("Server misconfigured");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, secret);
  } catch (e) {
    res.status(401);
    throw new Error("Invalid token");
  }

  const user = await User.findById(decoded.id).select("-password");
  if (!user) {
    res.status(401);
    throw new Error("Not authorized");
  }

  req.user = user;
  next();
});

module.exports = { protect };
