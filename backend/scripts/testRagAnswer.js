require("dotenv").config();

const {
  generateRAGAnswer,
} = require("../services/ragAnswerService");

async function testRAGAnswer() {
  try {
    const question =
      "What is Lockout Tagout and what are its steps?";

    console.log("\nUSER QUESTION:");
    console.log(question);

    console.log("\nGenerating RAG answer...\n");

    const result = await generateRAGAnswer(question);

    console.log("================================");
    console.log("STEELASSIST AI ANSWER");
    console.log("================================\n");

    console.log(result.answer);

    console.log("\n================================");
    console.log("SOURCES");
    console.log("================================");

    result.sources.forEach((source) => {
      console.log(
        `${source.document} | similarity: ${source.similarity}`
      );
    });

  } catch (error) {
    console.error("RAG answer generation failed:");
    console.error(error);
  }
}

testRAGAnswer();