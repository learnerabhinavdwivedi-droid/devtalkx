const express = require("express");
const postRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const Post = require("../models/post");

// Fetch global feed of all posts (Explore)
postRouter.get("/posts/explore", userAuth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 20;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;

        const posts = await Post.find()
            .populate("authorId", "firstName lastName photoUrl devRole")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json({ data: posts });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Fetch strictly logged-in user's posts (My Posts)
postRouter.get("/posts/my", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const posts = await Post.find({ authorId: loggedInUser._id })
            .populate("authorId", "firstName lastName photoUrl devRole")
            .sort({ createdAt: -1 });

        res.json({ data: posts });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new post
postRouter.post("/post/create", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const { title, content, tags, photoUrl, linkUrl } = req.body;

        if (!title || !content) {
            return res.status(400).json({ message: "Title and content are required." });
        }

        const newPost = new Post({
            authorId: loggedInUser._id,
            title,
            content,
            tags: tags || [],
            photoUrl,
            linkUrl,
        });

        const savedPost = await newPost.save();

        // Populate author details before returning, so UI can render immediately
        const populatedPost = await Post.findById(savedPost._id).populate(
            "authorId",
            "firstName lastName photoUrl devRole"
        );

        res.status(201).json({ message: "Post created successfully!", data: populatedPost });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a post
postRouter.delete("/post/:id", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const postId = req.params.id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Ensure the logged-in user is the author of the post
        if (post.authorId.toString() !== loggedInUser._id.toString()) {
            return res.status(403).json({ message: "Not authorized to delete this post." });
        }

        await Post.findByIdAndDelete(postId);
        res.json({ message: "Post deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = postRouter;
