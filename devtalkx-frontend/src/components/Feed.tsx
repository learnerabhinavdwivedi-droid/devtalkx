import React, { useState, useEffect } from 'react';
import { Post } from '../types'; // Centralized Type Source
import { CreatePost } from './CreatePost'; 
import { PostCard } from './PostCard'; 

export default function DevTalkFeed() {
  // 1. Initialize with an empty array to prevent mismatch during hydration
  const [posts, setPosts] = useState<Post[]>([]);

  // 2. PHASE A: Load data from LocalStorage on first render
  useEffect(() => {
    const savedPosts = localStorage.getItem('devtalkx_posts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      // Default mock data if the user has never visited before
      setPosts([
        {
          id: '1',
          title: 'How to optimize React performance in 2026',
          author: 'abhinav',
          tags: ['react', 'webdev', 'performance'],
          content: 'I was looking into the new concurrent rendering features and found some interesting patterns for devtalkx...',
          createdAt: '2026-02-16'
        },
        {
          id: '2',
          title: 'Machine Learning for SME Predictive Maintenance',
          author: 'mechanical_dev',
          tags: ['ai', 'maintenance', 'engineering'],
          content: 'Integrating mechanical engineering principles with software sensors is the future of SME industrial tech.',
          createdAt: '2026-02-15'
        }
      ]);
    }
  }, []);

  // 3. PHASE B: Save data to LocalStorage whenever 'posts' array changes
  useEffect(() => {
    // We only save if there's something to save (prevents overwriting on initial load)
    if (posts.length > 0) {
      localStorage.setItem('devtalkx_posts', JSON.stringify(posts));
    }
  }, [posts]);

  // Handler to add new posts
  const handleAddPost = (newPost: Post) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  // Handler to remove posts
  const handleDeletePost = (id: string) => {
    const updatedPosts = posts.filter((post) => post.id !== id);
    setPosts(updatedPosts);
    // Explicitly handle empty state in storage if last post is deleted
    if (updatedPosts.length === 0) {
      localStorage.setItem('devtalkx_posts', JSON.stringify([]));
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 p-4 md:p-8">
      {/* Header Section */}
      <div className="max-w-5xl mx-auto mb-12">
        <h1 className="text-4xl font-extrabold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
          DevTalkX Feed
        </h1>
        <p className="text-slate-500 mt-2">Connecting developers, engineers, and creators.</p>
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Post Creation Engine */}
        <CreatePost onAddPost={handleAddPost} />

        {/* Responsive Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {posts.length > 0 ? (
            posts.map((post) => (
              <PostCard 
                key={post.id} 
                id={post.id} 
                title={post.title}
                author={post.author}
                tags={post.tags}
                content={post.content}
                createdAt={post.createdAt}
                onDelete={handleDeletePost} 
              />
            ))
          ) : (
            <div className="col-span-full text-center py-20 border-2 border-dashed border-slate-800 rounded-2xl">
              <p className="text-slate-500 text-lg">No posts found. Be the first to start a conversation!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}