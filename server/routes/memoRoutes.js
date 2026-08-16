const express = require("express");
const Memo = require("../models/Memo");
const auditMiddleware = require("../middleware/auditMiddleware");
const router = express.Router();

// CREATE memo
router.post("/", auditMiddleware("CREATE"), async (req, res) => { 
  try {
    const { title, content, createdBy } = req.body;

    const memo = await Memo.create({
      title,
      content,
      createdBy,
    });

    res.status(201).json(memo);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create memo",
      error: error.message,
    });
  }
});

// GET all memos
router.get("/", auditMiddleware("READ"), async (req, res) => {
  try {
    const memos = await Memo.find().sort({ createdAt: -1 });

    res.json(memos);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch memos",
      error: error.message,
    });
  }
});
// GET one memo by ID
router.get("/:id", auditMiddleware("READ"), async (req, res) => {
  try {
    const memo = await Memo.findById(req.params.id);

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
    const { title, content, createdBy } = req.body;

    const memo = await Memo.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
        createdBy,
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
    const memo = await Memo.findByIdAndDelete(req.params.id);

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