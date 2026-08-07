const { createUser } = require("../models/userModel");

const register = async (req, res) => {
  try {
    const { name, email, password, department } = req.body;

    const user = await createUser(name, email, password, department);

    res.status(201).json(user);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  register,
};