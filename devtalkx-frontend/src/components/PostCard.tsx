import React from 'react';
import { Post } from '../types';

interface PostCardProps extends Post {
  onDelete: (id: string) => void;
}

export const PostCard = ({ id, title, author, tags, content, onDelete }: PostCardProps) => {
  return (
    <div className="group relative cursor-pointer bg-[#111827] border border-slate-800 p-6 rounded-xl hover:border-red-500/30 transition-all duration-300 shadow-xl overflow-hidden mb-4">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(id);
        }}
        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" />
        </svg>
      </button>

      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold">
          {author ? author[0].toUpperCase() : 'U'}
        </div>
        <span className="text-sm font-semibold text-white">@{author}</span>
      </div>

      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-slate-400 line-clamp-3 mb-6">{content}</p>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag: string) => (
          <span key={tag} className="text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
};