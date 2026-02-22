import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import socket from "./utils/socket";
import { addUser } from "./utils/userSlice";
import { BASE_URL } from "./utils/constants";
import NavBar from "./components/navbar";
import Feed from "./components/Feed";
import Login from "./components/Login";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);

  // On mount, verify the JWT cookie and load the user into Redux
  useEffect(() => {
    if (!user) {
      axios
        .get(`${BASE_URL}/profile/view`, { withCredentials: true })
        .then((res) => dispatch(addUser(res.data)))
        .catch(() => {
          // Not authenticated — user stays null, will be redirected to /login
        });
    }
  }, []);

  // Real-time Match Listener — connect socket only after user is authenticated
  useEffect(() => {
    if (user && socket) {
      socket.connect();                          // lazy connect with JWT cookie
      socket.emit("join_private_room", user._id);
      socket.on("match_alert", (data) => {
        alert(data.message);
      });
    }
    return () => {
      if (socket) {
        socket.off("match_alert");
        if (!user) socket.disconnect();          // clean up if user logs out
      }
    };
  }, [user]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100">
      <BrowserRouter basename="/">
        <NavBar />
        <Routes>
          <Route
            path="/"
            element={
              user ? <Feed /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/login"
            element={
              user ? <Navigate to="/" replace /> : <Login />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;