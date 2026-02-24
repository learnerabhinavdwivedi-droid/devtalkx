import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { Image, Smile, Paperclip, Send, File as FileIcon } from 'lucide-react';
import { BASE_URL } from '../utils/constants';

// @ts-ignore
import socket from '../utils/socket';


export default function Community() {
    const user = useSelector((store: any) => store.user);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [gifUrlInput, setGifUrlInput] = useState("");
    const [showGifInput, setShowGifInput] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!user) return;

        socket.emit("join_community", { firstName: user.firstName, userId: user._id });

        // Assuming we'd want to fetch past history here, but keeping it real-time focused for now

        const handleNewMessage = (msg: any) => {
            setMessages((prev) => [...prev, msg]);
        };

        socket.on("community_message_received", handleNewMessage);

        return () => {
            socket.off("community_message_received", handleNewMessage);
        };
    }, [user]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() && !selectedFile && !gifUrlInput.trim()) return;

        let fileData = null;

        if (selectedFile) {
            setIsUploading(true);
            const formData = new FormData();
            formData.append("file", selectedFile);

            try {
                const res = await axios.post(`${BASE_URL}/upload`, formData, {
                    withCredentials: true,
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                fileData = res.data.file;
            } catch (err) {
                console.error("Upload failed", err);
                setIsUploading(false);
                return; // Stop if upload fails
            }
            setIsUploading(false);
        }

        const messagePayload = {
            firstName: user.firstName,
            lastName: user.lastName,
            userId: user._id,
            photoUrl: user.photoUrl,
            text: newMessage,
            messageType: fileData ? "file" : (gifUrlInput ? "gif" : "text"),
            fileUrl: fileData?.url,
            fileName: fileData?.name,
            fileMimeType: fileData?.type,
            gifUrl: gifUrlInput || null
        };

        socket.emit("send_community_message", messagePayload);

        setNewMessage("");
        setSelectedFile(null);
        setGifUrlInput("");
        setShowGifInput(false);
        setShowEmojiPicker(false);
    };

    const onEmojiClick = (emojiObject: any) => {
        setNewMessage(prev => prev + emojiObject.emoji);
    };

    const renderMessageContent = (msg: any) => {
        if (msg.messageType === 'file') {
            const isImage = msg.fileMimeType?.startsWith('image/');
            return isImage ? (
                <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer">
                    <img src={msg.fileUrl} alt={msg.fileName} className="max-w-xs rounded-lg mt-2 border border-slate-700 hover:opacity-90 transition-opacity" />
                </a>
            ) : (
                <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 mt-2 p-3 bg-slate-800 rounded-lg text-blue-400 hover:text-blue-300 transition-colors w-fit">
                    <FileIcon size={20} />
                    <span className="text-sm underline break-all">{msg.fileName}</span>
                </a>
            );
        }

        if (msg.messageType === 'gif') {
            return <img src={msg.gifUrl} alt="GIF" className="max-w-xs rounded-lg mt-2 border border-slate-700" />;
        }

        return <p className="text-slate-200 mt-1 whitespace-pre-wrap">{msg.text}</p>;
    };

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] bg-[#0b1120] text-slate-200">
            {/* Header */}
            <div className="p-6 border-b border-slate-800 bg-[#111827] flex items-center gap-3">
                <div className="p-3 bg-blue-600/20 rounded-xl">
                    <span className="text-2xl">🌍</span>
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white">Global Community</h1>
                    <p className="text-slate-400 text-sm">Chat, share files, and connect with developers worldwide.</p>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
                        <span className="text-5xl">💬</span>
                        <p>Welcome to the Community Chat. Start the conversation!</p>
                    </div>
                ) : (
                    messages.map((msg, idx) => {
                        const isMe = msg.senderId === user._id;
                        return (
                            <div key={idx} className={`flex gap-4 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                <img
                                    src={msg.photoUrl || "https://avatar.iran.liara.run/public/coding"}
                                    alt={msg.firstName}
                                    className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-700 object-cover flex-shrink-0"
                                />
                                <div className={`flex flex-col max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
                                    <div className="flex items-baseline gap-2 mb-1">
                                        <span className="text-sm font-semibold text-slate-300">{msg.firstName} {msg.lastName}</span>
                                        <span className="text-xs text-slate-500">
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <div className={`px-5 py-3 rounded-2xl ${isMe ? 'bg-blue-600 rounded-tr-sm text-white' : 'bg-slate-800 rounded-tl-sm text-slate-200'} shadow-md`}>
                                        {(msg.text && msg.messageType !== 'text') && <p className="mb-2 whitespace-pre-wrap">{msg.text}</p>}
                                        {renderMessageContent(msg)}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-[#111827] border-t border-slate-800 relative">

                {/* Attachment preview */}
                {selectedFile && (
                    <div className="absolute bottom-full mb-2 left-4 bg-slate-800 border border-slate-700 p-2 rounded-lg flex items-center gap-3">
                        <FileIcon size={16} className="text-blue-400" />
                        <span className="text-sm text-slate-300 max-w-[200px] truncate">{selectedFile.name}</span>
                        <button onClick={() => setSelectedFile(null)} className="text-slate-500 hover:text-red-400">✕</button>
                    </div>
                )}

                {/* GIF Input Dropdown */}
                {showGifInput && (
                    <div className="absolute bottom-full mb-2 left-4 bg-slate-800 border border-slate-700 p-3 rounded-lg flex items-center gap-2 shadow-xl">
                        <input
                            type="text"
                            placeholder="Paste GIF URL..."
                            value={gifUrlInput}
                            onChange={(e) => setGifUrlInput(e.target.value)}
                            className="bg-slate-900 border border-slate-700 rounded-md px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500 w-64"
                        />
                        <button onClick={() => { setShowGifInput(false); setGifUrlInput(""); }} className="text-slate-400 hover:text-white text-xs">Close</button>
                    </div>
                )}

                {/* Emoji Picker */}
                {showEmojiPicker && (
                    <div className="absolute bottom-full mb-2 right-4 shadow-2xl z-50">
                        <EmojiPicker onEmojiClick={onEmojiClick} theme={Theme.DARK} />
                    </div>
                )}

                <div className="flex gap-2 items-center bg-[#0b1120] border border-slate-800 p-2 rounded-2xl shadow-inner max-w-5xl mx-auto w-full">
                    <div className="flex gap-1 pl-2 text-slate-400">
                        {/* File Upload Button */}
                        <label className="p-2 hover:bg-slate-800 rounded-full transition-colors cursor-pointer" title="Attach File">
                            <input type="file" className="hidden" onChange={handleFileChange} />
                            <Paperclip size={20} />
                        </label>

                        {/* GIF Button */}
                        <button
                            className={`p-2 hover:bg-slate-800 rounded-full transition-colors ${showGifInput ? 'text-blue-400' : ''}`}
                            onClick={() => { setShowGifInput(!showGifInput); setShowEmojiPicker(false); }}
                            title="Share GIF URL"
                        >
                            <Image size={20} />
                        </button>

                        {/* Emoji Button */}
                        <button
                            className={`p-2 hover:bg-slate-800 rounded-full transition-colors ${showEmojiPicker ? 'text-blue-400' : ''}`}
                            onClick={() => { setShowEmojiPicker(!showEmojiPicker); setShowGifInput(false); }}
                            title="Add Emoji"
                        >
                            <Smile size={20} />
                        </button>
                    </div>

                    <input
                        type="text"
                        className="flex-1 bg-transparent px-2 py-3 text-white focus:outline-none placeholder-slate-500"
                        placeholder="Type a message to the community..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        disabled={isUploading}
                    />

                    <button
                        onClick={handleSendMessage}
                        disabled={isUploading || (!newMessage.trim() && !selectedFile && !gifUrlInput.trim())}
                        className="p-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all shadow-lg"
                    >
                        {isUploading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Send size={20} />}
                    </button>
                </div>
            </div>
        </div>
    );
}
