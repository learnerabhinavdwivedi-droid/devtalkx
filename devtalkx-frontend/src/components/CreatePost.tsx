import React, { useState } from 'react';

export const CreatePost = ({ onAddPost, author }: { onAddPost: (post: any) => void; author: string }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return alert("Title and Content are required!");

    const newPost = {
      id: Math.random().toString(), // Temporary ID
      title,
      author,          // real logged-in user
      content,
      tags: tags.split(',').map(tag => tag.trim()),
      createdAt: new Date().toISOString(),
    };

    onAddPost(newPost);
    setTitle(''); setContent(''); setTags('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-10 p-6 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-2xl">
      <h2 className="text-xl font-bold text-white mb-4">Share a DevTalk</h2>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Post Title..."
          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-blue-500 outline-none transition-all"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="What's on your mind?"
          rows={4}
          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-blue-500 outline-none transition-all"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <input
          type="text"
          placeholder="Tags (comma separated: react, ai, tech)"
          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-blue-500 outline-none transition-all"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors shadow-lg shadow-blue-900/20"
        >
          Publish Post
        </button>
      </div>
    </form>
  );
};