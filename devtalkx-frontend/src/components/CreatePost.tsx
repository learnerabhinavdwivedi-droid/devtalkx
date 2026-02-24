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
    <form onSubmit={handleSubmit} className="bg-[#111827] rounded-xl border border-slate-800 shadow-xl overflow-hidden mb-8">
      <div className="p-5 sm:p-6 border-b border-slate-800">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="w-1.5 h-6 bg-blue-500 rounded-full inline-block"></span>
          Share a DevTalk
        </h2>
      </div>

      <div className="p-5 sm:p-6 space-y-4 bg-[#111827]">
        <div>
          <input
            type="text"
            placeholder="Post Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-[#0b1120] border border-slate-800 text-white placeholder-slate-500 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
          />
        </div>

        <div>
          <textarea
            placeholder="What's on your mind?"
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-[#0b1120] border border-slate-800 text-white placeholder-slate-500 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-y shadow-inner"
          ></textarea>
        </div>

        <div>
          <input
            type="text"
            placeholder="Tags (comma separated: react, ai, tech)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full bg-[#0b1120] border border-slate-800 text-white placeholder-slate-500 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
          />
        </div>

        <div className="pt-2">
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-lg shadow-lg shadow-blue-600/20 transition-all duration-200 active:scale-[0.98]">
            Publish Post
          </button>
        </div>
      </div>
    </form>
  );
};