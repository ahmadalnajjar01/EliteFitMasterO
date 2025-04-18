const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const multer = require("../config/multerConfig");
const authMiddleware = require("../middleware/authMiddleware");

router.post(
  "/comments",
  authMiddleware,
  multer,
  commentController.createComment
);
router.get("/comments/:productId", commentController.getCommentsByProduct);

module.exports = router;
