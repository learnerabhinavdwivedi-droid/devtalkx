import express from "express";
import { userAuth } from "../middlewares/auth.js";
import { ConnectionRequest } from "../models/connectionRequest.js";
import { User } from "../models/user.js";

const userRouter = express.Router();

const USER_SAFE_DATA = [
  "firstName",
  "lastName",
  "age",
  "gender",
  "about",
  "photoURL",
  "skills",
  "email",
  "phoneNumber",
];

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    res.json({
      success: true,
      message: "data fetched successfully",
      data: connectionRequest,
    });
  } catch (e) {
    res.json({
      success: false,
      message: "something went wrong",
      error: e.message,
    });
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequest.map((row) => {
      if (loggedInUser._id.toString() === row.fromUserId._id.toString()) {
        return row.toUserId;
      } else {
        return row.fromUserId;
      }
    });

    res.json({
      success: true,
      message: "connection data fetched successfully",
      data: data,
    });
  } catch (e) {
    console.log(e);

    res.json({
      success: false,
      message: e.message || "no message",
    });
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;

    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;

    const skip = (page - 1) * limit;

    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUserFromFeed = new Set();

    connectionRequest.forEach((req) => {
      hideUserFromFeed.add(req.fromUserId.toString());
      hideUserFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        {
          _id: {
            $nin: Array.from(hideUserFromFeed),
          },
        },
        {
          _id: { $ne: loggedInUser._id },
        },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      message: "data fetched successfully",
      data: users,
    });
  } catch (e) {
    res.status(400).json({
      success: false,
      message: e.message,
    });
  }
});

export default userRouter;