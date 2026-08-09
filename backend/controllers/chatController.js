const {
  createChat,
  getChatById,
} = require("../models/chatModels.js");

const { getMessages } = require("../models/messageModel.js");

const newChat = async (req, res) => {
  try {
    const { title } = req.body;
    const userId = req.user.id;

    const chat = await createChat(userId, title);

    res.status(201).json(chat);
  } catch (err) {
    console.error("Create Chat Error:", err);

    res.status(500).json({
      error: err.message,
    });
  }
};

const getCurrentChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    const chat = await getChatById(chatId, userId);

    if (!chat) {
      return res.status(404).json({
        message: "Chat not found",
      });
    }

    const messages = await getMessages(chatId);

    res.json({
      chat,
      messages,
    });
  } catch (err) {
    console.error("Get Chat Error:", err);

    res.status(500).json({
      error: err.message,
    });
  }
};

module.exports = {
  newChat,
  getCurrentChat,
};