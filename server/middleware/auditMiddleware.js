const crypto = require("crypto");
const AuditLog = require("../models/AuditLog");

const auditMiddleware = (actionType) => {
  return async (req, res, next) => {
    try {
      const originalJson = res.json.bind(res);

      res.json = async (data) => {
        try {
          const memoId =
            data?._id ||
            req.params.id ||
            req.body?._id ||
            req.body?.memoId;

          if (memoId && req.user?.uid) {
            const lastLog = await AuditLog.findOne()
              .sort({ timestamp: -1, _id: -1 })
              .lean();

            const previousHash = lastLog?.currentHash || null;

            const timestamp = new Date();

            const hashData = [
              memoId.toString(),
              actionType,
              timestamp.toISOString(),
              req.user.uid,
              req.ip,
              previousHash || "",
            ].join("|");

            const currentHash = crypto
              .createHash("sha256")
              .update(hashData)
              .digest("hex");

            await AuditLog.create({
              memoId,
              actionType,
              timestamp,
              userId: req.user.uid,
              ipAddress: req.ip,
              previousHash,
              currentHash,
            });

            console.log(`Audit log created: ${actionType}`);
            console.log(`Hash: ${currentHash}`);
          }
        } catch (error) {
          console.error("Audit log failed:", error.message);
        }

        return originalJson(data);
      };

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = auditMiddleware;