const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  const message = err && err.message ? err.message : "Server error";

  res.status(statusCode).json({
    success: false,
    message,
    data: null
  });
};

module.exports = { errorHandler };
