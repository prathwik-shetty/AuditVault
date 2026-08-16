const express = require("express");
const AuditLog = require("../models/AuditLog");
const authenticateUser = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authenticateUser);

// Get audit logs for a specific memo
router.get("/:memoId", async (req, res) => {
  try {
    const logs = await AuditLog.find({
      memoId: req.params.memoId,
    }).sort({ timestamp: -1 });

    res.json(logs);
  } catch (error) {
    console.error("Audit log error:", error);

    res.status(500).json({
      message: "Failed to fetch audit logs",
      error: error.message,
    });
  }
});

module.exports = router;