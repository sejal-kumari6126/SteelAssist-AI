require("dotenv").config();

const { Client } = require("pg");

const config = {
  host: process.env.PGHOST || "localhost",
  port: Number(process.env.PGPORT || 5432),
  user: process.env.PGUSER || "postgres",
  password: process.env.PGPASSWORD || "sejal2005",
};

const targetDb = process.env.PGNAME || "steelassist-ai";

async function ensureDatabaseExists() {
  const client = new Client({
    ...config,
    database: "postgres",
  });

  await client.connect();

  const result = await client.query(
    "SELECT 1 FROM pg_database WHERE datname = $1",
    [targetDb]
  );

  if (result.rowCount === 0) {
    await client.query(`CREATE DATABASE "${targetDb}"`);
    console.log(`Created PostgreSQL database: ${targetDb}`);
  } else {
    console.log(`Database already exists: ${targetDb}`);
  }

  await client.end();
}

async function initializeSchema() {
  const client = new Client({
    ...config,
    database: targetDb,
  });

  await client.connect();

  await client.query("CREATE EXTENSION IF NOT EXISTS vector;");

  const statements = [
    `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
    `
      CREATE TABLE IF NOT EXISTS chats (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
    `
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        chat_id INTEGER NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
        sender VARCHAR(50) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
    `
      CREATE TABLE IF NOT EXISTS employee_profiles (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        role VARCHAR(255),
        department VARCHAR(255),
        experience_years INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
    `
      CREATE TABLE IF NOT EXISTS training_progress (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        training_name VARCHAR(255) NOT NULL,
        status VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
    `
      CREATE TABLE IF NOT EXISTS knowledge_chunks (
        id SERIAL PRIMARY KEY,
        document_name VARCHAR(255) NOT NULL,
        chunk_index INTEGER NOT NULL,
        content TEXT NOT NULL,
        embedding VECTOR(768),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
    `
      CREATE INDEX IF NOT EXISTS idx_messages_chat_created_at
      ON messages(chat_id, created_at);
    `,
  ];

  for (const statement of statements) {
    await client.query(statement);
  }

  console.log("Database schema is ready.");
  await client.end();
}

async function main() {
  try {
    await ensureDatabaseExists();
    await initializeSchema();
  } catch (error) {
    console.error("Database initialization failed:", error);
    process.exit(1);
  }
}

main();
