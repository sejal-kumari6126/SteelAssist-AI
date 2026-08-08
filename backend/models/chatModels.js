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

const getChatsByUser = async (userId) => {
  const result = await pool.query(
    `SELECT *
     FROM chats
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId]
  );

  return result.rows;
};

module.exports = {
  createChat,
  getChatsByUser,
};