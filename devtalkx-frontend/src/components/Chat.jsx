import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addConnections } from "../utils/connectionSlice";
import { setChat, addMessage } from "../utils/chatSlice";
import socket from "../utils/socket";

const Chat = () => {
    const dispatch = useDispatch();
    const user = useSelector((store) => store.user);
    const connections = useSelector((store) => store.connections);
    const chatData = useSelector((store) => store.chat);

    const [selectedUser, setSelectedUser] = useState(null);
    const [newMessage, setNewMessage] = useState("");

    // 1. Fetch Connections
    useEffect(() => {
        const fetchConnections = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/user/connections`, {
                    withCredentials: true,
                });
                dispatch(addConnections(res.data.data));
            } catch (err) {
                console.error("Failed to fetch connections", err);
            }
        };
        fetchConnections();
    }, [dispatch]);

    // 2. Fetch Chat History when a user is selected
    useEffect(() => {
        if (!selectedUser) return;

        const fetchChatStatus = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/chat/${selectedUser._id}`, {
                    withCredentials: true,
                });
                dispatch(setChat({ targetUserId: selectedUser._id, messages: res.data.messages }));

                // Join specific chat room
                socket.emit("joinChat", {
                    firstName: user.firstName,
                    userId: user._id,
                    targetUserId: selectedUser._id
                });
            } catch (err) {
                console.error("Failed to fetch chat history", err);
            }
        };
        fetchChatStatus();
    }, [selectedUser, user.firstName, user._id, dispatch]);

    // 3. Socket Listener for new messages
    useEffect(() => {
        if (!socket) return;

        const handleMessage = (data) => {
            // Check if message belongs to current chat
            if (selectedUser && (data.senderId === selectedUser._id || data.senderId === user._id)) {
                dispatch(addMessage({
                    targetUserId: selectedUser._id,
                    message: {
                        senderId: data.senderId,
                        text: data.text,
                        createdAt: data.createdAt
                    }
                }));
            }
        };

        socket.on("messageReceived", handleMessage);
        return () => socket.off("messageReceived", handleMessage);
    }, [selectedUser, user._id, dispatch]);

    const handleSendMessage = () => {
        if (!newMessage.trim() || !selectedUser) return;

        socket.emit("sendMessage", {
            firstName: user.firstName,
            lastName: user.lastName,
            userId: user._id,
            targetUserId: selectedUser._id,
            text: newMessage
        });

        setNewMessage("");
    };

    const currentMessages = selectedUser ? chatData[selectedUser._id] || [] : [];

    return (
        <div className="flex h-[calc(100vh-64px)] bg-[#020617] text-slate-100">
            {/* Sidebar: Connections */}
            <div className="w-1/3 border-r border-slate-800 flex flex-col">
                <div className="p-4 border-b border-slate-800 bg-[#0f172a]">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        Connections
                    </h2>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {connections && connections.length > 0 ? (
                        connections.map((conn) => (
                            <div
                                key={conn._id}
                                onClick={() => setSelectedUser(conn)}
                                className={`flex items-center gap-4 p-4 cursor-pointer hover:bg-[#1e293b] transition-colors ${selectedUser?._id === conn._id ? 'bg-[#1e293b] border-l-4 border-blue-500' : ''}`}
                            >
                                <img src={conn.photoUrl} alt={conn.firstName} className="w-12 h-12 rounded-full object-cover border-2 border-slate-700" />
                                <div className="flex-1 overflow-hidden">
                                    <h3 className="font-semibold truncate">{conn.firstName} {conn.lastName}</h3>
                                    <p className="text-xs text-slate-400 truncate">{conn.devRole || "Developer"}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-10 text-center text-slate-500">
                            <p>No connections yet.</p>
                            <p className="text-sm mt-2">Start liking developers on the feed!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Panel */}
            <div className="flex-1 flex flex-col">
                {selectedUser ? (
                    <>
                        {/* Header */}
                        <div className="p-4 border-b border-slate-800 bg-[#0f172a] flex items-center gap-4">
                            <img src={selectedUser.photoUrl} alt={selectedUser.firstName} className="w-10 h-10 rounded-full object-cover" />
                            <div>
                                <h3 className="font-bold">{selectedUser.firstName} {selectedUser.lastName}</h3>
                                <div className="flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                    <span className="text-xs text-slate-400">Online</span>
                                </div>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50">
                            {currentMessages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.senderId === user._id ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] p-3 rounded-2xl ${msg.senderId === user._id
                                        ? 'bg-blue-600 text-white rounded-tr-none'
                                        : 'bg-slate-800 text-slate-100 rounded-tl-none'}`}>
                                        <p className="text-sm">{msg.text}</p>
                                        <span className="text-[10px] opacity-50 block mt-1 text-right">
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-slate-800 bg-[#0f172a]">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-slate-800 border-none rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-transform active:scale-90"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-500 bg-slate-900/30">
                        <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.3.024-.603.04-.907.048a19.286 19.286 0 01-4.504-.42c-.415-.1-.83-.222-1.245-.371l-3.235 2.316a.75.75 0 01-1.187-.616V17.5a12.113 12.113 0 01-1.022-.293l-3.41 1.705A.75.75 0 012.25 18.25v-8.25a.75.75 0 01.75-.75h14.5a.75.75 0 01.75.75v5.132c1.17 1.104 2.172 2.132 3.011 3.008.3-.024.603-.04.907-.048a.75.75 0 01.75.75v-6.391c0-.969.616-1.813 1.5-2.097z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 9.75h12M8.25 12.75h6" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-300">Your Messages</h3>
                        <p className="max-w-xs text-center mt-2">Select a connection from the left to start a conversation with a fellow developer.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;
