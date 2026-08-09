const { GoogleGenAI } = require("@google/genai");
const pool = require("../config/db");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function generateEmbedding(text) {
  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: text,
    config: {
      outputDimensionality: 768,
    },
  });

  return response.embeddings[0].values;
}

async function searchKnowledge(question, limit = 5) {
  const embedding = await generateEmbedding(question);

  const vector = `[${embedding.join(",")}]`;

  const result = await pool.query(
    `
    SELECT
      id,
      document_name,
      chunk_index,
      content,
      1 - (embedding <=> $1::vector) AS similarity
    FROM knowledge_chunks
    ORDER BY embedding <=> $1::vector
    LIMIT $2
    `,
    [vector, limit]
  );

  return result.rows;
}

module.exports = {
  generateEmbedding,
  searchKnowledge,
};