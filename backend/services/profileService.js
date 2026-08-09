const pool = require("../config/db");

async function getEmployeeContext(userId) {
  // Get employee profile
  const profileResult = await pool.query(
    `
    SELECT
      role,
      department,
      experience_years
    FROM employee_profiles
    WHERE user_id = $1
    `,
    [userId]
  );

  // Get training progress
  const trainingResult = await pool.query(
    `
    SELECT
      training_name,
      status
    FROM training_progress
    WHERE user_id = $1
    ORDER BY training_name
    `,
    [userId]
  );

  const profile = profileResult.rows[0] || null;

  const completedTraining = trainingResult.rows
    .filter((training) => training.status === "completed")
    .map((training) => training.training_name);

  const pendingTraining = trainingResult.rows
    .filter((training) => training.status === "pending")
    .map((training) => training.training_name);

  return {
    profile,
    completedTraining,
    pendingTraining,
  };
}

module.exports = {
  getEmployeeContext,
};
