const { io } = require("socket.io-client");
const mongoose = require("mongoose");

const socket = io("http://localhost:5002", {
    withCredentials: true,
});

socket.on("connect", () => {
    console.log("Connected as", socket.id);

    socket.emit("join_community", { firstName: "Test", userId: new mongoose.Types.ObjectId().toString() });

    const payload = {
        firstName: "Test",
        lastName: "User",
        userId: new mongoose.Types.ObjectId().toString(), // fake valid user id
        photoUrl: "http://example.com/photo.jpg",
        text: "Hello from test script!",
        messageType: "text"
    };

    console.log("Emitting send_community_message with payload:", payload);
    socket.emit("send_community_message", payload);
});

socket.on("community_message_received", (msg) => {
    console.log("SUCCESS! Message received:", msg);
    process.exit(0);
});

socket.on("error", (err) => {
    console.error("SOCKET ERROR:", err);
    process.exit(1);
});

setTimeout(() => {
    console.log("Timeout waiting for message");
    process.exit(1);
}, 5000);
