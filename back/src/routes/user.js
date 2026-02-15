const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

// Beast Mode: Updated to include all the aesthetic dev data
const USER_SAFE_DATA = "firstName lastName photoUrl age gender bio skills devRole projectLink lookingFor";

// --- 1. PROFILE VIEW ---
// Fetches the logged-in user's data attached by userAuth middleware
userRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user; 
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

// --- 2. PROFILE EDIT ---
// Allows partial updates for safe fields
userRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const ALLOWED_UPDATES = ["firstName", "lastName", "photoUrl", "gender", "age", "bio", "skills", "devRole", "projectLink"];
    
    Object.keys(req.body).forEach((key) => {
      if (ALLOWED_UPDATES.includes(key)) loggedInUser[key] = req.body[key];
    });

    await loggedInUser.save();
    res.json({ message: "Profile updated successfully!", data: loggedInUser });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

// --- 3. PENDING REQUESTS ---
// Fetched "interested" requests received by the logged-in user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    res.json({
      message: "Pending requests fetched.",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

// --- 4. MUTUAL CONNECTIONS ---
// List of all accepted matches
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({ data });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

// --- 5. DEV-MATCH FEED ---
// Discovery logic with pagination and interaction filtering
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    // Handle Pagination
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    // Find all users already interacted with
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });
    
    // Always hide yourself
    hideUsersFromFeed.add(loggedInUser._id.toString());

    // Fetch new developers not in the hide set
    const users = await User.find({
      _id: { $nin: Array.from(hideUsersFromFeed) }
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.json({ data: users });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = userRouter;