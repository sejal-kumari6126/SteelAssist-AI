const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const dotenv = require("dotenv");
require("dotenv").config();
const {loadDocuments,findRelevantDocument} = require("./services/documentServices");
const { GoogleGenAI } = require("@google/genai");

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
        error: "chatId is required"
        });
      }
      await saveMessage(chatId, "user", question);
    const document = findRelevantDocument(question, documents);
    console.log("Matched Document:", document?.name || "None");
      let prompt = "";

      if (document) {
        prompt = `
      You are SteelAssist AI, an AI Learning &Development Assistant.

      Use ONLY the training document below to answer.

      If the answer exists in the document, explain it clearly in simple points.

      If the document does not contain the answer, reply exactly:

      "Sorry, this information is not available in the current training documents."

      Training Document:
      ${document.content}

      Question:
      ${question}

      Answer:
      `;
      } else {
        prompt = `
      You are SteelAssist AI.

      No relevant training document was found.

      Politely tell the user that no matching training document exists for this topic.
      `;
      }
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    const answer = response.text;

  await saveMessage(chatId, "ai", answer);
    res.json({
        answer
    });
  } catch (error) {
  console.error("Full Error:", error);

  res.status(500).json({
    message: error.message,
    status: error.status,
    details: error.errorDetails || error
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