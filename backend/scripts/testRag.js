require("dotenv").config();

const { searchKnowledge } = require("../services/ragService");
const pool = require("../config/db");

async function testRAG() {
  try {
    const question = "What is Lockout Tagout and what are its steps?";

    console.log("\nUser Question:");
    console.log(question);

    console.log("\nSearching knowledge base...\n");

    const results = await searchKnowledge(question, 5);

    results.forEach((result, index) => {
      console.log(`========== RESULT ${index + 1} ==========`);
      console.log("Document:", result.document_name);
      console.log("Chunk:", result.chunk_index);
      console.log(
        "Similarity:",
        Number(result.similarity).toFixed(4)
      );
      console.log("Content:");
      console.log(result.content);
      console.log();
    });

    await pool.end();

  } catch (error) {
    console.error("RAG test failed:");
    console.error(error);

    await pool.end();
  }
}

testRAG();