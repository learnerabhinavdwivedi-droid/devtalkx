import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import socket from "./utils/socket"; // Ensure you have a socket config file
import { addUser } from "./utils/userSlice";
import NavBar from "./components/NavBar";
import Feed from "./components/Feed";
import Login from "./components/Login";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);

  // 🚀 BEAST MODE: Real-time Match Listener
  useEffect(() => {
    if (user && socket) {
      // Join a private room unique to this user's ID for targeted alerts
      socket.emit("join_private_room", user._id);

      // Listen for the 'match_alert' emitted by the backend requestRouter
      socket.on("match_alert", (data) => {
        // You can replace this alert with a professional Toast notification later
        alert(data.message); 
        
        // 💎 Next Step: You could dispatch an action to refresh 
        // the connections list in Redux here
      });
    }

    // Cleanup: Remove listener when component unmounts to prevent memory leaks
    return () => {
      if (socket) socket.off("match_alert");
    };
  }, [user]);

  return (
    <div className="bg-slate-950 min-h-screen text-white">
      <BrowserRouter basename="/">
        <NavBar />
        <Routes>
          <Route 
            path="/" 
            element={
              user ? (
                <Feed />
              ) : (
                <div className="flex h-[80vh] items-center justify-center">
                  <h1 className="text-5xl font-bold text-blue-500 animate-pulse">
                    DEVMATCH ENGINE ACTIVE 🚀
                  </h1>
                </div>
              )
            } 
          />
          <Route path="/login" element={<Login />} />
          {/* Add more routes like /profile and /connections here */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;