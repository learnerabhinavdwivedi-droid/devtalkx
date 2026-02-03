import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

export const userAuth = async (req, res, next) => {
  try {
    const cookies = req.cookies;

    const { token } = cookies;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Invalid token, user not found",
      });
    } 

    const decodedObj = jwt.verify(token, "secret-key");
    const { _id } = decodedObj;

    const user = await User.findById(_id);
    if (!user) {
      res.status(401).json({
        success: false,
        message: "invalid token, user not logged in",
      });
    }

    req.user = user;

    next();
  } catch (e) {
    res.json({
      success: false,
      message: e.message,
    });
  }
};