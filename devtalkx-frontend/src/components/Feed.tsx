import React, { useState, useEffect } from 'react';
import axios from 'axios';
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

export default function Feed() {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [swipeMsg, setSwipeMsg] = useState('');

  // Load developers from backend
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/feed`, { withCredentials: true })
      .then((res) => {
        setDevelopers(res.data.data || []);
      })
      .catch((err) => console.error('Feed error:', err))
      .finally(() => setLoading(false));
  }, []);

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

  const currentDev = developers[currentIndex];

  return (
    <div className="bg-[#0b1120] min-h-screen text-slate-200 w-full flex flex-col items-center">
      <div className="w-full max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
            DevMatch Feed
          </h1>
          <p className="text-slate-500 mt-1">Discover developers to collaborate with.</p>
        </div>

        {swipeMsg && (
          <div className="mb-6 px-6 py-3 bg-green-500/20 border border-green-500/40 rounded-full text-green-400 font-bold animate-bounce text-center">
            {swipeMsg}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center gap-4 py-20">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-500">Finding developers...</p>
          </div>
        ) : currentDev ? (
          <div className="w-full max-w-sm mx-auto">
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
                <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
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
          <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-2xl w-full max-w-sm mx-auto">
            <div className="text-5xl mb-4">🎉</div>
            <p className="text-slate-400 text-lg font-semibold">You've seen everyone!</p>
            <p className="text-slate-600 text-sm mt-2">Check back later for new developers.</p>
          </div>
        )}

      </div>
    </div>
  );
}