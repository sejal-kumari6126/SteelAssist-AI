const bcrypt = require("bcrypt");
const { createUser } = require("../models/userModel");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save User
    const user = await createUser(name, email, hashedPassword);

    res.status(201).json({
      message: "User Registered Successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message,
    });
  }
};

module.exports = { register };