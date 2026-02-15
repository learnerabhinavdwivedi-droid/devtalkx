const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const { validateSignUpData } = require("../utils/validation");

// 1. SIGNUP ROUTE
// Uses next(err) to pass errors to the global error handler in app.js
authRouter.post("/signup", async (req, res, next) => { 
  try {
    // Optional: validateSignUpData(req);

    const user = new User(req.body);
    
    // The pre-save hook in your User model handles password hashing automatically
    await user.save();
    
    res.json({ 
      success: true, 
      message: "User Saved Successfully!" 
    });
  } catch (err) {
    // Passes the error (like duplicate email or validation failure) to app.js middleware
    next(err); 
  }
});

// 2. LOGIN ROUTE
// Implements secure JWT cookie logic and schema-based password validation
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    // Find user by email
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Use the schema method 'validatePassword' defined in your User model
    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      // Generate Token using the schema method 'getJWT'
      const token = await user.getJWT();

      // Send Cookie (Expires in 8 hours)
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
        httpOnly: true, // Critical security: Prevents XSS attacks from reading the token
      });

      res.send(user);
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

// 3. LOGOUT ROUTE
// Immediately expires the cookie to effectively clear the user session
authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout Successful!!");
});

module.exports = authRouter;