const AuditLog = require("../models/AuditLog");

const auditMiddleware = (actionType) => {
  return async (req, res, next) => {
    try {
      const originalJson = res.json.bind(res);

      res.json = async (data) => {
        try {
          const userId = req.user?.uid;

          const ipAddress =
            req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
            req.socket.remoteAddress ||
            req.ip;

          let memoIds = [];

          // GET /api/memos/:id
          // UPDATE /api/memos/:id
          // DELETE /api/memos/:id
          if (req.params.id) {
            memoIds.push(req.params.id);
          }

          // CREATE /api/memos
          // The created memo ID comes from the response.
          if (data?._id) {
            memoIds.push(data._id.toString());
          }

          // GET /api/memos
          // The response is an array of memos.
          if (Array.isArray(data)) {
            memoIds = data
              .filter((memo) => memo?._id)
              .map((memo) => memo._id.toString());
          }

          // Remove duplicates
          memoIds = [...new Set(memoIds)];

          if (userId && memoIds.length > 0) {
            await Promise.all(
              memoIds.map((memoId) =>
                AuditLog.create({
                  memoId,
                  actionType,
                  timestamp: new Date(),
                  userId,
                  ipAddress,
                })
              )
            );

            console.log(
              `Audit log created: ${actionType} (${memoIds.length} memo(s))`
            );
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