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

const profile  = async (req, res) => {
  try {
    console.log('Profile endpoint called, user ID:', req.user?.userId);
    
    // req.user should be set by your authenticateToken middleware
    const userId = req.user?.userId;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not authenticated' 
      });
    }

    // Find user in database (adjust based on your User model)
    const user = await User.findById(userId).select('-password'); // Exclude password
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Get wallet balance if you have a separate wallet collection
    // const wallet = await Wallet.findOne({ userId });
    
    res.json({ 
      success: true, 
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        walletBalance: user.walletBalance || 0, // or wallet?.balance || 0
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
}

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
  getMe, 
  profile
};
