const jwt = require("jsonwebtoken");
const User = require("../models/user");

/**
 * userAuth Middleware
 * Protects private routes by verifying the JWT stored in cookies.
 */
const userAuth = async (req, res, next) => {
  try {
    // 1. Extract token from cookies
    // Note: Requires cookie-parser to be initialized in app.js
    const { token } = req.cookies;
    
    if (!token) {
      return res.status(401).send("Please Login!");
    }

    // 2. Verify Token
    // Uses the secret from .env or a fallback for development
    const decodedObj = await jwt.verify(
      token, 
      process.env.JWT_SECRET || "DEV@Tinder$790"
    );

    // 3. Find User
    const { _id } = decodedObj;
    const user = await User.findById(_id);
    
    if (!user) {
      throw new Error("User not found");
    }

    // 4. Attach user to request and move to next middleware/route
    // 🚀 The Critical Step: This allows subsequent routes to access 'req.user' directly
    req.user = user;
    next(); 
  } catch (err) {
    // Returns a 400 or 401 status to signal authentication failure
    res.status(401).send("ERROR: " + err.message);
  }
};

module.exports = { userAuth };