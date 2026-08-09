const fs = require("fs");
const path = require("path");
const { GoogleGenAI } = require("@google/genai");
const pool = require("../config/db");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const DOCS_PATH = path.join(__dirname, "..", "docs");

const CHUNK_SIZE = 1200;
const CHUNK_OVERLAP = 200;

function chunkText(text) {
  const chunks = [];

  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + CHUNK_SIZE, text.length);

    const chunk = text.slice(start, end).trim();

    if (chunk) {
      chunks.push(chunk);
    }

    start += CHUNK_SIZE - CHUNK_OVERLAP;
  }

  return chunks;
}

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

async function ingestDocuments() {
  try {
    console.log("Starting document ingestion...");

    const files = fs
      .readdirSync(DOCS_PATH)
      .filter((file) => file.endsWith(".txt"));

    console.log(`Found ${files.length} documents.`);

    // Remove previously indexed chunks
    await pool.query("DELETE FROM knowledge_chunks");

    let totalChunks = 0;

    for (const file of files) {
      console.log(`\nProcessing: ${file}`);

      const filePath = path.join(DOCS_PATH, file);
      const text = fs.readFileSync(filePath, "utf8");

      const chunks = chunkText(text);

      console.log(`Created ${chunks.length} chunks.`);

      for (let i = 0; i < chunks.length; i++) {
        console.log(
          `Embedding chunk ${i + 1}/${chunks.length}...`
        );

        const embedding = await generateEmbedding(chunks[i]);

        // Convert array to pgvector format
        const vector = `[${embedding.join(",")}]`;

        await pool.query(
          `INSERT INTO knowledge_chunks
          (document_name, chunk_index, content, embedding)
          VALUES ($1, $2, $3, $4::vector)`,
          [
            file,
            i,
            chunks[i],
            vector,
          ]
        );

        totalChunks++;
      }
    }

    console.log("\n================================");
    console.log("Document ingestion completed!");
    console.log(`Total chunks inserted: ${totalChunks}`);
    console.log("================================");

    await pool.end();
    process.exit(0);

  } catch (error) {
    console.error("Document ingestion failed:");
    console.error(error);

    await pool.end();
    process.exit(1);
  }
}

ingestDocuments();