// 1. Imports and Config
require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const cookieParser = require('cookie-parser'); 
const mongoose = require('mongoose');

// Import Routers
const authRouter = require("./src/routes/auth"); 
const userRouter = require("./src/routes/user");
const requestRouter = require("./src/routes/request");

// 2. Initialize the App
const app = express();
const server = http.createServer(app);

// 3. Global Middleware
const corsOptions = {
    origin: process.env.CLIENT_URL || "http://localhost:5173", 
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true // 🚀 Required for JWT cookie persistence
};

app.use(cors(corsOptions));
app.use(express.json()); // 🚀 Parses JSON bodies so you can read req.body
app.use(cookieParser()); // 🚀 Parses cookies before they reach the routes

// 4. Routes
app.get("/", (req, res) => {
    res.status(200).send("🚀 DevMatch Backend is screaming fast and active!");
});

// 🛠️ MOUNTING FIX: Using "/" so /login works without a prefix
app.use("/", authRouter); 
app.use("/", userRouter); 
app.use("/", requestRouter);

// 5. Optimized Socket.io
const io = new Server(server, {
    cors: corsOptions,
    pingTimeout: 60000, 
});

app.set("socketio", io); 

io.on("connection", (socket) => {
    console.log(`🚀 DevMatch Active: Socket Connected - ${socket.id}`);

    socket.on("join_room", (roomId) => {
        if (!roomId) return;
        socket.join(roomId);
        console.log(`User ${socket.id} joined room: ${roomId}`);
    });

    socket.on("join_private_room", (userId) => {
        if (!userId) return;
        socket.join(userId);
        console.log(`User ${userId} listening for private alerts.`);
    });

    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data);
    });

    socket.on("disconnect", () => {
        console.log("Cleanup: Socket Disconnected.");
        socket.removeAllListeners(); 
    });
});

// 6. Global Error Handling
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});

// 7. Database & Server Start
const PORT = process.env.PORT || 5002;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("💎 MongoDB Connected: Data layer active");
        server.listen(PORT, () => {
            console.log(`🔥 Beast Mode Server running on port ${PORT}`);
        }).on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.error(`❌ Port ${PORT} is busy. Terminate the zombie process.`);
                process.exit(1);
            }
        });
    })
    .catch(err => {
        console.error("❌ DB Connection Failed:", err);
    });