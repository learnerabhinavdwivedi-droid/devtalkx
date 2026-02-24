const mongoose = require("mongoose");

const communityMessageSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        text: {
            type: String,
            default: "",
            maxLength: 1000,
        },
        messageType: {
            type: String,
            enum: ["text", "file", "gif"],
            default: "text",
        },
        fileUrl: {
            type: String, // Path to the uploaded file relative to the server
        },
        fileName: {
            type: String,
        },
        fileMimeType: {
            type: String,
        },
        gifUrl: {
            type: String,
        }
    },
    { timestamps: true }
);

const CommunityMessage = mongoose.model("CommunityMessage", communityMessageSchema);

module.exports = { CommunityMessage };
