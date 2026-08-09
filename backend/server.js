const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const dotenv = require("dotenv");
require("dotenv").config();
const {loadDocuments,findRelevantDocument} = require("./services/documentServices");
const { GoogleGenAI } = require("@google/genai");
const { generateRAGAnswer } = require("./services/ragAnswerService");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
const authRoutes = require("./routes/authRoutes.js");
const chatRoutes = require("./routes/chatRoutes.js");
const authMiddleware = require("./middleware/authMiddleware");
const { saveMessage } = require("./models/messageModel");
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);


const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  });
  const documents = loadDocuments();
  
app.post("/ask", authMiddleware, async (req, res) => {
  try {
    const { question, chatId } = req.body;

    if (!chatId) {
      return res.status(400).json({
        error: "chatId is required",
      });
    }

    if (!question || !question.trim()) {
      return res.status(400).json({
        error: "Question is required",
      });
    }

    // Save user's question
    await saveMessage(chatId, "user", question);

    console.log("User Question:", question);
    console.log("Authenticated User ID:", req.user.id);

    // Generate answer using RAG
    const result = await generateRAGAnswer(question, req.user.id);

    const answer = result.answer;

    console.log("RAG Sources:", result.sources);

    // Save AI response
    await saveMessage(chatId, "ai", answer);

    res.json({
      answer,
      sources: result.sources,
    });

  } catch (error) {
    console.error("Full Error:", error);

    res.status(500).json({
      message: error.message,
      status: error.status,
      details: error.errorDetails || error,
    });
  }
});

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});