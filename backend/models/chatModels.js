const pool = require("../config/db");

const createChat = async (userId, title) => {
  const result = await pool.query(
    `INSERT INTO chats(user_id, title)
     VALUES($1, $2)
     RETURNING *`,
    [userId, title]
  );

  return result.rows[0];
};

const getChatById = async (chatId, userId) => {
  const result = await pool.query(
    `SELECT *
     FROM chats
     WHERE id = $1 AND user_id = $2`,
    [chatId, userId]
  );

  return result.rows[0];
};

module.exports = {
  createChat,
  getChatById,
};