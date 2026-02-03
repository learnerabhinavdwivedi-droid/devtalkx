import express, { request } from "express";
import { userAuth } from "../middlewares/auth.js";
const requestRouter = express.Router();
import { ConnectionRequest } from "../models/connectionRequest.js";
import { User } from "../models/user.js";

requestRouter.post(
  "/api/send-connection-request",
  userAuth,
  async (req, res) => {
    try {
      res.json({
        success: true,
        message: "sending connection request",
      });
    } catch (e) {
      res.json({
        success: false,
        message: "something went wrong",
        error: e.message,
      });
    }
  }
);

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];

      if (!allowedStatus.includes(status)) {
        throw new Error("invalid status type" + status);
      }

      const toUser = await User.findById(toUserId);

      if (!toUser) {
        throw new Error("user not found");
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          {
            fromUserId: fromUserId,
            toUserId: toUserId,
          },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });

      if (existingConnectionRequest) {
        throw new Error("connection request already exists");
      }

      const connectionRequestModel = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequestModel.save();

      const message =
        status == "interested"
          ? `${req.user.firstName} is interested in ${toUser.firstName}`
          : `${req.user.firstName} is ignored ${toUser.firstName}`;

      res.json({
        success: true,
        message: message,
        data: data,
      });
    } catch (e) {

      console.log(e);

      res.status(400).json({
        success: false,
        message: e.message,
      });
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];

      if (!allowedStatus.includes(status)) {
        throw new Error("status is not allowed");
      }

      const connectionRequest = await ConnectionRequest.findOne({
        fromUserId: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        throw new Error("connection request not found");
      }

      connectionRequest.status = status;
      await connectionRequest.save();

      res.json({
        success: true,
        message: "connection request " + status,
      });
    } catch (e) {
      res.status(400).json({
        success: false,
        message: "something went wrong",
        error: e.message || "no messages found",
      });
    }
  }
);

export default requestRouter;