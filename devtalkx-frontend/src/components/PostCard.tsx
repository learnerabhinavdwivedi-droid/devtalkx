import React from 'react';
import { Post } from '../types';

interface PostCardProps extends Post {
  onDelete?: (id: string) => void;
  showDelete?: boolean;
}

export const PostCard = ({ _id, title, authorId, tags, content, photoUrl, linkUrl, onDelete, showDelete }: PostCardProps) => {
  return (
    <div className="group relative bg-[#111827] border border-slate-800 rounded-xl hover:border-slate-700 transition-all duration-300 shadow-xl overflow-hidden mb-8">

      {showDelete && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(_id);
          }}
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" />
          </svg>
        </button>
      )}

      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <img
            src={authorId.photoUrl || "https://avatar.iran.liara.run/public/coding"}
            alt="author"
            className="w-10 h-10 rounded-full border border-slate-700 object-cover"
          />
          <div>
            <span className="text-sm font-bold text-white block">{authorId.firstName} {authorId.lastName}</span>
            <span className="text-xs text-slate-500">{authorId.devRole || "Developer"}</span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-slate-300 mb-4 whitespace-pre-wrap">{content}</p>

        {photoUrl && (
          <div className="mb-4 rounded-lg overflow-hidden border border-slate-800">
            <img src={photoUrl} alt="Post attachment" className="w-full object-cover max-h-96" />
          </div>
        )}

        {linkUrl && (
          <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="block mb-4 text-blue-400 hover:text-blue-300 underline text-sm truncate">
            {linkUrl}
          </a>
        )}

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag: string) => (
              <span key={tag} className="text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};