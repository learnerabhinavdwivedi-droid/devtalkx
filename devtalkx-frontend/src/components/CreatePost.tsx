import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';

export const CreatePost = ({ onAddPost }: { onAddPost: (post: any) => void }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return alert("Title and Content are required!");

    try {
      setLoading(true);
      const res = await axios.post(
        `${BASE_URL}/post/create`,
        {
          title,
          content,
          tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
          photoUrl,
          linkUrl
        },
        { withCredentials: true }
      );

      onAddPost(res.data.data); // The populated post from the backend
      setTitle(''); setContent(''); setTags(''); setPhotoUrl(''); setLinkUrl('');
    } catch (err) {
      console.error(err);
      alert("Failed to create post");
    } finally {
      setLoading(false);
    }
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Image URL (optional)"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            className="w-full bg-[#0b1120] border border-slate-800 text-white placeholder-slate-500 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-all shadow-inner"
          />
          <input
            type="text"
            placeholder="Link URL (optional)"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="w-full bg-[#0b1120] border border-slate-800 text-white placeholder-slate-500 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-all shadow-inner"
          />
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
          <button disabled={loading} type="submit" className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold py-3 px-4 rounded-lg shadow-lg shadow-blue-600/20 transition-all duration-200">
            {loading ? "Publishing..." : "Publish Post"}
          </button>
        </div>
      </div>
    </form>
  );
};