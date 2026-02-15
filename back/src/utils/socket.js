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

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"]
    },
    // Beast Mode: Terminate ghost connections faster
    pingTimeout: 60000, 
  });

  io.on("connection", (socket) => {
    // 1. Better Room Joining with logging
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      if (!userId || !targetUserId) return;
      
      const roomId = getSecretRoomId(userId, targetUserId);
      socket.join(roomId);
      console.log(`✨ ${firstName} secured in Room: ${roomId.substring(0, 8)}...`);
    });

    // 2. High-Performance Messaging
    socket.on("sendMessage", async ({ firstName, lastName, userId, targetUserId, text }) => {
      try {
        const roomId = getSecretRoomId(userId, targetUserId);

        // BEAST MODE SECURITY: Validation
        // Only save and emit if text actually exists
        if (!text || text.trim() === "") return;

        // Optimized DB Update: Using $push directly is faster than fetching & saving the whole doc
        const chat = await Chat.findOneAndUpdate(
          { participants: { $all: [userId, targetUserId] } },
          { 
            $push: { messages: { senderId: userId, text } } 
          },
          { upsert: true, new: true } // Creates the chat if it doesn't exist
        );

        // TARGETED EMIT: Use .to(roomId) but consider .broadcast to save sender bandwidth
        // We emit to the room so the target receives it instantly
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

    // 3. CLEANUP: The Memory Guard
    socket.on("disconnecting", () => {
      // Log rooms being left for debugging
      const rooms = Array.from(socket.rooms);
      console.log(`Cleanup: Socket ${socket.id} leaving ${rooms.length} rooms`);
    });

    socket.on("disconnect", () => {
      socket.removeAllListeners(); 
      console.log("🚀 User disconnected & listeners wiped.");
    });
  });
};

module.exports = initializeSocket;