// 1. Imports and Config
require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // CRITICAL: For JWT parsing
const mongoose = require('mongoose');
const path = require('path');

// Import Routers
const authRouter = require("./src/routes/auth"); 
const userRouter = require("./src/routes/user"); // Ensure this is imported

// 2. Initialize the App
const app = express();
const server = http.createServer(app);

// 3. Global Middleware
const corsOptions = {
    // Allows dynamic origin from .env or local React dev server
    origin: process.env.CLIENT_URL || "http://localhost:5173", 
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true // CRITICAL: Allows browser to send/receive JWT cookies
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser()); // CRITICAL: Must be placed before routes

// 4. Routes
// Health Check Route
app.get("/", (req, res) => {
    res.status(200).send("🚀 DevMatch Backend is screaming fast and active!");
});

// Mounted API Routers
app.use("/auth", authRouter); 
app.use("/", userRouter); 

// 5. Optimized Socket.io with Memory Leak Protection
const io = new Server(server, {
    cors: corsOptions,
    pingTimeout: 60000, 
});

io.on("connection", (socket) => {
    console.log(`🚀 DevMatch Active: Socket Connected - ${socket.id}`);

    socket.on("join_room", (roomId) => {
        if (!roomId) return;
        socket.join(roomId);
        console.log(`User ${socket.id} joined room: ${roomId}`);
    });

    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data);
    });

    socket.on("notify_match", (data) => {
        socket.to(data.targetUserId).emit("match_alert", {
            message: "🚀 It's a match! A new dev wants to collaborate.",
            from: data.fromUserName
        });
    });

    socket.on("disconnect", () => {
        console.log("Cleanup: Socket Disconnected.");
        socket.removeAllListeners(); 
    });
});

// 6. Global Error Handling (The Safety Net)
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

// 7. Database & Server Start (Beast Mode)
const PORT = process.env.PORT || 5002;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("💎 MongoDB Connected: Data layer active");
        server.listen(PORT, () => {
            console.log(`🔥 Beast Mode Server running on port ${PORT}`);
        }).on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.error(`❌ Port ${PORT} is busy. Terminate the zombie process or use a different port.`);
                process.exit(1);
            }
        });
    })
    .catch(err => {
        console.error("❌ DB Connection Failed:", err);
    });