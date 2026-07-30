require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Home Route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Welcome to SteelAssist AI 🚀"
    });
});
// Chat Route
app.post("/chat", (req, res) => {

    const { question } = req.body;

    res.json({
        success: true,
        answer: `You asked: ${question}`
    });

});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});