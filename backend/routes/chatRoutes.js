const express = require("express");
const router = express.Router();

const {
  newChat,
  chatHistory,
  messages,
} = require("../controllers/chatController");

const authMiddleware = require("../middleware/authMiddleware.js");

router.post("/", authMiddleware, newChat);

router.get("/", authMiddleware, chatHistory);

router.get("/:chatId", authMiddleware, messages);

module.exports = router;