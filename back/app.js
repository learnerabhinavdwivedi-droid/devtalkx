// 1. Imports and Config
require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

// Import Routers
const authRouter = require("./src/routes/auth");
const userRouter = require("./src/routes/user");
const requestRouter = require("./src/routes/request");
const chatRouter = require("./src/routes/chat");
const paymentRouter = require("./src/routes/payment");

// Import Socket Initializer
const initializeSocket = require("./src/utils/socket");

// 2. Initialize the App
const app = express();
const server = http.createServer(app);

app.set("trust proxy", 1);

// 3. Global Middleware
const clientUrl = process.env.CLIENT_URL ? process.env.CLIENT_URL.replace(/\/$/, "") : "http://localhost:5173";

const corsOptions = {
    origin: clientUrl,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true // Required for JWT cookie persistence
};

app.use(cors(corsOptions));
app.use(express.json()); // Parses JSON bodies so you can read req.body
app.use(cookieParser()); // Parses cookies before they reach the routes

// 4. Routes
app.get("/", (req, res) => {
    res.status(200).send("🚀 DevTalkX Backend is live!");
});

app.use("/", authRouter);
app.use("/", userRouter);
app.use("/", requestRouter);
app.use("/", chatRouter);
app.use("/", paymentRouter);

// 5. Initialize Socket.io (handles all real-time logic via src/utils/socket.js)
const io = initializeSocket(server);
app.set("socketio", io);

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
            console.log(`🔥 DevTalkX Server running on port ${PORT}`);
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