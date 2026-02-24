const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");
// ConnectionRequest can be used for the "friend check" validation
const ConnectionRequest = require("../models/connectionRequest");

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId.toString(), targetUserId.toString()].sort().join("$"))
    .digest("hex");
};

const initializeSocket = (server, corsOptions) => {
  const io = socket(server, {
    cors: corsOptions || {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true
    },
    // Beast Mode: Terminate ghost connections faster
    pingTimeout: 60000,
  });

  io.on("connection", (socket) => {
    // 1. Private room for match notifications (frontend joins with user's own _id)
    socket.on("join_private_room", (userId) => {
      if (!userId) return;
      socket.join(userId.toString());
      console.log(`🔔 User ${userId} joined private notification room`);
    });

    // 2. Chat room joining
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      if (!userId || !targetUserId) return;

      const roomId = getSecretRoomId(userId, targetUserId);
      socket.join(roomId);
      console.log(`✨ ${firstName} secured in Room: ${roomId.substring(0, 8)}...`);
    });

    // 3. High-Performance Messaging (Private)
    socket.on("sendMessage", async ({ firstName, lastName, userId, targetUserId, text }) => {
      try {
        const roomId = getSecretRoomId(userId, targetUserId);

        if (!text || text.trim() === "") return;

        await Chat.findOneAndUpdate(
          { participants: { $all: [userId, targetUserId] } },
          {
            $push: { messages: { senderId: userId, text } }
          },
          { upsert: true, new: true }
        );

        io.to(roomId).emit("messageReceived", {
          firstName,
          lastName,
          text,
          senderId: userId,
          createdAt: new Date()
        });

      } catch (err) {
        console.error("❌ Socket Message Error:", err.message);
        socket.emit("error", { message: "Message could not be sent" });
      }
    });

    // --- COMMUNITY GLOBAL CHAT ---
    socket.on("join_community", ({ firstName, userId }) => {
      if (!userId) return;
      socket.join("community");
      console.log(`🌍 ${firstName || 'User'} joined Global Community Chat`);
    });

    socket.on("send_community_message", async ({ firstName, lastName, userId, photoUrl, text, messageType, fileUrl, fileName, fileMimeType, gifUrl }) => {
      try {
        const { CommunityMessage } = require("../models/communityMessage");

        // Save to DB
        const newMsg = new CommunityMessage({
          senderId: userId,
          text,
          messageType: messageType || "text",
          fileUrl,
          fileName,
          fileMimeType,
          gifUrl
        });
        await newMsg.save();

        // Broadcast to everyone in 'community' room
        io.to("community").emit("community_message_received", {
          _id: newMsg._id,
          firstName,
          lastName,
          photoUrl,
          text,
          messageType: messageType || "text",
          fileUrl,
          fileName,
          fileMimeType,
          gifUrl,
          senderId: userId,
          createdAt: newMsg.createdAt
        });

      } catch (err) {
        console.error("❌ Community Message Error:", err.message);
        socket.emit("error", { message: "Global message could not be sent" });
      }
    });


    // 4. Cleanup
    socket.on("disconnecting", () => {
      const rooms = Array.from(socket.rooms);
      console.log(`Cleanup: Socket ${socket.id} leaving ${rooms.length} rooms`);
    });

    socket.on("disconnect", () => {
      socket.removeAllListeners();
      console.log("🚀 User disconnected & listeners wiped.");
    });
  });

  // CRITICAL FIX: Return io so app.set("socketio", io) works correctly
  return io;
};

module.exports = initializeSocket;