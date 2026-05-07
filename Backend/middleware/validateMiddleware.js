const { validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  const list = errors.array();
  const first = list && list.length ? list[0] : null;
  const friendlyMessage =
    (first && (first.msg || first.message)) || "Validation failed";

  res.status(400).json({
    success: false,
    message: friendlyMessage,
    data: { errors: list }
  });
};

module.exports = validate;
