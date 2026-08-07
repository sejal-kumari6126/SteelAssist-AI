const pool = require("../config/db");

const createUser = async (name, email, password, department) => {
  const query = `
    INSERT INTO users(name, email, password, department)
    VALUES($1, $2, $3, $4)
    RETURNING *;
  `;

  const values = [name, email, password, department];

  const result = await pool.query(query, values);

  return result.rows[0];
};

module.exports = {
  createUser,
};