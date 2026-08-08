const pool = require("../config/db");

const saveMessage = async (chatId, sender, message) => {
  const result = await pool.query(
    `INSERT INTO messages(chat_id, sender, message)
     VALUES($1, $2, $3)
     RETURNING *`,
    [chatId, sender, message]
  );

  return result.rows[0];
};

const getMessages = async (chatId) => {
  const result = await pool.query(
    `SELECT *
     FROM messages
     WHERE chat_id = $1
     ORDER BY created_at`,
    [chatId]
  );

  return result.rows;
};

module.exports = {
  saveMessage,
  getMessages
};