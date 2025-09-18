const jwt = require("jsonwebtoken");

const authenticated = (req, res, next) => {
  console.log("All cookies:", req.cookies); // Debug: see all cookies
  
  const token = req.cookies.jwt;
  console.log("Token from cookie:", token);

  if (!token) {
    return res.status(401).json({ 
      success: false,
      error: "No token provided in cookies" 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("Authenticated user:", req.user);
    next();
  } catch (err) {
    console.error("Token verification error:", err.message);
    return res.status(401).json({ 
      success: false,
      error: "Invalid or expired token" 
    });
  }
};

module.exports = authenticated;