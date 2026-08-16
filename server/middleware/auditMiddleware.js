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

          if (memoId) {
            await AuditLog.create({
              memoId,
              actionType,
              timestamp: new Date(),
              userId: req.user?.uid || "anonymous",
              ipAddress: req.ip,
            });

            console.log(`Audit log created: ${actionType}`);
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