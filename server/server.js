const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const memoRoutes = require("./routes/memoRoutes");
const app = express();

app.use(express.json());

app.use(cors());

app.use("/api/memos", memoRoutes);
// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });

app.get("/", (req, res) => {
  res.json({
    message: "AuditVault API is running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});