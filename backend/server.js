const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const pool = require("./config/db");
const { loadDocuments } = require("./services/documentServices");
const { generateRAGAnswer } = require("./services/ragAnswerService");

const authRoutes = require("./routes/authRoutes.js");
const chatRoutes = require("./routes/chatRoutes.js");
const authMiddleware = require("./middleware/authMiddleware.js");
const { saveMessage } = require("./models/messageModel.js");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

// Load documents for RAG
const documents = loadDocuments();

// Ask AI
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
    const result = await generateRAGAnswer(
      question,
      req.user.id
    );

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

// Test database connection
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

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});