const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema({
  memoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Memo",
    required: true,
  },

  actionType: {
    type: String,
    enum: ["CREATE", "READ", "UPDATE", "DELETE"],
    required: true,
  },

  timestamp: {
    type: Date,
    default: Date.now,
  },

  userId: {
    type: String,
    required: true,
  },

  ipAddress: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("AuditLog", auditLogSchema);