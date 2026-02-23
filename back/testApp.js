/**
 * testApp.js — Lightweight Express app for integration tests.
 * Does NOT start the server or connect to MongoDB.
 * Mocks mongoose and socket.io to prevent side-effects.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRouter = require('./src/routes/auth');

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/', authRouter);

// Global error handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ success: false, message: err.message || 'Internal Server Error' });
});

module.exports = app;
