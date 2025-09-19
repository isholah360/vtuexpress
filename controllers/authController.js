const authService = require("../services/authService");

const register = async (req, res) => {
  try {
    const { email, phone, password } = req.body;
    const result = await authService.register({ email, phone, password });
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    
    res.cookie("jwt", result.token, {
      httpOnly: true,
      maxAge: 3600000000,
      secure: process.env.NODE_ENV === 'production',
    });

  
    res.status(200).json({ 
      success: true,
      message: "Login successful",
      token: result.token, // Add this for Thunder Client
      user: result.user
    });

  } catch (err) {
    console.error("Login error:", err.message);
    res.status(400).json({ 
      success: false,
      error: err.message 
    });
  }
};

const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};
const getMe = async (req, res) => {
  console.log(req.user);
  res.status(200).json({ "this is": "protected route", user: req.user });
}

module.exports = {
  register,
  login,
  logout,
  getMe
};
