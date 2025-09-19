const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Replace with env var in production
const JWT_EXPIRES_IN = "1h";

const register = async ({ email, phone, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists with this email");
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    email,
    phone,
    password: hashedPassword,
  });

  await newUser.save();

  return {
    message: "User registered successfully",
    userId: newUser._id,
  };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = bcryptjs.compareSync(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
    }
  );

 const { password: _, ...userWithoutPassword } = user.toObject();

    return ({
      message: 'Login successful',
      token,
      user: userWithoutPassword,
    });
};

module.exports = {
  register,
  login,
};
