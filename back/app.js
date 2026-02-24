// 1. Imports and Config
require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan');

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
const path = require('path');

app.use(helmet()); // Security headers
app.use(morgan('dev')); // Request logging
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded files statically

const clientUrl = process.env.CLIENT_URL ? process.env.CLIENT_URL.replace(/\/$/, "") : "http://localhost:5173";

const allowedOrigins = [
    clientUrl,
    "http://localhost:5173",
    "http://localhost:5002"
];

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        const isAllowed = allowedOrigins.includes(origin) ||
            (origin.endsWith("netlify.app") && origin.includes("devtalkx"));

        if (isAllowed) {
            callback(null, true);
        } else {
            console.warn(`CORS blocked request from origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json()); // Parses JSON bodies
app.use(cookieParser()); // Parses cookies

// 4. Routes
app.get("/health", (req, res) => {
    res.json({
        status: "alive",
        environment: process.env.NODE_ENV || "development",
        db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
        timestamp: new Date().toISOString()
    });
});

app.get("/", (req, res) => {
    res.status(200).send("🚀 DevTalkX Backend is live!");
});

const authRouter = require("./src/routes/auth");
const userRouter = require("./src/routes/user");
const requestRouter = require("./src/routes/request");
const chatRouter = require("./src/routes/chat");
const paymentRouter = require("./src/routes/payment");
const uploadRouter = require("./src/routes/upload");

app.use("/", authRouter);
app.use("/", userRouter);
app.use("/", requestRouter);
app.use("/", chatRouter);
app.use("/", paymentRouter);
app.use("/", uploadRouter);

// 5. Initialize Socket.io
const io = initializeSocket(server, corsOptions); // Pass same CORS options
app.set("socketio", io);

// 6. Global Error Handling
app.use((err, req, res, next) => {
    console.error("🔥 Error:", err.stack || err.message);

    const statusCode = err.statusCode || 500;
    const isProduction = process.env.NODE_ENV === "production";

    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
        ...(isProduction ? {} : { stack: err.stack })
    });
});

// 7. Database & Server Start
const PORT = process.env.PORT || 5002;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error("❌ MONGO_URI is missing in .env file");
    process.exit(1);
}

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("💎 MongoDB Connected");
        server.listen(PORT, () => {
            console.log(`🔥 DevTalkX Server running on port ${PORT}`);
        }).on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.error(`❌ Port ${PORT} is busy.`);
                process.exit(1);
            }
        });
    })
    .catch(err => {
        console.error("❌ DB Connection Failed:", err.message);
        process.exit(1);
    });
