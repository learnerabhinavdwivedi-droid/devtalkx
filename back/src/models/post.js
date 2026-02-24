const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
    {
        authorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
            maxLength: 100,
        },
        content: {
            type: String,
            required: true,
            maxLength: 2000,
        },
        tags: {
            type: [String],
            default: [],
        },
        photoUrl: {
            type: String,
            default: "",
        },
        linkUrl: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
