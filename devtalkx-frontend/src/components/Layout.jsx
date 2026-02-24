import React, { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { removeUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";
import {
    MessageCircle,
    Rocket,
    Layout as LayoutIcon,
    Bookmark,
    Settings,
    LogOut,
    Search,
    Bell,
    Menu,
    X,
    FileText,
    MessageSquare,
    Users
} from 'lucide-react';

export default function Layout({ children }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const user = useSelector((store) => store.user);

    const handleLogout = async () => {
        try {
            await axios.post(`${BASE_URL}/logout`, {}, { withCredentials: true });
            dispatch(removeUser());
            navigate("/login");
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    const navItems = [
        { id: 'feed', path: '/', label: 'DevTalk Feed', icon: MessageCircle },
        { id: 'match', path: '/match', label: 'DevMatch', icon: Rocket },
        { id: 'connections', path: '/connections', label: 'Connections', icon: Bookmark },
        { id: 'explore', path: '/explore', label: 'Explore', icon: LayoutIcon },
        { id: 'community', path: '/community', label: 'Community', icon: Users },
        { id: 'chat', path: '/chat', label: 'Chat', icon: MessageSquare },
        { id: 'myposts', path: '/myposts', label: 'My Posts', icon: FileText },
    ];

    const activeTab = location.pathname.includes('/chat') ? 'chat'
        : location.pathname.includes('/match') ? 'match'
            : location.pathname.includes('/explore') ? 'explore'
                : location.pathname.includes('/myposts') ? 'myposts'
                    : location.pathname.includes('/connections') ? 'connections'
                        : location.pathname.includes('/community') ? 'community'
                            : 'feed';

    return (
        <div className="min-h-screen bg-[#0b1120] text-slate-200 font-sans flex flex-col">
            <header className="sticky top-0 z-30 flex items-center justify-between px-4 h-16 bg-[#111827] border-b border-slate-800">
                <div className="flex items-center gap-4">
                    <button
                        className="p-2 -ml-2 rounded-lg lg:hidden hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>

                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
                        <div className="relative flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
                            <MessageCircle size={18} className="text-white fill-current" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-blue-500">DevTalk<span className="text-white">X</span></span>
                    </div>
                </div>

                <div className="flex items-center gap-3 md:gap-6">
                    <div className="hidden md:flex items-center relative">
                        <Search size={18} className="absolute left-3 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search posts, tags..."
                            className="pl-10 pr-4 py-2 bg-[#0b1120] border border-slate-800 rounded-full text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all w-64 placeholder-slate-500"
                        />
                    </div>

                    <button onClick={() => navigate("/notifications")} className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors relative">
                        <Bell size={20} />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#111827]"></span>
                    </button>

                    <div className="flex items-center gap-3 pl-2 md:pl-4 border-l border-slate-800">
                        {user ? (
                            <>
                                <div className="hidden sm:flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate("/profile")} title="Edit Profile">
                                    <img
                                        src={user.photoUrl || "https://avatar.iran.liara.run/public/coding"}
                                        alt="Profile"
                                        className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 object-cover"
                                    />
                                    <span className="text-sm font-medium text-slate-200">{user.firstName} {user.lastName}</span>
                                </div>
                                <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors border border-red-400/20 hover:border-red-400/30">
                                    <LogOut size={16} />
                                    <span className="hidden sm:inline">Logout</span>
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => navigate("/login")}
                                className="px-4 py-1.5 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-all"
                            >
                                Login
                            </button>
                        )}

                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden relative">
                {user && (
                    <aside className={`
            absolute lg:static inset-y-0 left-0 z-20 w-64 bg-[#111827] border-r border-slate-800 transform transition-transform duration-200 ease-in-out
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            flex flex-col
          `}>
                        <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-3">
                                Menu
                            </div>

                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = activeTab === item.id;

                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            if (item.path !== '#') {
                                                navigate(item.path);
                                            }
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                      ${isActive
                                                ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20'
                                                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                                            }
                    `}
                                    >
                                        <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
                                        {item.label}
                                    </button>
                                );
                            })}

                            <div className="mt-8 pt-8 border-t border-slate-800/50">
                                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-3">
                                    Settings
                                </div>
                                <button
                                    onClick={() => {
                                        navigate('/profile');
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 transition-all duration-200"
                                >
                                    <Settings size={18} />
                                    My Profile
                                </button>
                                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 transition-all duration-200">
                                    <FileText size={18} />
                                    Preferences
                                </button>
                            </div>
                        </div>

                        <div className="p-4 border-t border-slate-800 sm:hidden">
                            <div className="flex items-center gap-3 mb-4">
                                <img
                                    src={user.photoUrl || "https://avatar.iran.liara.run/public/coding"}
                                    alt="Profile"
                                    className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 object-cover"
                                />
                                <div>
                                    <div className="text-sm font-medium text-slate-200">{user.firstName} {user.lastName}</div>
                                    <div className="text-xs text-slate-500">{user.devRole || "Developer"}</div>
                                </div>
                            </div>
                        </div>
                    </aside>
                )}

                {isMobileMenuOpen && (
                    <div
                        className="absolute inset-0 bg-black/50 z-10 lg:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                )}

                <main className="flex-1 overflow-y-auto bg-[#0b1120]">
                    {children}
                </main>
            </div>
        </div>
    );
}
