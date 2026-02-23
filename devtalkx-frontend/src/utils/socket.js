import { io } from "socket.io-client";

// The URL must match your Backend server port
const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:5002";

const socket = io(SOCKET_URL, {
    withCredentials: true, // Required to pass JWT cookies for authentication
    autoConnect: false,    // Lazy connect — call socket.connect() after login
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
});

export default socket;