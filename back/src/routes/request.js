const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

// --- SWIPE ENDPOINT (The Tinder Logic) ---
requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    // 1. BEAST MODE GUARD: Can't match with yourself
    if (fromUserId.toString() === toUserId.toString()) {
      return res.status(400).json({ success: false, message: "Self-pairing is disabled in this IDE!" });
    }

    const allowedStatus = ["ignored", "interested"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status: " + status });
    }

    // 2. Existence & Duplication Check
    const toUser = await User.findById(toUserId);
    if (!toUser) return res.status(404).json({ success: false, message: "User not found." });

    const existingRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (existingRequest) {
      return res.status(400).json({ success: false, message: "Already in the connection pipeline." });
    }

    // 3. THE INSTANT MATCH ENGINE
    // If I'm interested, check if they already 'interested' me
    if (status === "interested") {
      const mutualInterest = await ConnectionRequest.findOne({
        fromUserId: toUserId,
        toUserId: fromUserId,
        status: "interested",
      });

      // If they already swiped right on me, convert this to an INSTANT match
      if (mutualInterest) {
        mutualInterest.status = "accepted";
        await mutualInterest.save();
        
        // --- TODO: io.to(toUserId).emit("match") ---
        return res.json({
          success: true,
          message: `🚀 0-Day Match! You and ${toUser.firstName} are now connected.`,
          match: true,
          data: mutualInterest
        });
      }
    }

    // Standard swipe record
    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    const data = await connectionRequest.save();

    res.json({
      success: true,
      message: status === "interested" ? `Pinged ${toUser.firstName}...` : "Skipped.",
      match: false,
      data,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// --- REVIEW ENDPOINT (For manual pending requests) ---
requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { status, requestId } = req.params;

    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ success: false, message: "Status must be accepted or rejected." });
    }

    // Use findOneAndUpdate to ensure the operation is Atomic
    const connectionRequest = await ConnectionRequest.findOneAndUpdate(
      {
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      },
      { status: status },
      { new: true, runValidators: true }
    );

    if (!connectionRequest) {
      return res.status(404).json({ success: false, message: "Request invalid or already compiled." });
    }

    res.json({
      success: true,
      message: status === "accepted" ? "⚡ Connection Compiled successfully!" : "Connection terminated.",
      data: connectionRequest,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = requestRouter;