import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { CreatePost } from "./CreatePost";
import { PostCard } from "./PostCard";

const MyPosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyPosts();
    }, []);

    const fetchMyPosts = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${BASE_URL}/posts/my`, {
                withCredentials: true,
            });
            setPosts(res.data.data);
        } catch (err) {
            console.error("Error fetching my posts:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddPost = (newPost) => {
        setPosts([newPost, ...posts]);
    };

    const handleDeletePost = async (postId) => {
        try {
            await axios.delete(`${BASE_URL}/post/${postId}`, {
                withCredentials: true,
            });
            setPosts(posts.filter((post) => post._id !== postId));
        } catch (err) {
            console.error("Error deleting post:", err);
            alert("Failed to delete post");
        }
    };

    return (
        <div className="bg-[#0b1120] min-h-screen p-4 md:p-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">My Posts</h1>
                    <p className="text-slate-400">Share your thoughts, links, and photos with the community.</p>
                </div>

                <CreatePost onAddPost={handleAddPost} />

                {loading ? (
                    <div className="flex flex-col items-center gap-4 py-20">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        <p className="text-slate-500">Loading your posts...</p>
                    </div>
                ) : posts.length > 0 ? (
                    <div className="space-y-6 mt-8">
                        <h2 className="text-xl font-bold text-slate-200 mb-4 border-b border-slate-800 pb-2">Your Post History</h2>
                        {posts.map((post) => (
                            <PostCard
                                key={post._id}
                                {...post}
                                showDelete={true}
                                onDelete={handleDeletePost}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-2xl w-full mt-8">
                        <p className="text-slate-400 text-lg font-semibold">You haven't posted anything.</p>
                        <p className="text-slate-500 text-sm mt-2">Publish your first post above.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyPosts;
