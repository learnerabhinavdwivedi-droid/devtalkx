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
authRouter.post("/login", async (req, res, next) => {
  try {
    const { emailId, password } = req.body;

    // 🔍 Find user by email
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      const error = new Error("Invalid credentials");
      error.statusCode = 401;
      throw error;
    }

    // 🛡️ Validate password using schema method
    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      const isProduction = process.env.NODE_ENV === "production";

      // 🎟️ Generate Token using schema method
      const token = await user.getJWT();

      // 🍪 Send Cookie (8-hour expiration)
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
        httpOnly: true, // 🚀 Security: Protects against XSS token theft
        secure: isProduction, // Only send over HTTPS in production
        sameSite: isProduction ? "none" : "lax",
      });

      res.json({
        success: true,
        data: user,
        message: "Login successful!"
      });
    } else {
      const error = new Error("Invalid credentials");
      error.statusCode = 401;
      throw error;
    }
  } catch (err) {
    next(err);
  }
});

// --- 3. LOGOUT ROUTE ---
// 🚀 Destroys the session by expiring the cookie immediately
authRouter.post("/logout", async (req, res, next) => {
  try {
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });
    res.json({
      success: true,
      message: "Logout Successful!! 🔌"
    });
  } catch (err) {
    next(err);
  }
});

module.exports = authRouter;