const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const memoRoutes = require("./routes/memoRoutes");
const auditRoutes = require("./routes/auditRoutes");
const app = express();

app.use(express.json());

app.use(cors());

app.use("/api/memos", memoRoutes);
app.use("/api/auditlogs", auditRoutes);
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



app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "AuditVault API is healthy",
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`AuditVault server running on port ${PORT}`);
});