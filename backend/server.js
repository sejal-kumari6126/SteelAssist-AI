const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenAI } = require("@google/genai");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: question,
    });

    res.json({
      answer: response.text,
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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});