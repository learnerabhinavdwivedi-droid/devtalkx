import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Post } from '../types';
import { CreatePost } from './CreatePost';
import { PostCard } from './PostCard';
import { BASE_URL } from '../utils/constants';

interface Developer {
  _id: string;
  firstName: string;
  lastName: string;
  photoUrl: string;
  bio: string;
  devRole: string;
  skills: string[];
  age: number;
  gender: string;
}

type Tab = 'devmatch' | 'devtalk';

export default function Feed() {
  const user = useSelector((store: any) => store.user);
  const location = window.location.pathname;
  const tab: Tab = location.includes('match') ? 'devmatch' : 'devtalk';

  // DevMatch state
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matchLoading, setMatchLoading] = useState(true);
  const [swipeMsg, setSwipeMsg] = useState('');

  // DevTalk (posts) state
  const [posts, setPosts] = useState<Post[]>([]);

  // Load developers from backend
  useEffect(() => {
    if (tab === 'devmatch') {
      setMatchLoading(true);
      axios
        .get(`${BASE_URL}/feed`, { withCredentials: true })
        .then((res) => {
          setDevelopers(res.data.data || []);
        })
        .catch((err) => console.error('Feed error:', err))
        .finally(() => setMatchLoading(false));
    }
  }, [tab]);

  // Load posts from localStorage
  useEffect(() => {
    const savedPosts = localStorage.getItem('devtalkx_posts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      setPosts([
        {
          id: '1',
          title: 'How to optimize React performance in 2026',
          author: 'abhinav',
          tags: ['react', 'webdev', 'performance'],
          content: 'I was looking into the new concurrent rendering features and found some interesting patterns...',
          createdAt: '2026-02-16',
        },
        {
          id: '2',
          title: 'Machine Learning for SME Predictive Maintenance',
          author: 'mechanical_dev',
          tags: ['ai', 'maintenance', 'engineering'],
          content: 'Integrating mechanical engineering principles with software sensors is the future of industrial tech.',
          createdAt: '2026-02-15',
        },
      ]);
    }
  }, []);

  useEffect(() => {
    if (posts.length > 0) {
      localStorage.setItem('devtalkx_posts', JSON.stringify(posts));
    }
  }, [posts]);

  // Swipe actions
  const swipe = async (status: 'interested' | 'ignored') => {
    const dev = developers[currentIndex];
    if (!dev) return;
    try {
      const res = await axios.post(
        `${BASE_URL}/request/send/${status}/${dev._id}`,
        {},
        { withCredentials: true }
      );
      if (res.data.match) {
        setSwipeMsg(`🚀 It's a match with ${dev.firstName}!`);
        setTimeout(() => setSwipeMsg(''), 3000);
      }
    } catch (err) {
      console.error('Swipe error:', err);
    }
    setCurrentIndex((i) => i + 1);
  };

  const handleAddPost = (newPost: Post) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handleDeletePost = (id: string) => {
    const updated = posts.filter((p) => p.id !== id);
    setPosts(updated);
    if (updated.length === 0) localStorage.setItem('devtalkx_posts', JSON.stringify([]));
  };

  const currentDev = developers[currentIndex];

  return (
    <div className="bg-[#0b1120] text-slate-200 w-full">

      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* ── DevTalk Tab ── */}
        {tab === 'devtalk' && (
          <div>
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">DevTalkX Feed</h1>
              <p className="text-slate-400">Share knowledge, connect with devs.</p>
            </div>
            <CreatePost onAddPost={handleAddPost} author={user?.firstName || 'dev'} />
            <div className="flex flex-col gap-6 mt-8">
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
                  <p className="text-slate-500 text-lg">No posts yet. Be the first to start a conversation!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── DevMatch Tab ── */}
        {tab === 'devmatch' && (
          <div className="flex flex-col items-center">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
                DevMatch
              </h1>
              <p className="text-slate-500 mt-1">Discover developers to collaborate with.</p>
            </div>

            {swipeMsg && (
              <div className="mb-6 px-6 py-3 bg-green-500/20 border border-green-500/40 rounded-full text-green-400 font-bold animate-bounce">
                {swipeMsg}
              </div>
            )}

            {matchLoading ? (
              <div className="flex flex-col items-center gap-4 py-20">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-slate-500">Loading developers...</p>
              </div>
            ) : currentDev ? (
              <div className="w-full max-w-sm">
                {/* Dev Card */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
                  <div className="relative">
                    <img
                      src={currentDev.photoUrl || 'https://avatar.iran.liara.run/public/coding'}
                      alt={currentDev.firstName}
                      className="w-full h-64 object-cover"
                    />
                    {currentDev.devRole && (
                      <span className="absolute top-4 right-4 px-3 py-1 text-xs font-bold rounded-full bg-blue-600/90 text-white backdrop-blur-sm">
                        {currentDev.devRole}
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <h2 className="text-2xl font-extrabold text-white">
                      {currentDev.firstName} {currentDev.lastName}
                      {currentDev.age && (
                        <span className="text-slate-500 text-lg font-normal">, {currentDev.age}</span>
                      )}
                    </h2>
                    <p className="text-slate-400 text-sm mt-2 italic">
                      "{currentDev.bio || 'No bio yet.'}"
                    </p>
                    {currentDev.skills && currentDev.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {currentDev.skills.slice(0, 5).map((skill) => (
                          <span
                            key={skill}
                            className="text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Swipe Buttons */}
                  <div className="flex gap-4 px-6 pb-6">
                    <button
                      onClick={() => swipe('ignored')}
                      className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-red-500/20 border border-slate-700 hover:border-red-500/40 text-slate-400 hover:text-red-400 font-bold text-lg transition-all"
                    >
                      ✕ Skip
                    </button>
                    <button
                      onClick={() => swipe('interested')}
                      className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg transition-all shadow-lg shadow-blue-900/30"
                    >
                      ♥ Connect
                    </button>
                  </div>
                </div>

                <p className="text-center text-slate-600 text-sm mt-4">
                  {developers.length - currentIndex - 1} developers remaining
                </p>
              </div>
            ) : (
              <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-2xl w-full max-w-sm">
                <div className="text-5xl mb-4">🎉</div>
                <p className="text-slate-400 text-lg font-semibold">You've seen everyone!</p>
                <p className="text-slate-600 text-sm mt-2">Check back later for new developers.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}