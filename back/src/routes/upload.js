const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { userAuth } = require('../middlewares/auth');

const uploadRouter = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter (e.g., images, pdfs, etc. - adjustable based on needs)
const fileFilter = (req, file, cb) => {
    // For now, allow most safe common types. Can be restricted further.
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|zip/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Error: File type not supported!'));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: fileFilter
});

uploadRouter.post('/upload', userAuth, upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    // Construct the URL to access the file
    const fileUrl = `${process.env.CLIENT_URL ? process.env.CLIENT_URL.replace("netlify.app", "onrender.com") : 'http://localhost:5002'}/uploads/${req.file.filename}`;

    res.status(200).json({
        message: 'File uploaded successfully',
        file: {
            url: fileUrl,
            name: req.file.originalname,
            type: req.file.mimetype
        }
    });
});

module.exports = uploadRouter;
