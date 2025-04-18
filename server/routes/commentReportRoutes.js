// routes/commentReportRoutes.js

const express = require("express");
const router = express.Router();
const commentReportController = require("../controllers/commentReportController");
const authMiddleware = require("../middleware/authMiddleware");

// User routes
router.post("/", authMiddleware, commentReportController.createReport);

// Routes without admin checks
router.get("/", authMiddleware, commentReportController.getAllReports);
router.get(
  "/comments-with-reports",
  commentReportController.getAllCommentsWithReports
);
router.put("/:id", authMiddleware, commentReportController.updateReportStatus);
router.delete("/:id", authMiddleware, commentReportController.deleteReport);
router.delete("/comment/:id", commentReportController.deleteComment);

module.exports = router;
