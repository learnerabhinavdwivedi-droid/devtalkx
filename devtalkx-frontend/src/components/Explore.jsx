import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { PostCard } from "./PostCard";

const Explore = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchExplorePosts();
    }, []);

    const fetchExplorePosts = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${BASE_URL}/posts/explore`, {
                withCredentials: true,
            });
            setPosts(res.data.data);
        } catch (err) {
            console.error("Error fetching explore posts:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#0b1120] min-h-screen p-4 md:p-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Explore</h1>
                    <p className="text-slate-400">See what the DevTalkX community is talking about.</p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center gap-4 py-20">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        <p className="text-slate-500">Loading posts...</p>
                    </div>
                ) : posts.length > 0 ? (
                    <div className="space-y-6">
                        {posts.map((post) => (
                            <PostCard key={post._id} {...post} showDelete={false} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-2xl w-full">
                        <p className="text-slate-400 text-lg font-semibold">No posts found.</p>
                        <p className="text-slate-500 text-sm mt-2">Publish a post in My Posts and it will appear here!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Explore;
