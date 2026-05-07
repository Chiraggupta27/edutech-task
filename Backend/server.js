const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./config/db");
const app = require("./app");

const start = async () => {
  try {
    await connectDB();
  } catch (err) {
    const message = err && err.message ? err.message : "DB connection failed";
    console.error(message);
    process.exit(1);
  }

  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.info(`Server running on port ${port}`);
  });
};

start();

