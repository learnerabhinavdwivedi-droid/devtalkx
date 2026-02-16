const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    emailId: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address: " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password must be stronger (Min 8 chars, 1 Uppercase, 1 Symbol)");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: `{VALUE} is not a valid gender type`,
      },
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    membershipType: {
      type: String,
      enum: ["Free", "Silver", "Gold"],
      default: "Free",
    },
    photoUrl: {
      type: String,
      default: "https://avatar.iran.liara.run/public/coding",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Photo URL: " + value);
        }
      },
    },
    bio: {
      type: String,
      maxLength: 200,
      default: "Hello World! I am a developer.",
    },
    skills: {
      type: [String],
      default: [],
    },
    devRole: { 
      type: String, 
      enum: ["Frontend", "Backend", "Fullstack", "DevOps", "AI/ML"] 
    },
    projectLink: { 
      type: String,
      validate(value) {
        if (value && !validator.isURL(value)) {
          throw new Error("Invalid Project URL");
        }
      }
    },
  },
  { timestamps: true }
);

// ✅ CORRECT: Beast Mode Fix (No 'next' parameter or call)
// This runs automatically before every .save() call
userSchema.pre("save", async function () {
  const user = this;

  // Only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return;

  // Hash the password with a salt round of 10
  user.password = await bcrypt.hash(user.password, 10);
  
  // No next() call is needed for async functions in modern Mongoose
});

// --- HELPER METHODS ---

// Generate JWT for Auth
userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign(
    { _id: user._id }, 
    process.env.JWT_SECRET || "DEV@Tinder$790", 
    { expiresIn: "7d" }
  );
  return token;
};

// Validate Password during Login
userSchema.methods.validatePassword = async function (passwordInputByUser) {
  return await bcrypt.compare(passwordInputByUser, this.password);
};

module.exports = mongoose.model("User", userSchema);