import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import UserCard from "./UserCard"; // Adjusting based on previous checks if we reuse this or write inline

export default function Connections() {
    const [connections, setConnections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchConnections = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/user/connections`, {
                    withCredentials: true,
                });
                setConnections(res.data.data || []);
            } catch (err) {
                setError(err.response?.data?.message || err.message || "Failed to load connections.");
            } finally {
                setLoading(false);
            }
        };

        fetchConnections();
    }, []);

    if (loading) {
        return (
            <div className="bg-[#0b1120] min-h-[calc(100vh-64px)] flex justify-center items-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="bg-[#0b1120] min-h-[calc(100vh-64px)] py-8 px-4 text-slate-200">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-2">My Connections</h1>
                <p className="text-slate-400 mb-8">People you have mutually matched with.</p>

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {connections.length === 0 && !error ? (
                    <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-2xl">
                        <div className="text-5xl mb-4">🤝</div>
                        <p className="text-slate-400 text-lg font-semibold">No connections yet.</p>
                        <p className="text-slate-600 text-sm mt-2">Go to DevMatch to find a developer to collaborate with!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {connections.map((dev) => (
                            <div key={dev._id} className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow flex flex-col">
                                <img
                                    src={dev.photoUrl || "https://avatar.iran.liara.run/public/coding"}
                                    alt={dev.firstName}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-4 flex-1 flex flex-col">
                                    <h2 className="text-xl font-bold text-white mb-1">
                                        {dev.firstName} {dev.lastName}
                                    </h2>
                                    {dev.devRole && (
                                        <span className="text-sm font-semibold text-blue-400 mb-2">{dev.devRole}</span>
                                    )}
                                    <p className="text-slate-400 text-sm line-clamp-2 mb-4 italic">
                                        "{dev.bio || "No bio available."}"
                                    </p>
                                    {dev.skills && dev.skills.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-auto">
                                            {dev.skills.slice(0, 3).map(skill => (
                                                <span key={skill} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                                                    {skill}
                                                </span>
                                            ))}
                                            {dev.skills.length > 3 && (
                                                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-500">
                                                    +{dev.skills.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
