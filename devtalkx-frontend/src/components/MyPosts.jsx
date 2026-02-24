import React from "react";
import { FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MyPosts() {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 border border-blue-500/20">
                <FileText size={32} className="text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-slate-200 tracking-tight mb-3">
                My Posts
            </h1>
            <p className="text-slate-400 max-w-md mx-auto mb-8 text-lg">
                The Posts feature is currently in active development. Stay tuned for updates!
            </p>
            <button
                onClick={() => navigate("/")}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-all shadow-lg shadow-blue-900/20"
            >
                Go back to Feed
            </button>
        </div>
    );
}
