const express = require("express");
const Memo = require("../models/Memo");
const auditMiddleware = require("../middleware/auditMiddleware");
const authenticateUser = require("../middleware/authMiddleware");

const router = express.Router();

// Every memo request requires Firebase authentication
router.use(authenticateUser);

// CREATE memo
router.post("/", auditMiddleware("CREATE"), async (req, res) => {
  try {
    const { title, content } = req.body;

const memo = await Memo.create({
  title,
  content,
  ownerId: req.user.uid,
});
    res.status(201).json(memo);
  } catch (error) {
  console.error("CREATE MEMO ERROR:", error);

  res.status(500).json({
    message: "Failed to create memo",
    error: error.message,
  });
}
});

// GET all memos belonging to the logged-in user
router.get("/", auditMiddleware("READ"), async (req, res) => {
  try {
    const memos = await Memo.find({
      ownerId: req.user.uid,
    }).sort({ createdAt: -1 });

    res.json(memos);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch memos",
      error: error.message,
    });
  }
});

// GET one memo
router.get("/:id", auditMiddleware("READ"), async (req, res) => {
  try {
    const memo = await Memo.findOne({
      _id: req.params.id,
      ownerId: req.user.uid,
    });

    if (!memo) {
      return res.status(404).json({
        message: "Memo not found",
      });
    }

    res.json(memo);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch memo",
      error: error.message,
    });
  }
});

// UPDATE memo
router.put("/:id", auditMiddleware("UPDATE"), async (req, res) => {
  try {
    const { title, content } = req.body;

    const memo = await Memo.findOneAndUpdate(
      {
        _id: req.params.id,
        ownerId: req.user.uid,
      },
      {
        title,
        content,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!memo) {
      return res.status(404).json({
        message: "Memo not found",
      });
    }

    res.json(memo);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update memo",
      error: error.message,
    });
  }
});

// DELETE memo
router.delete("/:id", auditMiddleware("DELETE"), async (req, res) => {
  try {
    const memo = await Memo.findOneAndDelete({
      _id: req.params.id,
      ownerId: req.user.uid,
    });

    if (!memo) {
      return res.status(404).json({
        message: "Memo not found",
      });
    }

    res.json({
      message: "Memo deleted successfully",
      memo,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete memo",
      error: error.message,
    });
  }
});

module.exports = router;