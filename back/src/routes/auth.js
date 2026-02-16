const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const { validateSignUpData } = require("../utils/validation");

// --- 1. SIGNUP ROUTE ---
// 🚀 Handles new developer registration with automatic password hashing via model hooks
authRouter.post("/signup", async (req, res, next) => { 
  try {
    // 🛠️ Step 1: Validate incoming data
    validateSignUpData(req);

    const user = new User(req.body);
    
    // 🛠️ Step 2: Save user (User model 'pre-save' hook hashes the password)
    await user.save();
    
    res.json({ 
      success: true, 
      message: "Developer Profile Created Successfully! 🚀" 
    });
  } catch (err) {
    // 🛠️ Step 3: Pass to global error handler in app.js
    next(err); 
  }
});

// --- 2. LOGIN ROUTE ---
// 🚀 Implements secure JWT cookie logic for session management
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    // 🔍 Find user by email
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // 🛡️ Validate password using schema method
    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      // 🎟️ Generate Token using schema method
      const token = await user.getJWT();

      // 🍪 Send Cookie (8-hour expiration)
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
        httpOnly: true, // 🚀 Security: Protects against XSS token theft
        secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
        sameSite: "strict",
      });

      res.send(user); // Send user object back to frontend store
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

// --- 3. LOGOUT ROUTE ---
// 🚀 Destroys the session by expiring the cookie immediately
authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.send("Logout Successful!! 🔌");
});

module.exports = authRouter;