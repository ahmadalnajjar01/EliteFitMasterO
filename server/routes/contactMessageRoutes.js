// routes/contactMessageRoutes.js
const express = require("express");
const router = express.Router();
const contactMessageController = require("../controllers/contactMessageController");

// Existing routes
router.get("/messages", contactMessageController.getAllMessages);
router.post(
  "/messages/:messageId/reply",
  contactMessageController.replyToMessage
);

// NEW route for creating a message
router.post("/messages", contactMessageController.createMessage);

module.exports = router;
