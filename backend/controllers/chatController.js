const { createChat, getChatsByUser } = require("../models/chatModels.js");
const { saveMessage, getMessages } = require("../models/messageModel.js");

const newChat = async (req, res) => {
  try {
    const { title } = req.body;
    const userId = req.user.id;

    const chat = await createChat(userId, title);

    res.status(201).json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message,
    });
  }
};

const chatHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const chats = await getChatsByUser(userId);

    res.json(chats);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

const messages = async (req, res) => {
  try {
    const { chatId } = req.params;

    const data = await getMessages(chatId);

    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

module.exports = {
  newChat,
  chatHistory,
  messages,
};