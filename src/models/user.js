import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("invalid email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("your password is not strong");
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
        values: ["male", "female"],
        message: `{VALUE} is not a valid gender type`,
      },
    },
    photoURL: {
      type: String,
      default:
        "https://img.freepik.com/premium-vector/social-media-logo_1305298-29989.jpg",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("invalid photo URL");
        }
      },
    },
    about: {
      type: String,
      default: "This is a default about of the user",
    },
    skills: {
      type: [String],
      validate(value) {
        if (value.length >= 5) {
          throw new Error("maximum length 5");
        }
      },
    },
    phoneNumber: {
      type: String,
      validate(value) {
        if (!validator.isMobilePhone(value)) {
          throw new Error("invalid mobile number");
        }
      },
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, "secret-key", {
    expiresIn: "7d",
  });

  return token;
};

userSchema.methods.validatePassword = async function (inputPassword) {
  const isPasswordValid = await bcrypt.compare(inputPassword, this.password);
  return isPasswordValid;
};

export const User = mongoose.model("User", userSchema);