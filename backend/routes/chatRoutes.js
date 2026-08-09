const express = require("express");
const router = express.Router();

const {
  newChat,
  getCurrentChat,
} = require("../controllers/chatController.js");

const authMiddleware = require("../middleware/authMiddleware.js");

// Create a new chat
router.post("/", authMiddleware, newChat);

// Get current chat and its messages
router.get("/:chatId", authMiddleware, getCurrentChat);

module.exports = router;